# 任务: 宝宝成长记录语音版

**输入**: 来自 `/specs/001-baby-tracker-voice/` 的设计文档

**前置条件**: plan.md, spec.md, data-model.md, contracts/api.md

**组织方式**: 任务按用户故事分组，以便每个故事可以独立实现和测试。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可以并行执行（不同文件，无依赖）
- **[Story]**: 此任务所属的用户故事（例如：US1, US2, US3, US4）
- 描述中包含确切的文件路径

---

## 第1阶段: 设置（共享基础设施）

**目的**: 项目初始化和基础结构

- [ ] T001 使用 NestJS CLI 在 `backend/` 中创建后端项目结构
- [ ] T002 使用 Vite 在 `frontend/` 中创建前端项目结构
- [ ] T003 [P] 在 `backend/package.json` 中初始化后端依赖（NestJS, TypeORM, SQLite, bcrypt, JWT）
- [ ] T004 [P] 在 `frontend/package.json` 中初始化前端依赖（Vue 3, Pinia, Axios, ECharts, Day.js）
- [ ] T005 [P] 在 `backend/.eslintrc.js` 和 `backend/.prettierrc` 中配置 ESLint 和 Prettier
- [ ] T006 [P] 在 `frontend/.eslintrc.cjs` 和 `frontend/.prettierrc` 中配置 ESLint 和 Prettier
- [ ] T007 在 `backend/.env.example` 中创建后端环境配置模板
- [ ] T008 在 `frontend/.env.example` 中创建前端环境配置模板

---

## 第2阶段: 基础（阻塞性前置条件）

**目的**: 在任何用户故事实现之前**必须**完成的核心基础设施

**⚠️ 关键**: 在此阶段完成之前，不能开始任何用户故事工作

### 数据库和 ORM 设置

- [ ] T009 在 `backend/src/data-source.ts` 中配置 TypeORM 与 SQLite
- [ ] T010 在 `backend/src/users/entities/user.entity.ts` 中创建 User 实体
- [ ] T011 在 `backend/src/records/entities/baby-record.entity.ts` 中创建 BabyRecord 实体
- [ ] T012 在 `backend/src/migrations/` 中创建 User 和 BabyRecord 表的数据库迁移
- [ ] T013 在 `backend/ormconfig.json` 中配置 TypeORM 迁移

### 认证框架

- [ ] T014 [P] 在 `backend/src/auth/strategies/jwt.strategy.ts` 中实现 JWT 策略
- [ ] T015 [P] 在 `backend/src/auth/strategies/jwt-refresh.strategy.ts` 中实现 JWT 刷新令牌策略
- [ ] T016 在 `backend/src/auth/auth.module.ts` 中创建带守卫的 AuthModule
- [ ] T017 在 `backend/src/auth/guards/jwt-auth.guard.ts` 中创建 JWT 认证守卫
- [ ] T018 在 `backend/src/common/utils/password.util.ts` 中实现密码哈希工具

### API 基础设施

- [ ] T019 [P] 在 `backend/src/common/filters/http-exception.filter.ts` 中设置全局异常过滤器
- [ ] T020 [P] 在 `backend/src/common/pipes/validation.pipe.ts` 中设置请求验证管道
- [ ] T021 [P] 在 `backend/src/common/interceptors/transform.interceptor.ts` 中设置响应拦截器
- [ ] T022 在 `backend/src/main.ts` 中配置 CORS
- [ ] T023 在 `backend/src/common/middleware/rate-limit.middleware.ts` 中设置速率限制中间件

### 前端基础设施

- [ ] T024 [P] 在 `frontend/src/api/client.ts` 中设置带拦截器的 Axios HTTP 客户端
- [ ] T025 [P] 在 `frontend/src/stores/` 中创建 Pinia 存储结构
- [ ] T026 在 `frontend/src/router/index.ts` 中设置带路由守卫的 Vue Router
- [ ] T027 在 `frontend/src/stores/auth.ts` 中创建认证存储
- [ ] T028 在 `frontend/src/utils/error-handler.ts` 中创建 API 错误处理工具

**检查点**: 基础就绪 - 用户故事实现现在可以并行开始

---

