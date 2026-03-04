# Somstay Backend Production Standards

This document serves as the "source of truth" for backend performance, scalability, and security standards.

## 🎯 Performance Targets
- **p50 Latency**: < 50ms
- **p95 Latency**: < 200ms
- **Error Rate**: < 0.1%
- **Uptime**: 99.9%

## 🚀 Key Requirements

### 1. Database Optimization
- **Indexing**: All frequently queried columns must be indexed.
- **Slow Query Logging**: Log and fix any query taking > 200ms.
- **Connection Pooling**: Use pools (limit 10-20) instead of single connections.

### 2. API Best Practices
- **Pagination**: List endpoints MUST support pagination.
- **Compression**: All responses must be Gzip/Brotli compressed.
- **Rate Limiting**: Protect endpoints from abuse (100 req / 15 min).

### 3. Caching Strategy
- **Redis**: Cache hotel lists, details, and room availability (60-300s TTL).
- **CDN**: Serve all static assets (images) via a CDN (e.g., Cloudflare/S3).

### 4. Image Optimization
- Max width: 1200px
- Format: WebP
- Size: < 300KB

### 5. Security Hardening
- **Validation**: Use Zod/Joi for every request.
- **Headers**: Use Helmet with strict policies.
- **HTTPS**: Force HTTPS in production.
- **Secrets**: Never hardcode credentials; use `.env`.

### 6. Scalability
- **Process Management**: Use PM2 in cluster mode (`pm2 start app.js -i max`).
- **Load Balancing**: Use NGINX as a reverse proxy.

### 7. Monitoring & Logging
- **Logging**: Use Winston/Pino for structured logs.
- **Metrics**: Track p50/p95 latency and error rates.
- **Health Checks**: Maintain `/api/health` for monitoring.

### 8. Standardized Error Handling
All responses must follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "",
  "errors": null
}
```
