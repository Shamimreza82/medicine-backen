# Logging Rules (PR Checklist)

Use this file as a mandatory checklist before merging backend code.

## 1. Allowed Logger Usage

- Use only project loggers from `src/bootstrap/logger`:
  - `logger` for normal app events
  - `errorLogger` for failures/system errors
  - `auditLogger` for compliance/security actions
- Do not use `console.log` in runtime code.

## 2. Required Log Structure

- Always log with structured objects, not plain strings only.
- Include context fields when available:
  - `requestId`
  - `userId`
  - `hospitalId`
  - `entityId`
  - `ip`

Example:

```ts
logger.info({ requestId, userId, hospitalId, action: 'PATIENT_CREATE' }, 'Patient created');
```

## 3. Error Logging Rule

- Always log errors with `{ err }`.
- Never log only `err.message` if stack/context is needed.

Example:

```ts
errorLogger.error(
  { err, requestId, userId, method: req.method, url: req.originalUrl },
  'Unhandled error',
);
```

## 4. Log Level Rule

- `trace`: deep troubleshooting only
- `debug`: developer diagnostics
- `info`: successful operations and milestones
- `warn`: recoverable issues / suspicious behavior
- `error`: operation failed
- `fatal`: process cannot continue

## 5. Sensitive Data Rule (Strict)

Never log:

- passwords
- access/refresh tokens
- cookies
- `authorization` header
- full raw PII payloads

If needed, log masked fields only.

## 6. Request Logging Rule

- All HTTP requests must pass through `pino-http` middleware.
- `x-request-id` must be generated/propagated.
- Request completion logs must include:
  - `method`
  - `url`
  - `statusCode`
  - `responseTime`
  - `requestId`
  - `ip`

## 7. Layer-by-Layer Rule

- Controller: log request entry/exit and high-level outcome.
- Service: log business decisions and important state changes.
- Repository: log DB query result/latency (at debug level).
- Middleware: enrich request context (`requestId`, `userId`) once.

## 8. Audit Logging Rule

Must go through audit flow for:

- login/logout
- role/permission changes
- delete operations
- sensitive update operations

Audit events should include:

- actor (`actorUserId`)
- action
- entity/entityId
- requestId
- metadata (safe fields only)

## 9. Message Style Rule

- Keep message short and stable (search-friendly).
- Put variable details in structured fields.
- Avoid emojis and noisy text in production logs.

## 10. PR Approval Checklist

- [ ] No `console.log` added
- [ ] Correct logger (`logger` vs `errorLogger` vs `auditLogger`)
- [ ] Structured fields included
- [ ] `{ err }` used for error logs
- [ ] No sensitive data leakage
- [ ] Request correlation (`requestId`) preserved
- [ ] New sensitive flows produce audit logs