## 第3阶段: 用户故事 4 - 用户注册与登录 (优先级: P1) 🎯 MVP

**目标**: 宝妈可以通过注册创建账户，并使用账户登录系统，个人数据与账户绑定

**独立测试**: 可以独立测试注册登录流程，验证账户创建、密码加密、登录认证功能

### 后端实现

- [ ] T029 [P] 在 `backend/src/auth/dto/register-user.dto.ts` 中创建 RegisterUserDto
- [ ] T030 [P] 在 `backend/src/auth/dto/login-user.dto.ts` 中创建 LoginUserDto
- [ ] T031 在 `backend/src/auth/auth.service.ts` 中创建带注册方法的 AuthService
- [ ] T032 在 `backend/src/auth/auth.service.ts` 中创建带登录方法的 AuthService
- [ ] T033 在 `backend/src/auth/auth.service.ts` 中创建带刷新令牌方法的 AuthService
- [ ] T034 在 `backend/src/auth/auth.controller.ts` 中创建带注册端点的 AuthController
- [ ] T035 在 `backend/src/auth/auth.controller.ts` 中创建带登录端点的 AuthController
- [ ] T036 在 `backend/src/auth/auth.controller.ts` 中创建带刷新端点的 AuthController
- [ ] T037 在 `backend/src/auth/auth.controller.ts` 中创建带登出端点的 AuthController

### 前端实现

- [ ] T038 [P] 在 `frontend/src/views/LoginView.vue` 中创建 LoginView 组件
- [ ] T039 [P] 在 `frontend/src/views/RegisterView.vue` 中创建 RegisterView 组件
- [ ] T040 在 `frontend/src/components/auth/LoginForm.vue` 中创建 LoginForm 组件
- [ ] T041 在 `frontend/src/components/auth/RegisterForm.vue` 中创建 RegisterForm 组件
- [ ] T042 在 `frontend/src/api/auth.ts` 中实现登录 API 集成
- [ ] T043 在 `frontend/src/api/auth.ts` 中实现注册 API 集成
- [ ] T044 在 `frontend/src/router/index.ts` 中为认证路由添加路由守卫
- [ ] T045 在 `frontend/src/api/client.ts` 中实现令牌刷新逻辑

**检查点**: 此时，用户故事 4 应该完全可用并可独立测试

---

## 第4阶段: 用户故事 1 - 语音记录宝宝日常 (优先级: P1) 🎯 MVP

**目标**: 宝妈通过长按语音按钮，用自然语言描述宝宝的日常活动，系统自动识别并生成结构化记录

**独立测试**: 可以独立测试语音输入到记录生成的完整流程，验证AI识别准确性和记录正确性

### 后端实现

- [ ] T046 [P] 在 `backend/src/records/dto/create-record.dto.ts` 中创建 CreateRecordDto
- [ ] T047 [P] 在 `backend/src/records/dto/record-response.dto.ts` 中创建 RecordResponseDto
- [ ] T048 在 `backend/src/records/records.service.ts` 中创建带创建方法的 RecordsService
- [ ] T049 在 `backend/src/records/records.service.ts` 中创建带查找全部方法的 RecordsService
- [ ] T050 在 `backend/src/records/records.controller.ts` 中创建带 POST /records 端点的 RecordsController
- [ ] T051 在 `backend/src/records/records.controller.ts` 中创建带 GET /records 端点的 RecordsController
- [ ] T052 在 `backend/src/ai/ai.module.ts` 中创建用于语音处理的 AIModule
- [ ] T053 在 `backend/src/ai/ai.service.ts` 中创建带语音转文本方法的 AIService
- [ ] T054 在 `backend/src/ai/ai.service.ts` 中创建带解析记录方法的 AIService
- [ ] T055 在 `backend/src/ai/ai.controller.ts` 中创建带语音转文本端点的 AIController
- [ ] T056 在 `backend/src/ai/ai.controller.ts` 中创建带解析记录端点的 AIController
- [ ] T057 在 `backend/src/common/utils/time-parser.util.ts` 中实现时间解析工具
- [ ] T058 在 `backend/src/ai/dto/clarification.dto.ts` 中创建澄清对话 DTO

