# 实施计划: 宝宝成长记录语音版

**分支**: `001-baby-tracker-voice` | **日期**: 2026-03-22 | **规格**: [spec.md](./spec.md)
**输入**: 来自 `/specs/001-baby-tracker-voice/spec.md` 的功能规格说明书

## 摘要

宝宝成长记录语音版是一款面向宝妈的H5应用，通过语音输入+AI智能识别，帮助记录宝宝日常活动（喂奶、换尿布、大便、辅食、睡眠）。应用采用Vue 3 + Vite构建前端，NestJS + SQLite构建后端，实现可爱的治愈系UI风格。

核心技术特点：
- 长按语音输入，AI自动识别记录类型和详情
- 智能时间解析（支持"刚才"、"昨天"等模糊表达）
- 补充对话限制在两轮内，保持简洁体验
- 数据可视化统计（奶量、尿布、大便、睡眠趋势）
- 用户注册登录，密码加密存储

## 技术背景

**语言/版本**: TypeScript 5.x, Node.js 18+  
**主要依赖**: Vue 3.4+, Vite 5.x, NestJS 10.x, TypeORM 0.3.x  
**存储**: SQLite 3.x (基于文件)  
**测试**: Vitest (前端), Jest (后端)  
**目标平台**: 移动端H5 (iOS Safari, Android Chrome)  
**项目类型**: Web应用 (前端 + 后端)  
**性能目标**: API < 200ms p95, 包 < 200KB gzip, 渲染 < 1s  
**约束**: < 100MB内存, 离线语音录制能力, AI API速率限制  
**规模/范围**: 单用户到数千用户, 每用户1000+记录

## 章程检查

*门禁: 必须在第0阶段研究前通过。第1阶段设计后重新检查。*

### 代码质量标准
- ✅ 可读性优先: 清晰的命名, 一致的格式
- ✅ DRY原则: 可复用组件, 共享工具
- ✅ 单一职责: 每个模块有明确的目的
- ✅ 类型安全: 严格TypeScript, 无`any`除非有理由
- ✅ 文档: 公共API有文档说明

### 测试标准
- ✅ 测试优先开发: TDD方法
- ✅ 最低覆盖率: 80%目标
- ✅ 测试金字塔: 单元(70%), 集成(20%), E2E(10%)
- ✅ 独立性: 测试之间无共享状态
- ✅ 确定性: 每次运行结果相同

### 用户体验一致性
- ✅ 设计系统: 可爱/治愈系美学，柔和色彩
- ✅ 响应式设计: 移动优先H5
- ✅ 无障碍性: 触摸目标 >= 44px
- ✅ 错误处理: 用户友好的消息
- ✅ 加载状态: 语音录制反馈

### 性能要求
- ✅ 响应时间: API < 200ms, UI渲染 < 1s
- ✅ 包大小: < 200KB gzip初始包
- ✅ 内存使用: 无泄漏, < 150%基线
- ✅ 数据库查询: 已索引, 防止N+1
- ✅ 缓存策略: 统计数据的响应缓存

**状态**: ✅ 所有门禁通过

## 项目结构

### 文档 (此功能)

```text
specs/001-baby-tracker-voice/
├── plan.md              # 本文件
├── research.md          # 第0阶段: 技术研究
├── data-model.md        # 第1阶段: 数据库模式
├── quickstart.md        # 第1阶段: 设置指南
├── contracts/           # 第1阶段: API契约
│   └── api.md
└── tasks.md             # 由 /speckit.tasks 生成
```

### 源代码 (仓库根目录)

```text
baby-tracker-app/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # JWT认证
│   │   ├── users/          # 用户管理
│   │   ├── records/        # 宝宝记录CRUD
│   │   ├── ai/             # AI/ML集成
│   │   ├── stats/          # 统计聚合
│   │   └── common/         # 守卫, 拦截器, 过滤器
│   ├── test/
│   └── data/               # SQLite数据库
├── frontend/               # Vue 3 + Vite
│   ├── src/
│   │   ├── components/     # 可复用UI组件
│   │   ├── views/          # 页面组件
│   │   ├── stores/         # Pinia状态管理
│   │   ├── api/            # API客户端
│   │   └── utils/          # 工具函数
│   └── public/
└── README.md
```

**结构决策**: 前后端分离结构，关注点清晰分离。后端提供REST API，前端是消费API的SPA。

## 复杂度跟踪

无需说明的章程违规。

## 技术栈摘要

### 前端
- **框架**: Vue 3 配合 Composition API
- **构建工具**: Vite 5.x
- **状态管理**: Pinia
- **HTTP客户端**: Axios 配合拦截器
- **UI组件**: Element Plus / Naive UI (可爱主题)
- **图表**: ECharts
- **日期处理**: Day.js
- **测试**: Vitest

### 后端
- **框架**: NestJS 10.x
- **语言**: TypeScript 5.x
- **数据库**: SQLite 3 配合 TypeORM
- **认证**: JWT (访问令牌 + 刷新令牌)
- **密码哈希**: bcrypt
- **AI集成**: OpenAI API (Whisper + GPT-4)
- **验证**: class-validator
- **测试**: Jest

### 安全措施
- JWT认证配合短期访问令牌
- bcrypt密码哈希 (成本因子12)
- CORS白名单
- 速率限制 (一般100请求/分钟, 认证10请求/分钟)
- 输入验证和清理
- 通过TypeORM防止SQL注入
- 生产环境HTTPS

### 性能优化
- 懒加载路由
- API响应缓存 (统计)
- 数据库索引
- Gzip/Brotli压缩
- 长列表虚拟滚动
- 防抖语音录制

## 生成的工件

### 第0阶段: 研究
- [research.md](./research.md) - 技术栈决策和原理说明

### 第1阶段: 设计
- [data-model.md](./data-model.md) - 数据库模式和TypeScript接口
- [contracts/api.md](./contracts/api.md) - REST API规格
- [quickstart.md](./quickstart.md) - 开发设置指南

## 下一步

1. 运行 `/speckit.tasks` 生成任务分解
2. 实现后端API (NestJS)
3. 实现前端UI (Vue 3)
4. 集成AI语音识别
5. 测试和优化
6. 部署

## 注意事项

- 应监控AI API成本 (考虑缓存常见模式)
- SQLite适合MVP，如扩展需规划迁移到PostgreSQL的路径
- 语音录制在生产环境需要HTTPS (getUserMedia约束)
- 考虑PWA功能以获得更好的移动体验 (离线支持)