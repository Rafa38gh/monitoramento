export function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  const { NodeSDK } = require("@opentelemetry/sdk-node");
  const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
  const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http");
  const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");
  const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

  const metricsExporter = new OTLPMetricExporter({
    url: "http://otel-collector:4318/v1/metrics",
  });

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: "http://otel-collector:4318/v1/traces",
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricsExporter,
      exportIntervalMillis: 10000, // 10s
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        // habilite instrumentações de métricas
        "@opentelemetry/instrumentation-http": { enabled: true },
        "@opentelemetry/instrumentation-express": { enabled: true },
      }),
    ],
  });

  sdk.start();
}
