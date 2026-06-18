"""Colab-ready training template for a CSV dataset.

Usage in Google Colab:
1. Upload this file and your CSV, or mount Google Drive.
2. Set CSV_PATH, TARGET_COLUMN, and TASK_TYPE.
3. Run the cells top to bottom.

This template handles mixed numeric/categorical features, missing values,
and produces a simple baseline model.
"""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer


# Change these before running.
CSV_PATH = "/content/your_dataset.csv"
TARGET_COLUMN = "priority_score"
TASK_TYPE = "classification"  # "classification" or "regression"
TEST_SIZE = 0.2
RANDOM_STATE = 42
TEXT_COLUMNS = ["title", "description", "beneficiary_medical_condition"]


def build_preprocessor(feature_frame: pd.DataFrame) -> ColumnTransformer:
    numeric_features = feature_frame.select_dtypes(include=["number"]).columns.tolist()
    categorical_features = [
        column
        for column in feature_frame.columns
        if column not in numeric_features and column not in TEXT_COLUMNS
    ]
    existing_text_columns = [column for column in TEXT_COLUMNS if column in feature_frame.columns]

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            (
                "encoder",
                OneHotEncoder(handle_unknown="ignore"),
            ),
        ]
    )

    text_transformers = []
    for column in existing_text_columns:
        text_transformers.append(
            (
                f"text_{column}",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="constant", fill_value="")),
                        (
                            "tfidf",
                            TfidfVectorizer(max_features=2000, ngram_range=(1, 2)),
                        ),
                    ]
                ),
                column,
            )
        )

    transformers = [("numeric", numeric_pipeline, numeric_features)]
    if categorical_features:
        transformers.append(("categorical", categorical_pipeline, categorical_features))
    transformers.extend(text_transformers)

    return ColumnTransformer(transformers=transformers, remainder="drop")


def build_model(task_type: str):
    if task_type == "classification":
        return RandomForestClassifier(
            n_estimators=300,
            random_state=RANDOM_STATE,
            class_weight="balanced",
        )
    if task_type == "regression":
        return RandomForestRegressor(
            n_estimators=300,
            random_state=RANDOM_STATE,
        )
    raise ValueError("TASK_TYPE must be 'classification' or 'regression'.")


def main() -> None:
    data_path = Path(CSV_PATH)
    if not data_path.exists():
        raise FileNotFoundError(f"CSV file not found: {data_path}")

    frame = pd.read_csv(data_path)
    if TARGET_COLUMN not in frame.columns:
        raise KeyError(
            f"TARGET_COLUMN '{TARGET_COLUMN}' was not found. Available columns: {list(frame.columns)}"
        )

    if TASK_TYPE == "classification":
        unique_labels = frame[TARGET_COLUMN].nunique(dropna=True)
        if unique_labels < 2:
            raise ValueError(
                f"TARGET_COLUMN '{TARGET_COLUMN}' needs at least 2 classes for classification. "
                "Use TASK_TYPE='regression' for numeric targets like priority_score."
            )

    frame = frame.dropna(subset=[TARGET_COLUMN]).copy()
    feature_frame = frame.drop(columns=[TARGET_COLUMN])
    target_series = frame[TARGET_COLUMN]

    if TASK_TYPE == "regression" and not pd.api.types.is_numeric_dtype(target_series):
        raise TypeError(
            f"TARGET_COLUMN '{TARGET_COLUMN}' must be numeric for regression."
        )

    X_train, X_test, y_train, y_test = train_test_split(
        feature_frame,
        target_series,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=target_series if TASK_TYPE == "classification" else None,
    )

    preprocessor = build_preprocessor(X_train)
    model = build_model(TASK_TYPE)

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    pipeline.fit(X_train, y_train)
    predictions = pipeline.predict(X_test)

    print("Training complete.")
    print(f"Rows: {len(frame)}")
    print(f"Features: {feature_frame.shape[1]}")
    print(f"Target: {TARGET_COLUMN}")

    if TASK_TYPE == "classification":
        print(f"Accuracy: {accuracy_score(y_test, predictions):.4f}")
        print(classification_report(y_test, predictions))
    else:
        rmse = mean_squared_error(y_test, predictions, squared=False)
        print(f"MAE: {mean_absolute_error(y_test, predictions):.4f}")
        print(f"RMSE: {rmse:.4f}")
        print(f"R2: {r2_score(y_test, predictions):.4f}")

    output_dir = Path("/content/model_artifacts")
    output_dir.mkdir(parents=True, exist_ok=True)
    model_path = output_dir / "trained_model.joblib"
    metadata_path = output_dir / "training_metadata.json"

    joblib.dump(pipeline, model_path)

    metadata = {
        "csv_path": str(data_path),
        "target_column": TARGET_COLUMN,
        "task_type": TASK_TYPE,
        "rows": int(len(frame)),
        "feature_count": int(feature_frame.shape[1]),
    }
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    print(f"Saved model to: {model_path}")
    print(f"Saved metadata to: {metadata_path}")


if __name__ == "__main__":
    main()