# Data Model: 宝宝成长记录语音版

**Date**: 2026-03-22  
**Database**: SQLite with TypeORM  
**Status**: Draft

## Entity Relationship Diagram

```
┌─────────────────┐       ┌──────────────────┐
│      User       │       │   BabyRecord     │
├─────────────────┤       ├──────────────────┤
│ PK id           │──┐    │ PK id            │
│    email        │  │    │ FK user_id       │
│    phone        │  │    │    record_type   │
│    password_hash│  │    │    record_time   │
│    created_at   │  └───>│    details       │
│    updated_at   │       │    created_at    │
└─────────────────┘       │    updated_at    │
                          └──────────────────┘
```

## Entities

### User (用户)

Represents a parent/mother who uses the app to track baby's activities.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NULLABLE | User's email address |
| phone | VARCHAR(20) | UNIQUE, NULLABLE | User's phone number |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**:
- `idx_user_email` on `email`
- `idx_user_phone` on `phone`

**Validation Rules**:
- Either email or phone must be provided
- Password minimum 8 characters (enforced at application layer)

---

### BabyRecord (宝宝记录)

Stores all baby activity records (feeding, diaper, poop, food, sleep, other).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → User.id | Owner of the record |
| record_type | VARCHAR(20) | NOT NULL | Type: feeding, diaper, poop, food, sleep, other |
| record_time | DATETIME | NOT NULL | When the activity occurred |
| details | JSON | NOT NULL | Type-specific details (see below) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**:
- `idx_record_user_id` on `user_id`
- `idx_record_type` on `record_type`
- `idx_record_time` on `record_time`
- `idx_record_user_time` on `(user_id, record_time)` - for timeline queries

**Validation Rules**:
- `record_type` must be one of: `feeding`, `diaper`, `poop`, `food`, `sleep`, `other`
- `record_time` cannot be in the future
- `user_id` must reference existing User

---

## Details JSON Schema

The `details` field stores type-specific information as JSON.

### Feeding (喂奶)

