"""
POLICEGPT - National-Grade AI Investigation Assistant
Karnataka State Police | Intelligent Crime & Investigation Database
"""

import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app.api.routers import (
    admin,
    analytics,
    auth,
    cases,
    chat,
    knowledge_graph,
    reports,
    search,
    suspects,
)
from app.core.config import settings
from app.db.database import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("policegpt")

app = FastAPI(
    title="POLICEGPT API",
    description="National-Grade AI Investigation Assistant for Karnataka State Police",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── Middleware ──────────────────────────────────────────────────────────────
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def audit_log_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"[AUDIT] {request.method} {request.url.path} "
        f"IP={request.client.host} "
        f"Status={response.status_code} "
        f"Time={process_time:.3f}s"
    )
    response.headers["X-Process-Time"] = str(process_time)
    return response

# ── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth.router,          prefix="/api/v1/auth",           tags=["Authentication"])
app.include_router(chat.router,          prefix="/api/v1/chat",           tags=["AI Chat"])
app.include_router(cases.router,         prefix="/api/v1/cases",          tags=["FIR & Cases"])
app.include_router(suspects.router,      prefix="/api/v1/suspects",       tags=["Suspects"])
app.include_router(analytics.router,     prefix="/api/v1/analytics",      tags=["Analytics"])
app.include_router(knowledge_graph.router, prefix="/api/v1/graph",        tags=["Knowledge Graph"])
app.include_router(reports.router,       prefix="/api/v1/reports",        tags=["Reports"])
app.include_router(admin.router,         prefix="/api/v1/admin",          tags=["Admin"])
app.include_router(search.router,        prefix="/api/v1/search",         tags=["Search"])

@app.on_event("startup")
async def startup_event():
    logger.info("🚔 POLICEGPT Starting Up...")
    await init_db()
    logger.info("✅ Database initialized")

@app.get("/api/health")
async def health_check():
    return {
        "status": "operational",
        "service": "POLICEGPT",
        "version": "1.0.0",
        "agency": "Karnataka State Police",
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Incident has been logged."},
    )
