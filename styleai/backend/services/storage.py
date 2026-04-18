"""Storage helpers for local files and optional MongoDB persistence."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient

from config import settings


class HistoryStore:
    def __init__(self) -> None:
        self.client = None
        self.collection = None
        if settings.use_mongodb:
            self.client = AsyncIOMotorClient(settings.mongodb_uri)
            db = self.client[settings.mongodb_db_name]
            self.collection = db["outfit_generations"]

    async def save_event(self, payload: dict) -> None:
        if self.collection is None:
            return
        await self.collection.insert_one(payload)


history_store = HistoryStore()


def save_upload(file_bytes: bytes, uploads_dir: Path, suffix: str = ".jpg") -> Path:
    uploads_dir.mkdir(parents=True, exist_ok=True)
    path = uploads_dir / f"upload_{uuid.uuid4().hex}{suffix}"
    path.write_bytes(file_bytes)
    return path


def event_record(style: str, upload_url: str, generated_url: str) -> dict:
    return {
        "style": style,
        "upload_url": upload_url,
        "generated_url": generated_url,
        "created_at": datetime.now(timezone.utc),
    }
