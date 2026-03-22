# Technical Research: 宝宝成长记录语音版

**Date**: 2026-03-22  
**Feature**: 001-baby-tracker-voice  
**Status**: Completed

## Technology Stack Overview

Based on requirements and user specifications, the following stack was selected:

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Frontend | Vue 3 | 3.4+ | Composition API, better TypeScript support, performance improvements |
| Build Tool | Vite | 5.x | Fast HMR, optimized production builds, native ESM |
| UI Framework | Element Plus / Naive UI | latest | Cute/soft aesthetics for baby tracking app |
| Charts | ECharts / Chart.js | 5.x | Comprehensive chart types, mobile-friendly |
| Backend | NestJS | 10.x | Enterprise-grade Node.js framework, excellent TypeScript support |
| Database | SQLite | 3.x | Lightweight, file-based, perfect for MVP and small-scale apps |
| ORM | TypeORM | 0.3.x | First-class TypeScript support, works well with NestJS |
| AI/ML | OpenAI API / Claude API | latest | Speech-to-text and natural language understanding |
| Auth | JWT | - | Stateless authentication for mobile-first H5 app |

## Frontend Architecture

### Vue 3 + Vite Setup

**Decision**: Use Vue 3 with Composition API and `<script setup>` syntax

**Rationale**:
- Better TypeScript inference and support
- More concise code with Composition API
- Vite provides instant HMR (< 100ms) critical for rapid UI iteration
- Smaller bundle size compared to Vue 2 + Webpack

**Key Libraries**:
- `vue-router` - SPA navigation
- `pinia` - State management (lighter than Vuex, better TypeScript)
- `axios` - HTTP client with interceptors for auth
- `dayjs` - Lightweight date manipulation (2KB vs Moment's 232KB)
- `echarts` - For data visualization charts

### UI/UX Considerations

**Design System**: Cute, healing, warm aesthetic
- Soft pastel color palette (pink, cream, light blue, mint)
- Rounded corners (8-16px border radius)
- Emoji integration for record types
- Smooth animations for voice recording feedback

**Responsive Strategy**:
- Mobile-first design (H5 target)
- Viewport-based sizing (vw/vh)
- Touch-optimized interactions (minimum 44px touch targets)

## Backend Architecture

### NestJS Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── records/           # Baby record CRUD
│   ├── ai/                # AI/ML integration
│   ├── stats/             # Statistics aggregation
│   └── common/            # Guards, interceptors, filters
```

**Key Modules**:
- **AuthModule**: JWT-based authentication, bcrypt password hashing
- **RecordsModule**: CRUD operations for baby records
- **AIModule**: Integration with OpenAI/Claude for speech recognition
- **StatsModule**: Data aggregation for charts

### Database Design (SQLite)

**Decision**: SQLite with TypeORM

**Rationale**:
- Zero configuration, file-based storage
- Sufficient for MVP (single-user to low-thousands users)
- Easy backup (single file)
- Can migrate to PostgreSQL later if needed

**Performance Considerations**:
- Add indexes on `user_id`, `record_type`, `record_time`
- Use connection pooling (better-sqlite3)
- Implement pagination for record lists (20 items per page)

## Security Analysis

### Authentication & Authorization

**JWT Strategy**:
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry, stored in httpOnly cookie
- Token refresh endpoint for seamless UX

**Password Security**:
- bcrypt with cost factor 12 (adaptive hashing)
- Minimum password requirements: 8 chars, 1 number, 1 letter

### API Security

- **CORS**: Whitelist specific origins (production domain)
- **Rate Limiting**: 100 requests/minute per IP, 10 auth attempts/minute
- **Input Validation**: class-validator with DTOs
- **SQL Injection Prevention**: TypeORM query builder (parameterized queries)
- **XSS Prevention**: Output encoding, Content-Security-Policy headers

### Data Privacy

- Encrypt sensitive fields if needed (PII)
- HTTPS-only in production
- Secure cookie settings (Secure, HttpOnly, SameSite=Strict)

## Performance Optimizations

### Frontend

1. **Bundle Optimization**:
   - Lazy load routes (code splitting)
   - Tree-shake unused code
   - Gzip/Brotli compression
   - Target: < 200KB initial bundle

2. **Runtime Performance**:
   - Virtual scrolling for long record lists
   - Debounce voice recording (300ms)
   - Cache API responses (stale-while-revalidate)

3. **Asset Optimization**:
   - WebP images with fallbacks
   - SVG icons (inline for critical, lazy for others)

### Backend

1. **Database**:
   - Connection pooling (max 10 connections)
   - Query optimization (N+1 prevention with eager loading)
   - Database indexes on frequently queried columns

2. **API Response**:
   - Compression (gzip)
   - Pagination (default 20, max 100 items)
   - Response caching for stats (5-minute TTL)

3. **AI Integration**:
   - Implement request queue for AI API (rate limiting)
   - Cache common recognition patterns
   - Fallback to local keyword matching if AI unavailable

## AI/ML Integration

### Speech Recognition Flow

1. **Audio Capture**: Web Audio API → WAV/MP3 blob
2. **Speech-to-Text**: OpenAI Whisper API or browser-native SpeechRecognition
3. **NLU Processing**: GPT-4/Claude for entity extraction
   - Extract: record_type, time, amount, status
   - Confidence threshold: 0.7 (below → ask for clarification)

### Prompt Engineering

```
System: You are a baby tracking assistant. Extract structured data from parent's voice input.

Extract these fields:
- record_type: feeding|diaper|poop|food|sleep|other
- time: ISO timestamp (default to now if not specified)
- details: type-specific details (amount_ml, duration_min, description, etc.)

Return JSON only. If information is missing, indicate which fields need clarification.
```

## Deployment Strategy

### Development

- Frontend: `npm run dev` (Vite dev server)
- Backend: `npm run start:dev` (NestJS watch mode)
- Database: SQLite file in `data/` directory

### Production

- **Frontend**: Static hosting (Vercel/Netlify/Cloudflare Pages)
- **Backend**: Node.js server (Railway/Render/DigitalOcean)
- **Database**: SQLite with regular backups to S3
- **CDN**: Cloudflare for static assets

### Environment Variables

```env
# Backend
DATABASE_URL=./data/baby-tracker.db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
OPENAI_API_KEY=sk-...
PORT=3000

# Frontend
VITE_API_BASE_URL=https://api.yourapp.com
```

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI API latency/unavailability | High | Implement keyword fallback, queue requests |
| SQLite scalability limits | Medium | Plan migration path to PostgreSQL |
| Mobile browser compatibility | Medium | Test on iOS Safari, Android Chrome |
| Voice recognition accuracy | High | Allow manual correction, confidence thresholds |
| Data loss | High | Automated backups, export functionality |

## Alternatives Considered

| Alternative | Why Not Chosen |
|-------------|----------------|
| React + Next.js | Vue 3 has better performance for mobile H5 |
| Fastify (instead of NestJS) | NestJS provides better structure for team scaling |
| PostgreSQL (instead of SQLite) | SQLite sufficient for MVP, simpler deployment |
| Firebase (BaaS) | Vendor lock-in concern, need custom AI integration |

## Conclusion

The selected stack (Vue 3 + Vite + NestJS + SQLite) provides:
- ✅ Fast development velocity
- ✅ Good performance characteristics
- ✅ Strong TypeScript support
- ✅ Easy deployment and scaling
- ✅ Cost-effective for MVP stage

Next steps: Proceed to data model design and API contract definition.
