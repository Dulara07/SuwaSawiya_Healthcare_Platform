from datetime import timedelta
import os
from google.cloud import storage

def generate_signed_upload_url(bucket_name: str, blob_name: str, content_type: str, expires_minutes: int = 15):
    # Requires GOOGLE_APPLICATION_CREDENTIALS env var or default credentials
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version='v4',
        expiration=timedelta(minutes=expires_minutes),
        method='PUT',
        content_type=content_type,
    )

    public_url = f"https://storage.googleapis.com/{bucket_name}/{blob_name}"
    return {"upload_url": url, "public_url": public_url}
