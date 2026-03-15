# Pino Logger Guide for `hosp-management-backend`

## 1. Overview

Logging is a core reliability layer in backend systems. In production, logs are the fastest source of truth for incident response, debugging, security investigations, and performance analysis.

For your Node.js + Express + TypeScript backend, good logging should provide:

- Fast root-cause analysis during failures
- Full request lifecycle visibility
- Security/audit traceability for sensitive actions
- Structured data for dashboards and alerting

---

## 2. Logging Philosophy

### Structured Logging

Use JSON logs (key-value fields) instead of plain text. This enables searching, filtering, aggregations, and alerts in ELK/Loki/Grafana.

Bad:

```ts
console.log('User login failed');
```

Good:

```ts
logger.warn({ userId, ip, reason: 'invalid_password' }, 'Login failed');
```

### Log Levels

Use level semantics consistently:

- `trace`: very detailed execution flow
- `debug`: developer diagnostics
- `info`: business/system milestones
- `warn`: recoverable anomalies
- `error`: failed operation
- `fatal`: process-level unrecoverable crash

### Observability

Logs are one pillar of observability (logs + metrics + traces). Logs should include context that links to metrics/traces, especially `requestId`, `userId`, `entityId`, `durationMs`.

### Correlation IDs

Every request should have a `requestId` (or trace ID). All logs generated during that request must carry this ID.

### Request Tracing

For each request, log:

- inbound request metadata
- completion status + latency
- errors (with stack and context)

---

## 3. Current Logger Setup

### What is good

Your current setup in `src/bootstrap/logger` has strong fundamentals:

- Central logger factory: `createLogger.ts`
- Environment-aware transport strategy (`pino-pretty` in dev, file in prod)
- Separate logical loggers exported (`logger`, `errorLogger`, `auditLogger`)
- Redaction already enabled for common secrets
- `pino-http` middleware is wired early in `createApp.ts`

### What should be improved

Based on the current files, these are the key gaps:

1. Missing request correlation strategy

- `pino-http` is used, but there is no explicit `genReqId` strategy and no `x-request-id` response header contract.

2. Error logging loses stack-rich structure

- In `globalErrorHandler.ts`, logger uses `err.message` string, not `{ err }` object serializer. This weakens debugging.

3. `errorLogger`/`auditLogger` are exported but mostly unused

- Most modules still log with `logger`, so streams are not functionally separated.

4. Production file strategy has no rotation lifecycle

- Writing to `logs/*.log` is fine, but there is no retention/rotation policy (required in production).

5. Request serializer may leak too much query/params detail

- Logging full query/params can leak PII depending on endpoint usage.

6. No environment-driven log level control

- Levels are mostly hardcoded; production should use env-driven levels (e.g., `LOG_LEVEL`, `HTTP_LOG_LEVEL`).

7. No reusable context helper for app/service/repository layers

- Missing child logger/request context utility results in inconsistent fields across modules.

8. Duplicate logger location risk

- Both `src/bootstrap/logger/httpLogger.ts` and `src/middlewares/httpLogger.ts` exist. Keep only one canonical source.

---

## 4. Recommended Logger Architecture

Recommended scalable structure:

```text
src/
  bootstrap/
    logger/
      createLogger.ts
      transports.ts
      httpLogger.ts
      index.ts
  middlewares/
    requestContext.ts
    requestLogger.ts
    globalErrorHandler.ts
  shared/
    logging/
      context.ts
      audit.ts
  modules/
    ...
```

Why this scales:

- `bootstrap/logger/*`: infrastructure-level logger creation only
- `middlewares/*`: request-scoped lifecycle handling
- `shared/logging/*`: reusable helpers for domain layers
- `modules/*`: feature code consumes typed helpers, not raw logging setup

This separation prevents logger config drift and keeps domain services independent from transport details.

---

## 5. Logger Configuration

### Dev vs Production

- Development: pretty logs for readability
- Production: JSON logs only, one-line structured output, shipped to central platform

