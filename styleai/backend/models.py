"""Pydantic models used by API handlers."""
from pydantic import BaseModel, HttpUrl


class OutfitResponse(BaseModel):  # pylint: disable=too-few-public-methods
    """Successful response payload for an outfit generation request."""

    generated_image_url: HttpUrl | str
    style: str
    affiliate_url: HttpUrl | str
    message: str


class ErrorResponse(BaseModel):  # pylint: disable=too-few-public-methods
    """Error response model for failed API requests."""

    detail: str
