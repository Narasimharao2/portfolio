"""AI image generation service using Replicate with a local fallback renderer."""
from __future__ import annotations

import io
import uuid
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont
import replicate

from config import settings

STYLE_PROMPTS = {
    "casual": "person wearing casual modern outfit, fashion editorial, realistic lighting, high quality",
    "formal": "person wearing business formal suit, tailored fit, realistic photo, studio lighting",
    "party": "person wearing party wear stylish outfit, trendy fashion, detailed fabric, realistic portrait",
    "celebrity-inspired": "person in a celebrity-inspired luxury outfit, red carpet fashion look, photorealistic",
}

AFFILIATE_LINKS = {
    "casual": "https://www.amazon.com/s?k=casual+fashion&tag=styleai-20",
    "formal": "https://www.amazon.com/s?k=formal+suit&tag=styleai-20",
    "party": "https://www.amazon.com/s?k=party+wear+outfit&tag=styleai-20",
    "celebrity-inspired": "https://www.amazon.com/s?k=luxury+fashion+outfit&tag=styleai-20",
}


def get_prompt(style: str) -> str:
    """Return the generation prompt mapped to the requested style."""

    return STYLE_PROMPTS.get(style.lower(), STYLE_PROMPTS["casual"])


def get_affiliate_link(style: str) -> str:
    """Return the affiliate product link mapped to the chosen style."""

    return AFFILIATE_LINKS.get(style.lower(), AFFILIATE_LINKS["casual"])


def generate_with_replicate(image_bytes: bytes, style: str) -> str | None:
    """Attempt real generation via Replicate; return image URL when available."""
    if not settings.replicate_api_token:
        return None

    client = replicate.Client(api_token=settings.replicate_api_token)

    prompt = get_prompt(style)
    # Model input varies by model; this payload supports common img2img Stable Diffusion variants.
    payload: dict[str, Any] = {
        "prompt": prompt,
        "image": io.BytesIO(image_bytes),
        "strength": 0.65,
        "guidance_scale": 8,
        "num_inference_steps": 30,
    }

    try:
        output = client.run(settings.replicate_model, input=payload)
        if isinstance(output, list) and output:
            return str(output[0])
        if isinstance(output, str):
            return output
    except replicate.exceptions.ReplicateError:
        return None
    return None


def generate_local_preview(image_bytes: bytes, style: str, generated_dir: Path) -> Path:
    """Create a local preview image when remote model is unavailable.

    This keeps the app fully usable in local/dev environments without API keys.
    """
    generated_dir.mkdir(parents=True, exist_ok=True)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    drawer = ImageDraw.Draw(overlay)

    bar_height = int(image.height * 0.16)
    drawer.rectangle([(0, image.height - bar_height), (image.width, image.height)], fill=(15, 15, 15, 180))

    text = f"AI Outfit Preview: {style.title()}"
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", size=max(20, image.width // 28))
    except OSError:
        font = ImageFont.load_default()

    drawer.text((20, image.height - bar_height + 20), text, fill=(255, 255, 255, 230), font=font)
    result = Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")

    filename = f"generated_{uuid.uuid4().hex}.jpg"
    destination = generated_dir / filename
    result.save(destination, format="JPEG", quality=95)
    return destination
