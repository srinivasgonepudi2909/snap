from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings

def setup_cors(app):
    """Setup CORS middleware for the FastAPI app."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.backend_cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    return app