### 前端实现

- [ ] T059 [P] 在 `frontend/src/views/HomeView.vue` 中创建 HomeView 组件
- [ ] T060 [P] 在 `frontend/src/components/voice/VoiceButton.vue` 中创建 VoiceButton 组件
- [ ] T061 在 `frontend/src/components/records/RecordCard.vue` 中创建 RecordCard 组件
- [ ] T062 在 `frontend/src/components/records/RecordList.vue` 中创建 RecordList 组件
- [ ] T063 在 `frontend/src/components/voice/ClarificationDialog.vue` 中创建 ClarificationDialog 组件
- [ ] T064 在 `frontend/src/composables/useVoiceRecorder.ts` 中创建语音录制组合式函数
- [ ] T065 在 `frontend/src/api/records.ts` 中创建记录 API 客户端
- [ ] T066 在 `frontend/src/api/ai.ts` 中创建 AI API 客户端
- [ ] T067 在 `frontend/src/stores/records.ts` 中创建记录存储
- [ ] T068 在 `frontend/src/components/voice/VoiceButton.vue` 中实现带长按的语音录制 UI
- [ ] T069 在 `frontend/src/components/records/RecordCard.vue` 中实现带表情图标的记录展示
- [ ] T070 在 `frontend/src/components/voice/ClarificationDialog.vue` 中实现澄清对话流程

**检查点**: 此时，用户故事 1 应该完全可用并可独立测试

---

## 第5阶段: 用户故事 2 - 记录查看与筛选 (优先级: P1) 🎯 MVP

**目标**: 宝妈可以查看所有历史记录，按时间排序，并支持按事项类型筛选和按时间范围筛选

**独立测试**: 可以独立测试记录的展示、排序、筛选功能，验证数据组织和展示逻辑

### 后端实现

- [ ] T071 [P] 在 `backend/src/records/dto/record-filter.dto.ts` 中创建 RecordFilterDto
- [ ] T072 在 `backend/src/records/records.service.ts` 中更新带筛选和分页的 RecordsService
- [ ] T073 在 `backend/src/records/records.controller.ts` 中更新带查询参数的 RecordsController
- [ ] T074 在 `backend/src/common/utils/pagination.util.ts` 中创建分页工具

### 前端实现

- [ ] T075 [P] 在 `frontend/src/components/records/FilterBar.vue` 中创建 FilterBar 组件
- [ ] T076 [P] 在 `frontend/src/components/records/TypeFilter.vue` 中创建 TypeFilter 组件
- [ ] T077 [P] 在 `frontend/src/components/records/DateRangeFilter.vue` 中创建 DateRangeFilter 组件
- [ ] T078 在 `frontend/src/components/records/RecordList.vue` 中更新带筛选逻辑的记录列表
- [ ] T079 在 `frontend/src/components/records/RecordList.vue` 中实现记录列表的无限滚动
- [ ] T080 在 `frontend/src/stores/records.ts` 中更新带筛选状态的记录存储

**检查点**: 此时，用户故事 1、2 和 4 都应该可以独立工作

---

## 第6阶段: 用户故事 3 - 数据统计图表 (优先级: P2)

**目标**: 宝妈可以通过左上角的按钮进入统计页面，查看近一个月的宝宝数据可视化图表

**独立测试**: 可以独立测试图表展示功能，验证数据聚合和可视化正确性

### 后端实现

- [ ] T081 [P] 在 `backend/src/stats/stats.module.ts` 中创建 StatsModule
- [ ] T082 [P] 在 `backend/src/stats/stats.service.ts` 中创建带聚合方法的 StatsService
- [ ] T083 在 `backend/src/stats/stats.controller.ts` 中创建带摘要端点的 StatsController
- [ ] T084 在 `backend/src/stats/stats.controller.ts` 中创建带喂奶统计端点的 StatsController
- [ ] T085 在 `backend/src/stats/stats.controller.ts` 中创建带尿布统计端点的 StatsController
- [ ] T086 在 `backend/src/stats/stats.controller.ts` 中创建带大便统计端点的 StatsController
- [ ] T087 在 `backend/src/stats/stats.controller.ts` 中创建带睡眠统计端点的 StatsController
- [ ] T088 在 `backend/src/stats/stats.controller.ts` 中创建带辅食统计端点的 StatsController
- [ ] T089 在 `backend/src/stats/stats.service.ts` 中实现统计数据的响应缓存

