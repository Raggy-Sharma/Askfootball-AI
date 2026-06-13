from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

# HTTPBearer tells FastAPI to expect 'Authorization: Bearer <token>'
# Also adds the lock icon to Swagger UI automatically
security_scheme = HTTPBearer()


async def verify_api_key(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme)
) -> str:
    """Validates the API key from the Authorization header."""
    api_key = credentials.credentials

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )

    return api_key
