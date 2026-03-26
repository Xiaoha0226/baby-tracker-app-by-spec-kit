# 技术研究: 宝宝成长记录语音版

**日期**: 2026-03-22  
**功能**: 001-baby-tracker-voice  
**状态**: 已完成

## 技术栈概览

基于需求和用户规格，选择了以下技术栈：

| 层级 | 技术 | 版本 | 理由 |
|------|------|------|------|
| 前端 | Vue 3 | 3.4+ | Composition API，更好的 TypeScript 支持，性能改进 |
| 构建工具 | Vite | 5.x | 快速 HMR，优化的生产构建，原生 ESM |
| UI 框架 | Element Plus / Naive UI | 最新 | 适合宝宝追踪应用的可爱/柔和美学 |
| 图表 | ECharts / Chart.js | 5.x | 全面的图表类型，移动端友好 |
| 后端 | NestJS | 10.x | 企业级 Node.js 框架，优秀的 TypeScript 支持 |
| 数据库 | SQLite | 3.x | 轻量级，基于文件，完美适合 MVP 和小规模应用 |
| ORM | TypeORM | 0.3.x | 一流的 TypeScript 支持，与 NestJS 配合良好 |
| AI/ML | OpenAI API / Claude API | 最新 | 语音转文本和自然语言理解 |
| 认证 | JWT | - | 移动优先 H5 应用的无状态认证 |

## 前端架构

### Vue 3 + Vite 设置

**决策**: 使用 Vue 3 配合 Composition API 和 `<script setup>` 语法

**理由**:
- 更好的 TypeScript 推断和支持
- Composition API 代码更简洁
- Vite 提供即时 HMR (< 100ms)，对快速 UI 迭代至关重要
- 与 Vue 2 + Webpack 相比包大小更小

**关键库**:
- `vue-router` - SPA 导航
- `pinia` - 状态管理（比 Vuex 更轻量，TypeScript 更好）
- `axios` - 带认证拦截器的 HTTP 客户端
- `dayjs` - 轻量级日期操作（2KB 对比 Moment 的 232KB）
- `echarts` - 用于数据可视化图表

### UI/UX 考虑

**设计系统**: 可爱、治愈、温暖的审美
- 柔和粉彩色调（粉色、奶油色、浅蓝色、薄荷绿）
- 圆角（8-16px 边框半径）
- 记录类型集成表情符号
- 语音录制反馈的平滑动画

**响应式策略**:
- 移动优先设计（H5 目标）
- 基于视口的大小（vw/vh）
- 触摸优化的交互（最小 44px 触摸目标）

## 后端架构

### NestJS 结构

```
backend/
├── src/
│   ├── auth/              # 认证模块
│   ├── users/             # 用户管理
│   ├── records/           # 宝宝记录 CRUD
│   ├── ai/                # AI/ML 集成
│   ├── stats/             # 统计聚合
│   └── common/            # 守卫、拦截器、过滤器
```

**关键模块**:
- **AuthModule**: 基于 JWT 的认证，bcrypt 密码哈希
- **RecordsModule**: 宝宝记录的 CRUD 操作
- **AIModule**: 与 OpenAI/Claude 集成进行语音识别
- **StatsModule**: 图表数据聚合

### 数据库设计 (SQLite)

**决策**: SQLite 配合 TypeORM

**理由**:
- 零配置，基于文件的存储
- 对 MVP 足够（单用户到数千用户）
- 易于备份（单个文件）
- 如有需要可以稍后迁移到 PostgreSQL

**性能考虑**:
- 在 `user_id`、`record_type`、`record_time` 上添加索引
- 使用连接池（better-sqlite3）
- 为记录列表实现分页（每页 20 项）

## 安全分析

### 认证和授权

**JWT 策略**:
- 访问令牌：15 分钟过期
- 刷新令牌：7 天过期，存储在 httpOnly cookie 中
- 令牌刷新端点实现无缝 UX

**密码安全**:
- bcrypt 成本因子 12（自适应哈希）
- 最小密码要求：8 个字符，1 个数字，1 个字母

### API 安全

