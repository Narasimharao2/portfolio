"""Pydantic models used by API handlers."""
from pydantic import BaseModel, HttpUrl


class OutfitResponse(BaseModel):
    generated_image_url: HttpUrl | str
    style: str
    affiliate_url: HttpUrl | str
    message: str


class ErrorResponse(BaseModel):
    detail: str
