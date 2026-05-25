from pydantic import BaseModel, constr, ConfigDict
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_url: str
    document_type: Optional[str] = None

class DocumentCreate(DocumentBase):
    campaign_id: int

class DocumentRead(DocumentBase):
    id: int
    uploaded_at: datetime
    campaign_id: int

    model_config = ConfigDict(from_attributes=True)