- **CORS**: 白名单特定来源（生产域名）
- **速率限制**: 每 IP 100 请求/分钟，每 10 次认证尝试/分钟
- **输入验证**: 使用 DTO 的 class-validator
- **SQL 注入防护**: TypeORM 查询构建器（参数化查询）
- **XSS 防护**: 输出编码，Content-Security-Policy 头

### 数据隐私

- 如需要加密敏感字段（PII）
- 生产环境仅 HTTPS
- 安全 cookie 设置（Secure、HttpOnly、SameSite=Strict）

## 性能优化

### 前端

1. **包优化**:
   - 懒加载路由（代码分割）
   - Tree-shake 未使用的代码
   - Gzip/Brotli 压缩
   - 目标: < 200KB 初始包

2. **运行时性能**:
   - 长记录列表虚拟滚动
   - 语音录制防抖（300ms）
   - 缓存 API 响应（stale-while-revalidate）

3. **资源优化**:
   - WebP 图片带回退
   - SVG 图标（关键的内联，其他的懒加载）

### 后端

1. **数据库**:
   - 连接池（最大 10 个连接）
   - 查询优化（使用贪婪加载防止 N+1）
   - 频繁查询列的数据库索引

2. **API 响应**:
   - 压缩（gzip）
   - 分页（默认 20，最大 100 项）
   - 统计数据的响应缓存（5 分钟 TTL）

3. **AI 集成**:
   - 为 AI API 实现请求队列（速率限制）
   - 缓存常见识别模式
   - 如果 AI 不可用则回退到本地关键词匹配

## AI/ML 集成

### 语音识别流程

1. **音频捕获**: Web Audio API → WAV/MP3 blob
2. **语音转文本**: OpenAI Whisper API 或浏览器原生 SpeechRecognition
3. **NLU 处理**: GPT-4/Claude 进行实体提取
   - 提取: record_type, time, amount, status
   - 置信度阈值: 0.7（低于此值 → 请求澄清）

### 提示工程

```
System: 你是一个宝宝追踪助手。从家长的语音输入中提取结构化数据。

提取这些字段:
- record_type: feeding|diaper|poop|food|sleep|other
- time: ISO 时间戳（如未指定默认为现在）
- details: 类型特定的详情（amount_ml, duration_min, description 等）

仅返回 JSON。如果信息缺失，指明哪些字段需要澄清。
```

## 部署策略

### 开发

- 前端: `npm run dev` (Vite 开发服务器)
- 后端: `npm run start:dev` (NestJS 监视模式)
- 数据库: `data/` 目录中的 SQLite 文件

### 生产

- **前端**: 静态托管（Vercel/Netlify/Cloudflare Pages）
- **后端**: Node.js 服务器（Railway/Render/DigitalOcean）
- **数据库**: SQLite 配合定期备份到 S3
- **CDN**: Cloudflare 用于静态资源

### 环境变量

```env
# 后端
DATABASE_URL=./data/baby-tracker.db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
OPENAI_API_KEY=sk-...
PORT=3000

# 前端
VITE_API_BASE_URL=https://api.yourapp.com
```

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| AI API 延迟/不可用 | 高 | 实现关键词回退，队列请求 |
| SQLite 可扩展性限制 | 中 | 规划迁移到 PostgreSQL 的路径 |
| 移动浏览器兼容性 | 中 | 在 iOS Safari、Android Chrome 上测试 |
| 语音识别准确率 | 高 | 允许手动修正，置信度阈值 |
| 数据丢失 | 高 | 自动备份，导出功能 |

## 考虑的替代方案

| 替代方案 | 未选择的原因 |
|----------|--------------|
| React + Next.js | Vue 3 对移动 H5 性能更好 |
| Fastify（替代 NestJS） | NestJS 为团队扩展提供更好的结构 |
| PostgreSQL（替代 SQLite） | SQLite 对 MVP 足够，部署更简单 |
| Firebase（BaaS） | 供应商锁定顾虑，需要自定义 AI 集成 |

## 结论

选定的技术栈（Vue 3 + Vite + NestJS + SQLite）提供：
- ✅ 快速开发速度
- ✅ 良好的性能特性
- ✅ 强大的 TypeScript 支持
- ✅ 易于部署和扩展
- ✅ MVP 阶段成本效益高

下一步: 继续数据模型设计和 API 契约定义。