### Improved `createLogger.ts` example

```ts
// src/bootstrap/logger/createLogger.ts
import path from 'node:path';
import pino, { type Level, type LoggerOptions } from 'pino';
import { envConfig } from '@/config/env.config';
import { getFileTransport, getPrettyTransport, logDir } from './transports';

const isProd = envConfig.nodeEnv === 'production';

const defaultRedactions = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.token',
  'req.body.refreshToken',
  'password',
  'token',
  'refreshToken',
  'accessToken',
];

export const createLogger = (
  fileName: string,
  level: Level = (process.env.LOG_LEVEL as Level) ?? (isProd ? 'info' : 'debug'),
) => {
  const options: LoggerOptions = {
    level,
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        pid: bindings.pid,
        host: bindings.hostname,
        service: 'hosp-management-api',
        environment: envConfig.nodeEnv,
      }),
    },
    redact: { paths: defaultRedactions, remove: true },
  };

  const stream = isProd ? getFileTransport(path.join(logDir, fileName)) : getPrettyTransport();

  return pino(options, stream);
};
```

Explanation:

- Standardizes log schema (`message`, `level`, `service`, `environment`)
- Makes log level configurable via environment
- Keeps redaction centralized and explicit

### Improved `transports.ts` example

```ts
// src/bootstrap/logger/transports.ts
import path from 'node:path';
import pino from 'pino';

export const logDir = path.join(process.cwd(), 'logs');

export const getFileTransport = (destination: string) =>
  pino.transport({
    target: 'pino/file',
    options: { destination, mkdir: true },
  });

export const getPrettyTransport = () =>
  pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,host',
      singleLine: true,
    },
  });
```

---

## 6. Log Levels Best Practices

Use levels with discipline:

### `trace`

```ts
logger.trace({ payloadSize, parserStep: 'normalize' }, 'Parsing inbound payload');
```

Use only in deep debugging, usually disabled in production.

### `debug`

```ts
logger.debug({ userId, cacheKey }, 'Cache miss, querying database');
```

For developer diagnostics.

### `info`

```ts
logger.info({ userId }, 'User created');
```

For successful business milestones.

### `warn`

```ts
logger.warn({ ip, email }, 'Login attempt failed');
```

For suspicious/recoverable issues.

### `error`

```ts
logger.error({ err, userId }, 'Database query failed');
```

For failed operations where request/job can continue to global handling.

### `fatal`

```ts
logger.fatal({ err }, 'Uncaught exception; shutting down process');
```

For unrecoverable process-level failures before exit.

---

## 7. Request Logging (HTTP Logs)

Use `pino-http` with explicit request ID and request completion fields.

```ts
// src/bootstrap/logger/httpLogger.ts
import crypto from 'node:crypto';
import { pinoHttp } from 'pino-http';
import { requestPino } from './requestLogger';

export const httpLogger = pinoHttp({
  logger: requestPino,
  autoLogging: { ignorePaths: ['/health'] },
  genReqId: (req, res) => {
    const incoming = req.headers['x-request-id'];
    const requestId =
      typeof incoming === 'string' && incoming.length > 0 ? incoming : crypto.randomUUID();

    res.setHeader('x-request-id', requestId);
    return requestId;
  },
  customProps: (req, _res) => ({
    requestId: req.id,
    ip: req.ip,
  }),
  customSuccessMessage: (req, res) => `${req.method} ${req.url} completed (${res.statusCode})`,
  customErrorMessage: (req, res) => `${req.method} ${req.url} failed (${res.statusCode})`,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
});
```

This ensures each HTTP log can be correlated across services and debugging tools.

---

## 8. Error Logging

Global handler should log structured error objects, not only message strings.

```ts
// src/middlewares/globalErrorHandler.ts (logging part)
logger.error(
  {
    err,
    method: req.method,
    url: req.originalUrl,
    requestId: req.id,
    userId: req.user?.id,
    ip: req.ip,
  },
  'Unhandled error occurred',
);
```

Why:

- preserves stack trace and error metadata
- links failure to request/user context
- enables alert grouping by error type/path

---

## 9. Audit Logs

Audit logs are security/compliance records, not debug logs.

Log these events at minimum:

- user login/logout
- role or permission changes
- create/update/delete on sensitive entities
- security setting changes

Recommended helper:

```ts
// src/shared/logging/audit.ts
import { auditLogger } from '@/bootstrap/logger';

type AuditEvent = {
  action: string;
  entity: string;
  entityId?: string;
  actorUserId?: string;
  hospitalId?: string;
  requestId?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
};

export const logAudit = (event: AuditEvent) => {
  auditLogger.info({ ...event, eventType: 'AUDIT' }, 'Audit event');
};
```

This keeps audit format uniform across modules.

---

## 10. Log File Strategy

Recommended files:

```text
logs/
  app.log
  error.log
  request.log
  audit.log
```

Strategy:

- Keep file separation by responsibility
- Rotate daily or by size (e.g., 100MB)
- Retention example:
  - `app.log`: 7-14 days
  - `request.log`: 3-7 days (high volume)
  - `error.log`: 30 days
  - `audit.log`: 90+ days (policy/compliance dependent)

Rotation can be done by:

- container platform log drivers
- Linux `logrotate`
- centralized logging pipeline (preferred)

---

## 11. Production Best Practices

- Never log passwords, tokens, cookies, reset links, or secrets
- Mask PII where possible (email/phone/ID fragments)
- Use correlation ID in all request-scoped logs
- Log request lifecycle start/end/error with latency
- Use JSON logs in production only
- Use `fatal` for crash-path logs before process exit
- Keep message text short and field-rich

---

## 12. Admin Log Monitoring

For super admin visibility:

1. Internal Log Dashboard

- Query by `requestId`, `userId`, `action`, `statusCode`, time range
- Add role-based access and immutable audit views

2. ELK Stack

- Ship logs with Filebeat/Vector/Fluent Bit
- Use Kibana saved searches and alerts

3. Grafana + Loki

- Lower operational complexity than ELK for many teams
- Good for label-based search and alerting

Minimum alert set:

- spike in `error` logs
- repeated auth failures from same IP
- frequent `fatal`/process restart events

---

## 13. Example Logging in Each Layer

### Controller

```ts
export const createHospital = catchAsync(async (req, res) => {
  req.log.info({ route: 'POST /hospitals', userId: req.user?.id }, 'Request received');

  const result = await createHospitalService(req.body, req.log);

  req.log.info({ hospitalId: result.id }, 'Hospital created');
  sendResponse(res, 201, { success: true, data: result, message: 'Created' });
});
```

Explanation: controller logs request boundary and output identifiers.

### Service

```ts
export const createHospitalService = async (payload: TCreateHospitalInput, log: pino.Logger) => {
  log.debug({ email: payload.email }, 'Validating hospital create payload');

  // business logic...
  log.info({ slug: payload.slug }, 'Hospital creation business flow completed');
};
```

Explanation: service logs business decisions and milestones.

### Repository

```ts
export const getHospitalBySlug = async (slug: string, log: pino.Logger) => {
  const start = Date.now();
  const result = await prisma.hospital.findUnique({ where: { slug } });

  log.debug({ slug, durationMs: Date.now() - start, found: Boolean(result) }, 'DB query completed');
  return result;
};
```

Explanation: repository logs DB interaction latency and result shape.

### Middleware

```ts
export const requestContext = (req: Request, _res: Response, next: NextFunction) => {
  req.log = req.log.child({
    requestId: req.id,
    userId: req.user?.id,
  });
  next();
};
```

Explanation: middleware enriches logger once so downstream layers inherit context.

---

## 14. Logging Anti-Patterns

Avoid these mistakes:

- Using `console.log` in application code
- Logging secrets (`password`, token, cookie, authorization header)
- Logging full request/response bodies everywhere
- Logging without consistent structure/keys
- Logging expected validation errors as `error` instead of `warn/info`
- Writing huge stack traces repeatedly inside loops
- Adding emojis/special symbols in production log messages

