/* instrumentation.node.ts */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';


const sdk = new NodeSDK({
resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'pasto-smart',
}),

traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
}),

instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log('OpenTelemetry SDK inicializado com sucesso');

import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('debug-tracer');

const span = tracer.startSpan('otel-startup-span');
span.end();

console.log('Span manual criado');
