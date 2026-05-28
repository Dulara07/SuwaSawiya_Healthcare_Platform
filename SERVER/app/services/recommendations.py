from __future__ import annotations

import json
import math
import random
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.models.donation import Donation
from app.models.interaction import InteractionLog
from app.models.recommendation_impression import RecommendationImpression
from app.models.user import User


ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
ARTIFACT_PATH = ARTIFACT_DIR / "recommendation_artifact.json"
LATENT_DIMENSIONS = 6
ALS_ITERATIONS = 8
ALS_LAMBDA = 0.08
ALS_ALPHA = 18.0
TOKEN_PATTERN = re.compile(r"[a-z0-9]+")
STOPWORDS = {
    "and",
    "the",
    "for",
    "with",
    "from",
    "this",
    "that",
    "need",
    "help",
    "patient",
    "campaign",
    "support",
    "medical",
    "of",
    "to",
    "in",
    "on",
    "a",
    "an",
    "is",
    "are",
    "be",
    "by",
    "our",
    "your",
}


def _utc_now() -> Any:
    from datetime import datetime

    return datetime.utcnow()


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _vector_norm(vector: Dict[str, float]) -> float:
    return math.sqrt(sum(weight * weight for weight in vector.values())) or 1.0


def _normalize_vector(vector: Dict[str, float]) -> Dict[str, float]:
    norm = _vector_norm(vector)
    return {key: weight / norm for key, weight in vector.items() if weight}


def _add_vectors(destination: Dict[str, float], source: Dict[str, float], scale: float = 1.0) -> None:
    for key, value in source.items():
        destination[key] = destination.get(key, 0.0) + value * scale


def _tokenize(text: str) -> List[str]:
    tokens = []
    for token in TOKEN_PATTERN.findall((text or "").lower()):
        if token not in STOPWORDS and len(token) > 1:
            tokens.append(token)
    return tokens


def _dot(left: Sequence[float], right: Sequence[float]) -> float:
    return sum(a * b for a, b in zip(left, right))


def _outer(vector: Sequence[float]) -> List[List[float]]:
    return [[left * right for right in vector] for left in vector]


def _mat_add(left: List[List[float]], right: List[List[float]], scale: float = 1.0) -> List[List[float]]:
    return [
        [left[row][col] + right[row][col] * scale for col in range(len(left[row]))]
        for row in range(len(left))
    ]


def _vec_add(left: Sequence[float], right: Sequence[float], scale: float = 1.0) -> List[float]:
    return [left[index] + right[index] * scale for index in range(len(left))]


def _identity(size: int, scale: float = 1.0) -> List[List[float]]:
    return [[scale if row == col else 0.0 for col in range(size)] for row in range(size)]


def _solve_linear_system(matrix: List[List[float]], vector: Sequence[float]) -> List[float]:
    augmented = [row[:] + [vector[index]] for index, row in enumerate(matrix)]
    size = len(vector)

    for pivot_index in range(size):
        pivot_row = max(range(pivot_index, size), key=lambda row: abs(augmented[row][pivot_index]))
        augmented[pivot_index], augmented[pivot_row] = augmented[pivot_row], augmented[pivot_index]
        pivot = augmented[pivot_index][pivot_index]
        if abs(pivot) < 1e-12:
            augmented[pivot_index][pivot_index] = pivot = 1e-12
        for column in range(pivot_index, size + 1):
            augmented[pivot_index][column] /= pivot
        for row in range(size):
            if row == pivot_index:
                continue
            factor = augmented[row][pivot_index]
            if abs(factor) < 1e-12:
                continue
            for column in range(pivot_index, size + 1):
                augmented[row][column] -= factor * augmented[pivot_index][column]

    return [augmented[row][size] for row in range(size)]


def _cosine_similarity(left: Dict[str, float], right: Dict[str, float]) -> float:
    if not left or not right:
        return 0.0
    shared = set(left).intersection(right)
    numerator = sum(left[key] * right[key] for key in shared)
    denominator = _vector_norm(left) * _vector_norm(right)
    return numerator / denominator if denominator else 0.0


def _campaign_status_score(campaign: Campaign) -> float:
    urgency = _safe_float(campaign.medical_urgency, 0.0) / 5.0
    time_sensitivity = _safe_float(campaign.time_sensitivity, 0.0) / 5.0
    target_amount = max(_safe_float(campaign.target_amount, 0.0), 1.0)
    raised_amount = max(_safe_float(campaign.raised_amount, 0.0), 0.0)
    funding_gap = max(target_amount - raised_amount, 0.0) / target_amount
    return round(urgency * 0.45 + time_sensitivity * 0.25 + funding_gap * 0.30, 6)


