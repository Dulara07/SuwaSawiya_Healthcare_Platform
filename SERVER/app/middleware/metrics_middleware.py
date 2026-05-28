import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.utils.metrics import REQUEST_COUNT, REQUEST_LATENCY


class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        method = request.method
        endpoint = request.url.path
        start = time.time()
        response = await call_next(request)
        elapsed = time.time() - start
        try:
            REQUEST_COUNT.labels(method=method, endpoint=endpoint).inc()
            REQUEST_LATENCY.labels(method=method, endpoint=endpoint).observe(elapsed)
        except Exception:
            pass
        return response