```json
{
  "amount_ml": 150,
  "type": "formula",
  "note": "宝宝喝得很开心"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount_ml | INTEGER | Yes | Milk amount in milliliters |
| type | STRING | No | Feeding type: breast, formula, mixed |
| note | STRING | No | Additional notes |

### Diaper (换尿布)

```json
{
  "type": "wet",
  "note": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | STRING | No | Diaper condition: wet, dirty, both |
| note | STRING | No | Additional notes |

### Poop (大便)

```json
{
  "color": "yellow",
  "consistency": "soft",
  "amount": "normal",
  "note": "有奶瓣"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| color | STRING | No | Stool color |
| consistency | STRING | No | Stool consistency |
| amount | STRING | No | Stool amount |
| note | STRING | No | Additional observations |

### Food (辅食)

```json
{
  "foods": ["米粉", "苹果泥"],
  "amount": "半碗",
  "reaction": "good",
  "note": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| foods | ARRAY | Yes | List of food items |
| amount | STRING | No | Amount eaten |
| reaction | STRING | No | Baby's reaction to food |
| note | STRING | No | Additional notes |

### Sleep (睡眠)

```json
{
  "duration_minutes": 180,
  "quality": "good",
  "note": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| duration_minutes | INTEGER | Yes | Sleep duration in minutes |
| quality | STRING | No | Sleep quality |
| note | STRING | No | Additional notes |

### Other (其他)

```json
{
  "description": "宝宝第一次翻身",
  "category": "milestone"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| description | STRING | Yes | Description of the event |
| category | STRING | No | Optional category |

---

## TypeScript Interfaces

```typescript
// Enums
enum RecordType {
  FEEDING = 'feeding',
  DIAPER = 'diaper',
  POOP = 'poop',
  FOOD = 'food',
  SLEEP = 'sleep',
  OTHER = 'other'
}

// Base entity
interface BaseEntity {
  id: number;
  created_at: Date;
  updated_at: Date;
}

// User entity
interface User extends BaseEntity {
  email: string | null;
  phone: string | null;
  password_hash: string;
}

// Record details discriminated union
type RecordDetails =
  | FeedingDetails
  | DiaperDetails
  | PoopDetails
  | FoodDetails
  | SleepDetails
  | OtherDetails;

interface FeedingDetails {
  amount_ml: number;
  type?: 'breast' | 'formula' | 'mixed';
  note?: string;
}

interface DiaperDetails {
  type?: 'wet' | 'dirty' | 'both';
  note?: string;
}

interface PoopDetails {
  color?: string;
  consistency?: 'hard' | 'soft' | 'watery' | 'mucus';
  amount?: 'small' | 'normal' | 'large';
  note?: string;
}

interface FoodDetails {
  foods: string[];
  amount?: string;
  reaction?: 'good' | 'neutral' | 'allergic';
  note?: string;
}

interface SleepDetails {
  duration_minutes: number;
  quality?: 'good' | 'restless' | 'woke_often';
  note?: string;
}

interface OtherDetails {
  description: string;
  category?: string;
}

// BabyRecord entity
interface BabyRecord extends BaseEntity {
  user_id: number;
  record_type: RecordType;
  record_time: Date;
  details: RecordDetails;
}
```

---

## Database Migrations

### Initial Migration

```sql
-- Create User table
CREATE TABLE "user" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "email" VARCHAR(255) UNIQUE,
  "phone" VARCHAR(20) UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL,
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for User
CREATE INDEX "idx_user_email" ON "user"("email");
CREATE INDEX "idx_user_phone" ON "user"("phone");

-- Create BabyRecord table
CREATE TABLE "baby_record" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "record_type" VARCHAR(20) NOT NULL,
  "record_time" DATETIME NOT NULL,
  "details" JSON NOT NULL,
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create indexes for BabyRecord
CREATE INDEX "idx_record_user_id" ON "baby_record"("user_id");
CREATE INDEX "idx_record_type" ON "baby_record"("record_type");
CREATE INDEX "idx_record_time" ON "baby_record"("record_time");
CREATE INDEX "idx_record_user_time" ON "baby_record"("user_id", "record_time");
```

---

## Query Patterns

### Timeline Query (Home Page)

```sql
-- Get records for timeline, paginated
SELECT * FROM baby_record
WHERE user_id = ?
ORDER BY record_time DESC
LIMIT ? OFFSET ?;
```

### Filtered Query

```sql
-- Filter by type and time range
SELECT * FROM baby_record
WHERE user_id = ?
  AND record_type = ?
  AND record_time >= ?
  AND record_time <= ?
ORDER BY record_time DESC;
```

### Statistics Query

```sql
-- Daily feeding amounts (last 30 days)
SELECT 
  DATE(record_time) as date,
  SUM(JSON_EXTRACT(details, '$.amount_ml')) as total_ml
FROM baby_record
WHERE user_id = ?
  AND record_type = 'feeding'
  AND record_time >= DATE('now', '-30 days')
GROUP BY DATE(record_time)
ORDER BY date;

-- Daily diaper count
SELECT 
  DATE(record_time) as date,
  COUNT(*) as count
FROM baby_record
WHERE user_id = ?
  AND record_type = 'diaper'
  AND record_time >= DATE('now', '-30 days')
GROUP BY DATE(record_time)
ORDER BY date;
```

---


## 数据完整性

### 约束

1. **用户必须有邮箱或手机号**:
   - 在应用层强制执行 (TypeORM @BeforeInsert)

2. **记录时间不能是未来时间**:
   - 在应用层强制执行

3. **详情必须符合 record_type 模式**:
   - 使用 class-validator 和可区分联合类型进行验证

### 级联行为

- **用户删除**: 级联删除所有关联的 BabyRecords
- **记录删除**: 未实现软删除（仅硬删除）

---

## 性能考虑

1. **分页**: 列表查询始终使用 LIMIT/OFFSET
2. **索引**: 在 (user_id, record_time) 上创建复合索引用于时间线查询
3. **JSON 查询**: 使用 SQLite JSON 函数 (JSON_EXTRACT) 进行统计
4. **连接池**: 使用 better-sqlite3 实现同步、池化连接