def _verification_score(document_count: int) -> float:
    return min(document_count / 4.0, 1.0)


def _recency_score(created_at: Any, now: Any) -> float:
    if created_at is None:
        return 0.0
    age_days = max((now - created_at).total_seconds() / 86400.0, 0.0)
    return math.exp(-age_days / 30.0)


def _funding_gap_score(campaign: Campaign) -> float:
    target_amount = max(_safe_float(campaign.target_amount, 0.0), 1.0)
    raised_amount = max(_safe_float(campaign.raised_amount, 0.0), 0.0)
    return max(target_amount - raised_amount, 0.0) / target_amount


def _campaign_text(campaign: Campaign) -> str:
    return " ".join(
        part
        for part in [
            campaign.title,
            campaign.description,
            campaign.category,
            campaign.beneficiary_name,
            campaign.beneficiary_medical_condition,
        ]
        if part
    )


def _campaign_embedding(campaign: Campaign, idf: Dict[str, float], document_count: int, now: Any) -> Dict[str, float]:
    tokens = _tokenize(_campaign_text(campaign))
    term_frequency = Counter(tokens)
    vector: Dict[str, float] = {}
    token_count = max(len(tokens), 1)
    for token, count in term_frequency.items():
        vector[token] = (count / token_count) * idf.get(token, 1.0)

    vector["__urgency"] = _safe_float(campaign.medical_urgency, 0.0) / 5.0
    vector["__time"] = _safe_float(campaign.time_sensitivity, 0.0) / 5.0
    vector["__verification"] = _verification_score(document_count)
    vector["__funding_gap"] = _funding_gap_score(campaign)
    vector["__recency"] = _recency_score(campaign.created_at, now)
    return _normalize_vector(vector)


def _weighted_average(vectors: Iterable[Tuple[Dict[str, float], float]]) -> Dict[str, float]:
    merged: Dict[str, float] = defaultdict(float)
    total_weight = 0.0
    for vector, weight in vectors:
        if not vector or weight <= 0:
            continue
        _add_vectors(merged, vector, weight)
        total_weight += weight
    if total_weight <= 0:
        return {}
    return _normalize_vector({key: value / total_weight for key, value in merged.items()})


def _interaction_weight(event_type: str, weight: float, amount: Optional[float] = None) -> float:
    event_type = (event_type or "").lower()
    base_weights = {
        "impression": 0.15,
        "view": 0.35,
        "click": 0.75,
        "donation": 3.0,
    }
    base = base_weights.get(event_type, 0.25)
    if amount is not None:
        base += math.log1p(max(amount, 0.0)) * 0.5
    return max(base * max(weight, 0.1), 0.01)


def _event_label(event_type: str) -> int:
    return 1 if (event_type or "").lower() in {"donation", "click"} else 0


def _default_feature_weights() -> List[float]:
    return [1.2, 1.0, 1.15, 0.95, 0.55, 0.85, 0.45, 0.15, 0.0]


def _extract_campaign_payload(campaign: Campaign) -> Dict[str, Any]:
    return {
        "id": campaign.id,
        "title": campaign.title,
        "description": campaign.description,
        "category": campaign.category,
        "beneficiary_name": campaign.beneficiary_name,
        "beneficiary_age": campaign.beneficiary_age,
        "beneficiary_medical_condition": campaign.beneficiary_medical_condition,
        "medical_urgency": campaign.medical_urgency,
        "time_sensitivity": campaign.time_sensitivity,
        "target_amount": _safe_float(campaign.target_amount, 0.0),
        "raised_amount": _safe_float(campaign.raised_amount, 0.0),
        "status": campaign.status,
        "priority_score": _safe_float(campaign.priority_score, 0.0),
        "created_at": campaign.created_at.isoformat() if campaign.created_at else None,
        "updated_at": campaign.updated_at.isoformat() if campaign.updated_at else None,
        "owner_id": campaign.owner_id,
    }


