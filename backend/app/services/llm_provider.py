from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

import httpx

from app.config import get_settings


class LLMProvider(Protocol):
    def generate_text(self, prompt: str) -> str:
        raise NotImplementedError


@dataclass(slots=True)
class DeterministicLLMProvider:
    def generate_text(self, prompt: str) -> str:
        return prompt.strip()


@dataclass(slots=True)
class OpenAICompatibleLLMProvider:
    api_key: str
    model: str
    base_url: str = "https://api.openai.com/v1"

    def generate_text(self, prompt: str) -> str:
        response = httpx.post(
            f"{self.base_url}/chat/completions",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "model": self.model,
                "messages": [
                    {"role": "system", "content": "Return concise marketing operations content."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        payload = response.json()
        return payload["choices"][0]["message"]["content"]


def get_llm_provider() -> LLMProvider:
    settings = get_settings()
    if settings.llm_api_key:
        return OpenAICompatibleLLMProvider(api_key=settings.llm_api_key, model=settings.llm_model)
    return DeterministicLLMProvider()
