// src/app/api/metrics/route.ts
import { NextResponse } from "next/server";
import { register, http_requests_total } from "../../../lib/metrics";

export async function GET() {
  try {
    http_requests_total.inc({
      method: "GET",
      route: "/api/metrics",
      status_code: "200",
    });

    return new NextResponse(await register.metrics(), {
      status: 200,
      headers: {
        "Content-Type": register.contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    http_requests_total.inc({
      method: "GET",
      route: "/api/metrics",
      status_code: "500",
    });

    return new NextResponse("Metrics error", { status: 500 });
  }
}