def _feature_vector(
    campaign: Campaign,
    campaign_embedding: Dict[str, float],
    content_score: float,
    collaborative_score: float,
    popularity_score: float,
) -> List[float]:
    urgency = _safe_float(campaign.medical_urgency, 0.0) / 5.0
    verification = campaign_embedding.get("__verification", 0.0)
    recency = campaign_embedding.get("__recency", 0.0)
    funding_gap = campaign_embedding.get("__funding_gap", 0.0)
    priority_score = _campaign_status_score(campaign)
    return [
        collaborative_score,
        content_score,
        urgency,
        verification,
        recency,
        funding_gap,
        popularity_score,
        priority_score,
        1.0,
    ]


def _score_from_weights(weights: Sequence[float], features: Sequence[float]) -> float:
    return _dot(weights, features)


def _sigmoid(value: float) -> float:
    if value >= 0:
        z = math.exp(-value)
        return 1.0 / (1.0 + z)
    z = math.exp(value)
    return z / (1.0 + z)


def _train_logistic_weights(samples: List[Tuple[List[float], int]]) -> List[float]:
    if not samples:
        return _default_feature_weights()

    weights = [0.0] * len(samples[0][0])
    learning_rate = 0.08
    for _ in range(120):
        gradient = [0.0] * len(weights)
        for features, label in samples:
            prediction = _sigmoid(_dot(weights, features))
            error = prediction - label
            for index, feature in enumerate(features):
                gradient[index] += error * feature
        for index in range(len(weights)):
            weights[index] -= learning_rate * (gradient[index] / len(samples) + 0.002 * weights[index])
    return weights


def _train_als(
    user_item_weights: Dict[int, Dict[int, float]],
    item_ids: List[int],
    user_ids: List[int],
    latent_dimensions: int = LATENT_DIMENSIONS,
) -> Tuple[Dict[int, List[float]], Dict[int, List[float]]]:
    random.seed(42)
    user_factors = {
        user_id: [random.uniform(-0.05, 0.05) for _ in range(latent_dimensions)]
        for user_id in user_ids
    }
    item_factors = {
        item_id: [random.uniform(-0.05, 0.05) for _ in range(latent_dimensions)]
        for item_id in item_ids
    }

    for _ in range(ALS_ITERATIONS):
        item_transpose = [item_factors[item_id] for item_id in item_ids]
        yty = _identity(latent_dimensions, 0.0)
        for vector in item_transpose:
            yty = _mat_add(yty, _outer(vector), 1.0)

        for user_id in user_ids:
            interactions = user_item_weights.get(user_id, {})
            matrix = _mat_add(yty, _identity(latent_dimensions, ALS_LAMBDA))
            vector = [0.0] * latent_dimensions
            for item_id, raw_weight in interactions.items():
                item_vector = item_factors.get(item_id)
                if item_vector is None:
                    continue
                confidence = 1.0 + ALS_ALPHA * raw_weight
                matrix = _mat_add(matrix, _outer(item_vector), confidence - 1.0)
                vector = _vec_add(vector, item_vector, confidence)
            user_factors[user_id] = _solve_linear_system(matrix, vector)

        xtx = _identity(latent_dimensions, 0.0)
        for vector in user_factors.values():
            xtx = _mat_add(xtx, _outer(vector), 1.0)

        for item_id in item_ids:
            matrix = _mat_add(xtx, _identity(latent_dimensions, ALS_LAMBDA))
            vector = [0.0] * latent_dimensions
            for user_id, interactions in user_item_weights.items():
                raw_weight = interactions.get(item_id)
                if raw_weight is None:
                    continue
                user_vector = user_factors.get(user_id)
                if user_vector is None:
                    continue
                confidence = 1.0 + ALS_ALPHA * raw_weight
                matrix = _mat_add(matrix, _outer(user_vector), confidence - 1.0)
                vector = _vec_add(vector, user_vector, confidence)
            item_factors[item_id] = _solve_linear_system(matrix, vector)

    return user_factors, item_factors


