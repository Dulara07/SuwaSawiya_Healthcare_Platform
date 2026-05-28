from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.auth.dependencies import get_current_user
from app.utils.gcs import generate_signed_upload_url
from app.config import settings

router = APIRouter(prefix="/uploads", tags=["uploads"])


class SignedUrlRequest(BaseModel):
    filename: str
    content_type: str
    campaign_id: Optional[int] = None
    document_type: Optional[str] = None


@router.post("/signed-url")
def signed_url(req: SignedUrlRequest, user = Depends(get_current_user)):
    bucket = getattr(settings, "GCS_BUCKET", None)
    if not bucket:
        raise HTTPException(status_code=500, detail="GCS_BUCKET not configured")
    # create a blob name with timestamp/user
    import time
    blob_name = f"campaigns/{req.campaign_id or 'general'}/{int(time.time())}_{req.filename}"
    urls = generate_signed_upload_url(bucket, blob_name, req.content_type, expires_minutes=15)
    return {"upload_url": urls["upload_url"], "public_url": urls["public_url"], "blob_name": blob_name}
