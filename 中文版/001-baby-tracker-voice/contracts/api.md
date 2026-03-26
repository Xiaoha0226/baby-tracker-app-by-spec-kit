# API Contracts: 宝宝成长记录语音版

**Date**: 2026-03-22  
**Base URL**: `/api/v1`  
**Authentication**: JWT Bearer Token

## Authentication

### POST /auth/register

Register a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "phone": "13800138000",
  "password": "securePassword123"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "phone": "13800138000",
      "created_at": "2026-03-22T10:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 900
    }
  }
}
```

### POST /auth/login

Authenticate user and receive tokens.

**Request**:
```json
{
  "account": "user@example.com",
  "password": "securePassword123"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "phone": "13800138000"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 900
    }
  }
}
```

## Records

### GET /records

Get paginated list of baby records.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `type`: Filter by type
- `start_date`: Filter start date (ISO 8601)
- `end_date`: Filter end date (ISO 8601)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "record_type": "feeding",
        "record_time": "2026-03-22T14:30:00Z",
        "details": {
          "amount_ml": 150,
          "type": "formula"
        },
        "created_at": "2026-03-22T14:35:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "total_pages": 8
    }
  }
}
```

### POST /records

Create a new baby record.

**Request**:
```json
{
  "record_type": "feeding",
  "record_time": "2026-03-22T14:30:00Z",
  "details": {
    "amount_ml": 150,
    "type": "formula"
  }
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "record_type": "feeding",
    "record_time": "2026-03-22T14:30:00Z",
    "details": {
      "amount_ml": 150,
      "type": "formula"
    },
    "created_at": "2026-03-22T14:35:00Z"
  }
}
```

## AI / Voice Processing

### POST /ai/speech-to-text

Convert speech audio to text.

**Request**: multipart/form-data with audio file

**Response 200**:
```json
{
  "success": true,
  "data": {
    "text": "宝宝刚才喝了150毫升奶",
    "confidence": 0.95
  }
}
```

### POST /ai/parse-record

Parse natural language into structured record data.

**Request**:
```json
{
  "text": "宝宝刚才喝了150毫升奶"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "record_type": "feeding",
    "record_time": "2026-03-22T14:30:00Z",
    "details": {
      "amount_ml": 150,
      "type": "formula"
    },
    "confidence": 0.92,
    "needs_clarification": false
  }
}
```

## Statistics

### GET /stats/summary

Get summary statistics for dashboard.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2026-02-20T00:00:00Z",
      "end": "2026-03-22T23:59:59Z",
      "days": 30
    },
    "summary": {
      "total_feedings": 85,
      "total_milk_ml": 12750,
      "total_diapers": 92,
      "total_poops": 28,
      "total_sleep_hours": 285.5
    }
  }
}
```

### GET /stats/feeding

Get feeding statistics chart data.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "chart_type": "line",
    "labels": ["02-20", "02-21", "02-22"],
    "datasets": [
      {
        "label": "奶量 (ml)",
        "data": [420, 450, 380]
      }
    ]
  }
}
```
