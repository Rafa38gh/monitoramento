import client from 'prom-client';

// Registro de métricas
const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const http_requests_total = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestErrorsTotal = new client.Counter({
    name: 'http_request_errors_total',
    help: 'Total number of HTTP request errors',
    labelNames: ['method', 'route', 'status_code'],
});

export const authUserSuccess = new client.Counter({
    name: 'auth_user_success_total',
    help: 'Total number of successful user authentications',
    labelNames: ['method', 'route', 'status_code'],
});

export const authUserError = new client.Counter({
    name: 'auth_user_error_total',
    help: 'Total number of failed user authentications',
    labelNames: ['method', 'route', 'status_code'],
});

export const userOnlineGauge = new client.Gauge({
    name: 'user_online_gauge',
    help: 'Number of users currently online',
});

export const http_request_duration_seconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10],
});

register.registerMetric(http_requests_total);
register.registerMetric(httpRequestErrorsTotal);
register.registerMetric(authUserSuccess);
register.registerMetric(authUserError);
register.registerMetric(userOnlineGauge);
register.registerMetric(http_request_duration_seconds);

export { register };