---

## 15. Final Best Practice Checklist

- [ ] Single central logger factory (`src/bootstrap/logger`)
- [ ] Strict JSON logs in production
- [ ] Pretty logs only in development
- [ ] Environment-driven log levels (`LOG_LEVEL`, `HTTP_LOG_LEVEL`)
- [ ] Redaction rules for secrets and sensitive fields
- [ ] `x-request-id` generation + propagation
- [ ] `req.log` child logger used across controller/service/repository flow
- [ ] Global error handler logs `{ err, requestId, userId, route }`
- [ ] Dedicated audit log schema and helper
- [ ] Log rotation + retention policy implemented
- [ ] Centralized log aggregation + alerting configured
- [ ] No `console.log` in runtime code

---

## Practical Next Refactor for Your Codebase

1. Upgrade `src/bootstrap/logger/httpLogger.ts` with explicit `genReqId`, header propagation, and safer serializers.
2. Update `src/middlewares/globalErrorHandler.ts` to log `{ err }` instead of only message string.
3. Start using `auditLogger` in audit workflow (`audit.service.ts` / worker paths).
4. Introduce a request-context middleware so service/repository logs include `requestId` and `userId` automatically.
5. Add log rotation policy (platform or `logrotate`) before production rollout.

---

## 16. How Logger Works in This Project (Current State)

Your logging flow now works like this:

1. `src/bootstrap/logger/createLogger.ts`

- Creates base Pino loggers with:
  - standard fields (`service`, `environment`, `pid`, `host`)
  - redaction rules
  - env-based level (`LOG_LEVEL`)

2. `src/bootstrap/logger/requestLogger.ts`

- Creates request logger with `HTTP_LOG_LEVEL`.

3. `src/bootstrap/logger/httpLogger.ts`

- Uses `pino-http` middleware.
- Generates/propagates `x-request-id`.
- Adds request fields (`method`, `url`, `statusCode`, `ip`, `userAgent`).

4. `src/middlewares/requestContext.ts`

- Enriches `req.log` for per-request context.

5. `src/middlewares/auth.ts`

- After auth success, adds `userId` and `role` to request logger context.

6. `src/middlewares/globalErrorHandler.ts`

- Logs structured errors with:
  - `err`
  - `requestId`
  - `userId`
  - `method`, `url`, `ip`

7. Dedicated streams

- `logger` -> general app events
- `errorLogger` -> system/process/runtime errors
- `auditLogger` -> compliance/security actions

8. Audit pipeline

- `src/shared/services/audit.service.ts` enqueues audit job and logs audit event metadata.
- `src/workers/audit.worker.ts` persists audit data and logs worker outcomes.

---

## 17. Team Rules to Follow (Daily Developer Guideline)

Use these rules consistently:

1. Never use `console.log` in runtime code.
2. Always use structured logs with object fields:

```ts
logger.info({ userId, requestId, action: 'USER_CREATE' }, 'User created');
```

3. Always include contextual IDs when available:

- `requestId`
- `userId`
- `hospitalId`
- `entityId`

4. Log errors with `{ err }`, not only message text:

```ts
logger.error({ err, requestId, userId }, 'Database write failed');
```

5. Use correct level:

- success milestones -> `info`
- expected anomalies -> `warn`
- failed operation -> `error`
- crash path -> `fatal`

6. Never log sensitive data:

- passwords
- tokens
- cookies
- authorization headers
- full PII payloads

7. Keep log messages stable and searchable:

- prefer short constant-style messages
- put details in fields, not long text

8. In controllers/services/repositories:

- controller: request boundary logs
- service: business decision logs
- repository: DB query + latency logs

9. For audit actions, use audit path only:

- login
- role/permission changes
- delete operations
- sensitive record updates

10. Before merge, validate:

- No secret fields logged
- Every error path logs structured `err`
- Request ID present in HTTP/error logs
