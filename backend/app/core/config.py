"""
Core configuration for POLICEGPT
"""
import secrets

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "POLICEGPT"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(64)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8-hour shift
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://policegpt.karnataka.gov.in",
    ]

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://policegpt:password@localhost:5432/policegpt_db"
    REDIS_URL: str = "redis://localhost:6379"

    # Neo4j Knowledge Graph
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"

    # Elasticsearch
    ELASTICSEARCH_URL: str = "http://localhost:9200"

    # Qdrant Vector DB
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "policegpt_firs"

    # LLM Configuration
    LLM_PROVIDER: str = "ollama"  # ollama | openai | gemini
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1:8b"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Embedding
    EMBEDDING_MODEL: str = "BAAI/bge-large-en-v1.5"
    EMBEDDING_DIMENSION: int = 1024

    # OCR
    TESSERACT_CMD: str = "/usr/bin/tesseract"

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 50
    UPLOAD_DIR: str = "/data/uploads"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Audit
    AUDIT_LOG_ENABLED: bool = True
    AUDIT_LOG_PATH: str = "/var/log/policegpt/audit.log"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
