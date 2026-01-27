import {
    http_requests_total,
    httpRequestErrorsTotal,
    http_request_duration_seconds,
} from './metrics';

export async function withMetrics(
    handler: () => Promise<Response>,
    method: string,
    route: string
) {
    const start = performance.now();

    try {
        const res = await handler();
        const status = res.status.toString();

        http_requests_total.inc({ method, route, status_code: status });
        http_request_duration_seconds.observe(
            { method, route, status_code: status },
            (performance.now() - start) / 1000
        );

        if (res.status >= 400)
        {
            httpRequestErrorsTotal.inc({ method, route, status_code: status });
        }

        return res;

    } catch (err) {
        http_requests_total.inc({ method, route, status_code: '500' });
        httpRequestErrorsTotal.inc({ method, route, status_code: '500' });
        http_request_duration_seconds.observe(
            { method, route, status_code: 'error' },
            (performance.now() - start) / 1000
        );
        throw err;
    }
}