### 前端实现

- [ ] T090 [P] 在 `frontend/src/views/StatsView.vue` 中创建 StatsView 组件
- [ ] T091 [P] 在 `frontend/src/components/charts/LineChart.vue` 中创建 LineChart 组件
- [ ] T092 [P] 在 `frontend/src/components/charts/PieChart.vue` 中创建 PieChart 组件
- [ ] T093 在 `frontend/src/components/stats/StatsCard.vue` 中创建 StatsCard 组件
- [ ] T094 在 `frontend/src/api/stats.ts` 中创建统计 API 客户端
- [ ] T095 在 `frontend/src/stores/stats.ts` 中创建统计存储
- [ ] T096 在 `frontend/src/components/stats/FeedingChart.vue` 中实现喂奶趋势图表
- [ ] T097 在 `frontend/src/components/stats/DiaperChart.vue` 中实现尿布数量图表
- [ ] T098 在 `frontend/src/components/stats/PoopChart.vue` 中实现大便数量图表
- [ ] T099 在 `frontend/src/components/stats/SleepChart.vue` 中实现睡眠时长图表
- [ ] T100 在 `frontend/src/components/stats/FoodChart.vue` 中实现辅食分布图表
- [ ] T101 在 `frontend/src/components/layout/Header.vue` 中添加统计页面导航按钮

**检查点**: 所有用户故事现在都应该可以独立工作

---

## 第7阶段: 打磨和跨领域关注点

**目的**: 影响多个用户故事的改进

### UI/UX 打磨

- [ ] T102 [P] 在 `frontend/src/styles/theme.css` 中创建可爱/治愈系主题 CSS 变量
- [ ] T103 [P] 在 `frontend/src/App.vue` 中实现响应式移动端布局
- [ ] T104 在 `frontend/src/components/common/LoadingSpinner.vue` 中创建加载旋转器组件
- [ ] T105 在 `frontend/src/components/common/ErrorToast.vue` 中创建错误提示组件
- [ ] T106 在 `frontend/src/components/voice/VoiceButton.vue` 中实现语音录制的平滑动画
- [ ] T107 在 `frontend/src/utils/emoji-map.ts` 中添加所有记录类型的表情图标

### 性能优化

- [ ] T108 [P] 在 `frontend/src/router/index.ts` 中配置路由懒加载
- [ ] T109 [P] 在 `frontend/vite.config.ts` 中使用 tree shaking 优化包大小
- [ ] T110 在 `frontend/src/components/records/RecordList.vue` 中为长记录列表添加虚拟滚动
- [ ] T111 在 `frontend/src/composables/useVoiceRecorder.ts` 中实现语音输入的请求防抖
- [ ] T112 在 `backend/src/records/records.service.ts` 中添加数据库查询优化

### 安全加固

- [ ] T113 [P] 在 `backend/src/common/middleware/sanitize.middleware.ts` 中添加输入清理中间件
- [ ] T114 [P] 在 `backend/src/main.ts` 中配置安全头
- [ ] T115 在 `backend/src/main.ts` 中实现请求大小限制
- [ ] T116 在 `backend/src/common/interceptors/audit.interceptor.ts` 中添加敏感操作的审计日志

### 文档和测试

- [ ] T117 [P] 在 `backend/src/main.ts` 中使用 Swagger 创建 API 文档
- [ ] T118 [P] 在 `backend/src/auth/auth.service.spec.ts` 中为 AuthService 添加单元测试
- [ ] T119 在 `backend/src/records/records.service.spec.ts` 中为 RecordsService 添加单元测试
- [ ] T120 在 `backend/test/auth.e2e-spec.ts` 中为认证流程添加 e2e 测试
- [ ] T121 在 `backend/test/records.e2e-spec.ts` 中为记录流程添加 e2e 测试
- [ ] T122 在 `README.md` 中更新设置说明

---

## 依赖和执行顺序

### 阶段依赖

