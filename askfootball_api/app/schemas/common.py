from pydantic import BaseModel
from typing import TypeVar, Generic, Optional

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard wrapper for all API responses."""
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    count: Optional[int] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
