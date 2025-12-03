import client, { collectDefaultMetrics, Registry } from "prom-client";
import { NextResponse } from "next/server";

const register = new Registry();
collectDefaultMetrics({ register });

type RequestLabels = "method" | "route" | "status_code";

const authUserSuccess = new client.Counter({
  name: "auth_user_success_total",
  help: "Total number of successful user authentications",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});
register.registerMetric(authUserSuccess);

const authUserError = new client.Counter({
  name: "auth_user_error_total",
  help: "Total number of unccessful user authentications",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});
register.registerMetric(authUserError);

const http_requests_total = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});
register.registerMetric(http_requests_total);

// const http_requests_total = new client.Histogram({
//   name: "http_request_duration_seconds",
//   help: "Duration of HTTP requests in seconds",
//   buckets: [0.1, 0.5, 1, 2.5, 5, 10],
// });

//register.registerMetric(http_requests_total);

export async function GET() {
  try {
    const metrics = await register.metrics();
    http_requests_total.inc({
      method: "GET",
      route: "/api/metrics",
      status_code: "200",
    });
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        "Content-Type": register.contentType,
        "Cache-Control": "no-store, no-cache",
      },
    });
  } catch (ex) {
    http_requests_total.inc({
      method: "GET",
      route: "/api/metrics",
      status_code: "500",
    });
    return new NextResponse(String(ex), { status: 500 });
  }
}

export { authUserSuccess, authUserError, http_requests_total };
