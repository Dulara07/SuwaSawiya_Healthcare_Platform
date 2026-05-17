from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_url: str

class DocumentCreate(DocumentBase):
    campaign_id: int

class DocumentRead(DocumentBase):
    id: int
    uploaded_at: datetime
    campaign_id: int

    class Config:
        orm_mode = True