- **设置 (第1阶段)**: 无依赖 - 可以立即开始
- **基础 (第2阶段)**: 依赖设置完成 - 阻塞所有用户故事
- **用户故事 (第3-6阶段)**: 都依赖基础阶段完成
  - 用户故事 4 (P1) → 用户故事 1 (P1) → 用户故事 2 (P1) → 用户故事 3 (P2)
  - 或者如果团队容量允许可以并行
- **打磨 (最后阶段)**: 依赖所有期望的用户故事完成

### 用户故事依赖

- **用户故事 4 (P1)**: 认证基础 - 必须首先完成
- **用户故事 1 (P1)**: 核心语音录制 - 依赖 US4
- **用户故事 2 (P1)**: 记录查看 - 依赖 US1
- **用户故事 3 (P2)**: 统计 - 依赖 US1 和 US2

### 每个用户故事内部

- DTO 在 service 之前
- Service 在 controller 之前
- 后端 API 在前端集成之前
- 组件在 view 之前
- 核心实现在打磨之前

### 并行机会

- 所有标记 [P] 的设置任务可以并行执行
- 所有标记 [P] 的基础任务可以并行执行（在第2阶段内）
- 基础阶段完成后，如果团队容量允许，所有用户故事可以并行开始
- 故事中标记 [P] 的 DTO 和模型可以并行执行
- 不同的用户故事可以由不同的团队成员并行处理

---

## 并行示例: 用户故事 1

```bash
# 一起启动用户故事 1 的所有 DTO:
Task: "在 backend/src/records/dto/create-record.dto.ts 中创建 CreateRecordDto"
Task: "在 backend/src/records/dto/record-response.dto.ts 中创建 RecordResponseDto"

# 一起启动所有后端 service 方法:
Task: "在 backend/src/records/records.service.ts 中创建带创建方法的 RecordsService"
Task: "在 backend/src/records/records.service.ts 中创建带查找全部方法的 RecordsService"
```

---

## 实施策略

### MVP 优先 (用户故事 4 + 1 + 2)

1. 完成第1阶段: 设置
2. 完成第2阶段: 基础（关键 - 阻塞所有故事）
3. 完成第3阶段: 用户故事 4（认证）
4. 完成第4阶段: 用户故事 1（语音录制）
5. 完成第5阶段: 用户故事 2（记录查看）
6. **停止并验证**: 测试核心 MVP 功能
7. 如果就绪则部署/演示

### 增量交付

1. 完成设置 + 基础 → 基础就绪
2. 添加用户故事 4 → 独立测试 → 部署/演示（认证就绪！）
3. 添加用户故事 1 → 独立测试 → 部署/演示（语音录制就绪！）
4. 添加用户故事 2 → 独立测试 → 部署/演示（完整 MVP 就绪！）
5. 添加用户故事 3 → 独立测试 → 部署/演示（统计就绪！）
6. 每个故事都增加价值而不破坏之前的故事

### 并行团队策略

对于多个开发人员：

1. 团队一起完成设置 + 基础
2. 基础完成后：
   - 开发人员 A: 用户故事 4（后端认证）
   - 开发人员 B: 用户故事 4（前端认证）
   - 开发人员 C: 用户故事 1（后端语音）
   - 开发人员 D: 用户故事 1（前端语音）
3. 故事独立完成并集成

---

## 注意事项

- [P] 任务 = 不同文件，无依赖
- [Story] 标签将任务映射到特定用户故事以实现可追溯性
- 每个用户故事应该可以独立完成和测试
- 在实现之前验证测试失败
- 每个任务或逻辑组后提交
- 在任何检查点停止以独立验证故事
- 避免：模糊任务、同一文件冲突、破坏独立性的跨故事依赖

**总任务数**: 122

**任务分布**:
- 第1阶段 (设置): 8 个任务
- 第2阶段 (基础): 20 个任务
- 第3阶段 (US4 - 认证): 17 个任务
- 第4阶段 (US1 - 语音录制): 26 个任务
- 第5阶段 (US2 - 记录查看): 11 个任务
- 第6阶段 (US3 - 统计): 21 个任务
- 第7阶段 (打磨): 19 个任务