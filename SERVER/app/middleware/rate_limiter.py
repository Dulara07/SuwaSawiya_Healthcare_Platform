import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi import HTTPException


class InMemoryRateLimiter(BaseHTTPMiddleware):
    def __init__(self, app, calls: int = 60, per_seconds: int = 60):
        super().__init__(app)
        self.calls = calls
        self.per_seconds = per_seconds
        self.store = {}  # key -> [timestamps]

    async def dispatch(self, request: Request, call_next):
        try:
            ip = request.client.host if request.client else 'anonymous'
        except Exception:
            ip = 'anonymous'
        now = time.time()
        window_start = now - self.per_seconds
        timestamps = self.store.get(ip, [])
        # remove old
        timestamps = [ts for ts in timestamps if ts > window_start]
        if len(timestamps) >= self.calls:
            raise HTTPException(status_code=429, detail='Too many requests')
        timestamps.append(now)
        self.store[ip] = timestamps
        response = await call_next(request)
        return response