class RecommendationEngine:
    def __init__(self, artifact_path: Path = ARTIFACT_PATH):
        self.artifact_path = artifact_path

    def load_artifact(self) -> Optional[Dict[str, Any]]:
        if not self.artifact_path.is_file():
            return None
        return json.loads(self.artifact_path.read_text(encoding="utf-8"))

    def save_artifact(self, artifact: Dict[str, Any]) -> Path:
        self.artifact_path.parent.mkdir(parents=True, exist_ok=True)
        self.artifact_path.write_text(json.dumps(artifact, indent=2, sort_keys=True), encoding="utf-8")
        return self.artifact_path

    def train_from_db(self, db: Session) -> Dict[str, Any]:
        now = _utc_now()
        campaigns = db.query(Campaign).filter(Campaign.status != "rejected").all()
        users = db.query(User).all()
        donations = db.query(Donation).all()
        interactions = db.query(InteractionLog).all()

        campaign_documents: Dict[int, int] = defaultdict(int)
        for campaign in campaigns:
            campaign_documents[campaign.id] = len(campaign.documents or [])

        token_document_frequency: Counter[str] = Counter()
        for campaign in campaigns:
            tokens = _tokenize(_campaign_text(campaign))
            token_document_frequency.update(set(tokens))

        idf = {
            token: math.log((1 + len(campaigns)) / (1 + document_frequency)) + 1.0
            for token, document_frequency in token_document_frequency.items()
        }

        campaign_embeddings: Dict[int, Dict[str, float]] = {
            campaign.id: _campaign_embedding(campaign, idf, campaign_documents[campaign.id], now)
            for campaign in campaigns
        }

        user_item_weights: Dict[int, Dict[int, float]] = defaultdict(dict)
        user_histories: Dict[int, List[Tuple[int, float]]] = defaultdict(list)
        popularity_weights: Dict[int, float] = defaultdict(float)

        for donation in donations:
            weight = _interaction_weight("donation", 1.0, donation.amount)
            user_item_weights[donation.donor_id][donation.campaign_id] = user_item_weights[donation.donor_id].get(donation.campaign_id, 0.0) + weight
            user_histories[donation.donor_id].append((donation.campaign_id, weight))
            popularity_weights[donation.campaign_id] += weight

        for interaction in interactions:
            interaction_weight = _interaction_weight(interaction.event_type, interaction.weight)
            if interaction.user_id is not None:
                user_item_weights[interaction.user_id][interaction.campaign_id] = user_item_weights[interaction.user_id].get(interaction.campaign_id, 0.0) + interaction_weight
                user_histories[interaction.user_id].append((interaction.campaign_id, interaction_weight))
            popularity_weights[interaction.campaign_id] += interaction_weight

        user_profiles: Dict[int, Dict[str, float]] = {}
        for user in users:
            history = user_histories.get(user.id, [])
            vectors = []
            for campaign_id, weight in history:
                campaign_vector = campaign_embeddings.get(campaign_id)
                if campaign_vector:
                    vectors.append((campaign_vector, weight))
            user_profiles[user.id] = _weighted_average(vectors)

        if user_item_weights:
            user_factors, campaign_factors = _train_als(
                user_item_weights,
                [campaign.id for campaign in campaigns],
                [user.id for user in users],
            )
        else:
            user_factors = {user.id: [0.0] * LATENT_DIMENSIONS for user in users}
            campaign_factors = {campaign.id: [0.0] * LATENT_DIMENSIONS for campaign in campaigns}

        samples: List[Tuple[List[float], int]] = []
        campaign_lookup = {campaign.id: campaign for campaign in campaigns}
        all_campaign_ids = [campaign.id for campaign in campaigns]
        max_popularity = max(popularity_weights.values(), default=1.0)
        for user in users:
            positive_campaigns = set(user_item_weights.get(user.id, {}))
            positive_history = user_histories.get(user.id, [])
            profile = user_profiles.get(user.id, {})
            for campaign_id, _raw_weight in positive_history:
                campaign = campaign_lookup.get(campaign_id)
                if campaign is None:
                    continue
                campaign_vector = campaign_embeddings[campaign_id]
                features = _feature_vector(
                    campaign,
                    campaign_vector,
                    _cosine_similarity(profile, campaign_vector),
                    _dot(user_factors.get(user.id, [0.0] * LATENT_DIMENSIONS), campaign_factors.get(campaign_id, [0.0] * LATENT_DIMENSIONS)),
                    popularity_weights.get(campaign_id, 0.0) / max_popularity,
                )
                samples.append((features, 1))

                negatives = [campaign_id_candidate for campaign_id_candidate in all_campaign_ids if campaign_id_candidate not in positive_campaigns]
                random.shuffle(negatives)
                for negative_campaign_id in negatives[:3]:
                    negative_campaign = campaign_lookup[negative_campaign_id]
                    negative_vector = campaign_embeddings[negative_campaign_id]
                    negative_features = _feature_vector(
                        negative_campaign,
                        negative_vector,
                        _cosine_similarity(profile, negative_vector),
                        _dot(user_factors.get(user.id, [0.0] * LATENT_DIMENSIONS), campaign_factors.get(negative_campaign_id, [0.0] * LATENT_DIMENSIONS)),
                        popularity_weights.get(negative_campaign_id, 0.0) / max_popularity,
                    )
                    samples.append((negative_features, 0))

        feature_weights = _train_logistic_weights(samples)
        global_scores = {
            str(campaign.id): self._global_priority_score(
                campaign,
                campaign_embeddings[campaign.id],
                popularity_weights.get(campaign.id, 0.0),
            )
            for campaign in campaigns
        }

        artifact = {
            "version": 1,
            "generated_at": now.isoformat(),
            "idf": idf,
            "campaign_embeddings": {str(campaign_id): embedding for campaign_id, embedding in campaign_embeddings.items()},
            "user_profiles": {str(user_id): profile for user_id, profile in user_profiles.items()},
            "user_factors": {str(user_id): factors for user_id, factors in user_factors.items()},
            "campaign_factors": {str(campaign_id): factors for campaign_id, factors in campaign_factors.items()},
            "feature_weights": feature_weights,
            "popularity_weights": {str(campaign_id): score for campaign_id, score in popularity_weights.items()},
            "global_scores": global_scores,
            "campaign_documents": {str(campaign_id): count for campaign_id, count in campaign_documents.items()},
        }
        self.save_artifact(artifact)
        return artifact

    def _global_priority_score(self, campaign: Campaign, campaign_embedding: Dict[str, float], popularity_score: float) -> float:
        urgency = campaign_embedding.get("__urgency", 0.0)
        verification = campaign_embedding.get("__verification", 0.0)
        recency = campaign_embedding.get("__recency", 0.0)
        funding_gap = campaign_embedding.get("__funding_gap", 0.0)
        popularity = min(popularity_score / 20.0, 1.0)
        return round(urgency * 0.35 + verification * 0.25 + recency * 0.20 + funding_gap * 0.10 + popularity * 0.10, 6)

    def _candidate_campaigns(self, db: Session) -> List[Campaign]:
        return (
            db.query(Campaign)
            .filter(Campaign.status != "rejected")
            .order_by(Campaign.created_at.desc())
            .all()
        )

    def _reason_tags(
        self,
        campaign: Campaign,
        campaign_embedding: Dict[str, float],
        content_score: float,
        collaborative_score: float,
        fallback_used: bool,
    ) -> List[str]:
        tags: List[str] = []
        if _safe_float(campaign.medical_urgency, 0.0) >= 4:
            tags.append("urgent")
        if campaign_embedding.get("__verification", 0.0) >= 0.75:
            tags.append("verified")
        if campaign_embedding.get("__funding_gap", 0.0) <= 0.25:
            tags.append("nearly_funded")
        if campaign_embedding.get("__recency", 0.0) >= 0.6:
            tags.append("recent")
        if collaborative_score >= 0.2 and not fallback_used:
            tags.append("personalized")
        if content_score >= 0.2 and not fallback_used:
            tags.append("interest_match")
        if fallback_used:
            tags.append("popularity_fallback")
        if not tags:
            tags.append("recommended")
        return tags[:4]

    def _serialize_recommendation_item(
        self,
        campaign: Campaign,
        score: float,
        reason_tags: List[str],
        rank_position: int,
        source: str,
        fallback_used: bool,
    ) -> Dict[str, Any]:
        payload = _extract_campaign_payload(campaign)
        payload.update(
            {
                "priority_score": round(score, 6),
                "score": round(score, 6),
                "reason_tags": reason_tags,
                "rank_position": rank_position,
                "source": source,
                "fallback_used": fallback_used,
            }
        )
        return payload

    def _log_impressions(
        self,
        db: Session,
        user_id: Optional[int],
        items: List[Dict[str, Any]],
        source: str,
    ) -> None:
        if not items:
            return
        for index, item in enumerate(items, start=1):
            impression = RecommendationImpression(
                user_id=user_id,
                campaign_id=item["id"],
                rank_position=index,
                reason_tags=json.dumps(item.get("reason_tags", [])),
                source=source,
            )
            db.add(impression)
        db.commit()

    def _rank_campaigns(
        self,
        db: Session,
        user_id: Optional[int],
        k: int,
        source: str,
        fallback_used: bool,
    ) -> List[Dict[str, Any]]:
        artifact = self.load_artifact()
        campaigns = self._candidate_campaigns(db)
        if not campaigns:
            return []

        if artifact is None:
            artifact = self.train_from_db(db)
            fallback_used = True
            source = "fallback"

        campaign_embeddings = {
            int(campaign_id): embedding
            for campaign_id, embedding in artifact.get("campaign_embeddings", {}).items()
        }
        user_profiles = {
            int(user_key): profile
            for user_key, profile in artifact.get("user_profiles", {}).items()
        }
        user_factors = {
            int(user_key): factors
            for user_key, factors in artifact.get("user_factors", {}).items()
        }
        campaign_factors = {
            int(campaign_key): factors
            for campaign_key, factors in artifact.get("campaign_factors", {}).items()
        }
        feature_weights = artifact.get("feature_weights") or _default_feature_weights()
        popularity_weights = {
            int(campaign_key): score
            for campaign_key, score in artifact.get("popularity_weights", {}).items()
        }

        if user_id is not None and not db.query(User.id).filter(User.id == user_id).first():
            user_id = None
            fallback_used = True
            source = "fallback"

        user_profile = user_profiles.get(user_id or -1, {})
        user_factor = user_factors.get(user_id or -1, [0.0] * LATENT_DIMENSIONS)
        seen_campaign_ids = set()
        if user_id is not None:
            seen_campaign_ids = {row[0] for row in db.query(Donation.campaign_id).filter(Donation.donor_id == user_id).all()}
            seen_campaign_ids.update(
                row[0]
                for row in db.query(InteractionLog.campaign_id).filter(InteractionLog.user_id == user_id).all()
            )

        scored_items: List[Tuple[float, Campaign, List[str], Dict[str, float]]] = []
        max_popularity = max(popularity_weights.values(), default=1.0)
        for campaign in campaigns:
            if user_id is not None and campaign.id in seen_campaign_ids and campaign.status != "approved":
                continue

            campaign_embedding = campaign_embeddings.get(campaign.id)
            if campaign_embedding is None:
                campaign_embedding = _campaign_embedding(campaign, {}, len(campaign.documents or []), _utc_now())

            content_score = _cosine_similarity(user_profile, campaign_embedding)
            collaborative_score = _dot(user_factor, campaign_factors.get(campaign.id, [0.0] * LATENT_DIMENSIONS))
            popularity_score = popularity_weights.get(campaign.id, 0.0) / max_popularity if max_popularity else 0.0
            features = _feature_vector(campaign, campaign_embedding, content_score, collaborative_score, popularity_score)
            score = _sigmoid(_score_from_weights(feature_weights, features))
            if fallback_used:
                score = self._global_priority_score(campaign, campaign_embedding, popularity_weights.get(campaign.id, 0.0))
            reason_tags = self._reason_tags(campaign, campaign_embedding, content_score, collaborative_score, fallback_used)
            scored_items.append((score, campaign, reason_tags, campaign_embedding))

        scored_items.sort(key=lambda item: item[0], reverse=True)
        results = [
            self._serialize_recommendation_item(
                campaign=campaign,
                score=score,
                reason_tags=reason_tags,
                rank_position=index,
                source=source,
                fallback_used=fallback_used,
            )
            for index, (score, campaign, reason_tags, _) in enumerate(scored_items[:k], start=1)
        ]
        self._log_impressions(db, user_id, results, source)
        return results

    def recommend_for_user(self, db: Session, user_id: Optional[int], k: int = 10) -> List[Dict[str, Any]]:
        return self._rank_campaigns(db, user_id, k, source="ml", fallback_used=False)

    def global_feed(self, db: Session, k: int = 20) -> List[Dict[str, Any]]:
        return self._rank_campaigns(db, None, k, source="feed", fallback_used=True)

    def record_impressions(self, db: Session, impression_rows: List[Dict[str, Any]]) -> int:
        created = 0
        for row in impression_rows:
            impression = RecommendationImpression(
                user_id=row.get("user_id"),
                campaign_id=row["campaign_id"],
                rank_position=row.get("rank_position", 0),
                reason_tags=json.dumps(row.get("reason_tags", [])),
                source=row.get("source", "client"),
                session_id=row.get("session_id"),
            )
            db.add(impression)
            created += 1
        if created:
            db.commit()
        return created


engine = RecommendationEngine()