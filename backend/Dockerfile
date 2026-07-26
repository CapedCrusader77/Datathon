FROM python:3.12-slim

LABEL maintainer="Karnataka State Police - POLICEGPT Team"
LABEL description="POLICEGPT Backend API"

# System dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-kan \
    tesseract-ocr-hin \
    poppler-utils \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_trf

# Copy application
COPY . .

# Create directories
RUN mkdir -p /data/uploads /var/log/policegpt

# Non-root user for security
RUN useradd -m -u 1000 policegpt && \
    chown -R policegpt:policegpt /app /data /var/log/policegpt
USER policegpt

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "4", "--log-level", "info"]
