from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from prometheus_client import CollectorRegistry

REQUEST_COUNT = Counter('suwa_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('suwa_request_latency_seconds', 'Request latency', ['method', 'endpoint'])


def metrics_response():
    data = generate_latest()
    return data, CONTENT_TYPE_LATEST
