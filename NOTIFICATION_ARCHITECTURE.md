# Production-Level Notification Microservice Architecture

## 1. High-Level System
In scalable systems, notifications are a separate microservice, not embedded in the booking service.

```text
                ┌─────────────────┐
                │  Mobile App     │
                │  Hotel Dashboard│
                └─────────┬───────┘
                          │
                          ▼
                    API Gateway
                     (Nginx)
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
Booking Service     User Service        Hotel Service
      │                   │                   │
      └─────────────── Event Bus ─────────────┘
                          │
                          ▼
                Notification Service
                          │
                          ▼
                Message Queue (BullMQ)
                          │
         ┌───────────────┼───────────────┐
         │               │               │
     Push Worker      Email Worker     SMS Worker
         │               │               │
         ▼               ▼               ▼
   Push Provider      Email Provider   SMS Gateway
```

### Core Idea
Services do not send notifications directly. Instead they publish an event:
- `BOOKING_CREATED`
- `PAYMENT_CONFIRMED`
- `BOOKING_CANCELLED`

Notification service consumes those events and adds jobs to the queue. Workers process the notifications and deliver them through Push, SMS, or Email.

## 2. Notification Tech Stack
- **API**: Node.js + Express
- **Queue**: BullMQ
- **Cache**: Redis
- **Push**: Firebase Cloud Messaging (FCM)
- **Email**: SMTP / SendGrid
- **SMS**: local gateway / telecom API
- **Real-time**: WebSocket / Server-Sent Events

## 3. Node.js Notification Microservice Structure
```text
notification-service
│
├── src
│   ├── config
│   │   ├── redis.js
│   │   ├── firebase.js
│   │   └── database.js
│   │
│   ├── queues
│   │   └── notificationQueue.js
│   │
│   ├── workers
│   │   ├── pushWorker.js
│   │   ├── emailWorker.js
│   │   └── smsWorker.js
│   │
│   ├── services
│   │   ├── pushService.js
│   │   ├── emailService.js
│   │   └── smsService.js
│   │
│   ├── controllers
│   │   └── notificationController.js
│   │
│   ├── routes
│   │   └── notificationRoutes.js
│   │
│   ├── models
│   │   ├── Notification.js
│   │   └── NotificationSetting.js
│   │
│   └── server.js
├── .env
├── package.json
└── README.md
```

## 4. Notification Database Schema

**`notifications`**
- `id`
- `user_id`
- `hotel_id`
- `title`
- `message`
- `type` (Push, Email, SMS, InApp)
- `status` (Pending, Sent, Failed)
- `created_at`
- `read_at`

**`notification_settings`**
- `user_id`
- `push_enabled`
- `sms_enabled`
- `email_enabled`

## 5. Guaranteeing Notification Reliability at Scale
1. **Retry Mechanism**: BullMQ supports retries (e.g., exponential backoff).
2. **Dead Letter Queue**: Handle failed jobs for later inspection.
3. **Idempotency**: Prevent duplicate notifications by tracking `event_id` and `notification_type`.
4. **Worker Horizontal Scaling**: Scale out workers depending on load.
5. **Monitoring**: Track queue size, failed jobs, and processing latency.

## 6. Real-Time Notifications
Use WebSockets or Server-Sent Events for hotel dashboards.
Flow: Booking created -> Notification service -> WebSocket broadcast -> Hotel dashboard updates instantly.

## 7. Performance Tips
Never send notifications inside the main request.
- **Bad**: booking -> send SMS -> send email -> response
- **Good**: booking -> add queue job -> response immediately
