# Tasks: 宝宝成长记录语音版

**Input**: Design documents from `/specs/001-baby-tracker-voice/`

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend project structure with NestJS CLI in `backend/`
- [ ] T002 Create frontend project structure with Vite in `frontend/`
- [ ] T003 [P] Initialize backend dependencies (NestJS, TypeORM, SQLite, bcrypt, JWT) in `backend/package.json`
- [ ] T004 [P] Initialize frontend dependencies (Vue 3, Pinia, Axios, ECharts, Day.js) in `frontend/package.json`
- [ ] T005 [P] Configure ESLint and Prettier for backend in `backend/.eslintrc.js` and `backend/.prettierrc`
- [ ] T006 [P] Configure ESLint and Prettier for frontend in `frontend/.eslintrc.cjs` and `frontend/.prettierrc`
- [ ] T007 Create backend environment configuration template in `backend/.env.example`
- [ ] T008 Create frontend environment configuration template in `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & ORM Setup

- [ ] T009 Configure TypeORM with SQLite in `backend/src/data-source.ts`
- [ ] T010 Create User entity in `backend/src/users/entities/user.entity.ts`
- [ ] T011 Create BabyRecord entity in `backend/src/records/entities/baby-record.entity.ts`
- [ ] T012 Create database migration for User and BabyRecord tables in `backend/src/migrations/`
- [ ] T013 Configure TypeORM migrations in `backend/ormconfig.json`

### Authentication Framework

- [ ] T014 [P] Implement JWT strategy in `backend/src/auth/strategies/jwt.strategy.ts`
- [ ] T015 [P] Implement JWT refresh token strategy in `backend/src/auth/strategies/jwt-refresh.strategy.ts`
- [ ] T016 Create AuthModule with guards in `backend/src/auth/auth.module.ts`
- [ ] T017 Create JWT authentication guard in `backend/src/auth/guards/jwt-auth.guard.ts`
- [ ] T018 Implement password hashing utility in `backend/src/common/utils/password.util.ts`

### API Infrastructure

- [ ] T019 [P] Setup global exception filter in `backend/src/common/filters/http-exception.filter.ts`
- [ ] T020 [P] Setup request validation pipe in `backend/src/common/pipes/validation.pipe.ts`
- [ ] T021 [P] Setup response interceptor in `backend/src/common/interceptors/transform.interceptor.ts`
- [ ] T022 Configure CORS in `backend/src/main.ts`
- [ ] T023 Setup rate limiting middleware in `backend/src/common/middleware/rate-limit.middleware.ts`

### Frontend Infrastructure

- [ ] T024 [P] Setup Axios HTTP client with interceptors in `frontend/src/api/client.ts`
- [ ] T025 [P] Create Pinia store structure in `frontend/src/stores/`
- [ ] T026 Setup Vue Router with route guards in `frontend/src/router/index.ts`
- [ ] T027 Create authentication store in `frontend/src/stores/auth.ts`
- [ ] T028 Create API error handling utility in `frontend/src/utils/error-handler.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 4 - 用户注册与登录 (Priority: P1) 🎯 MVP

**Goal**: 宝妈可以通过注册创建账户，并使用账户登录系统，个人数据与账户绑定

**Independent Test**: 可以独立测试注册登录流程，验证账户创建、密码加密、登录认证功能

### Backend Implementation

- [ ] T029 [P] Create RegisterUserDto in `backend/src/auth/dto/register-user.dto.ts`
- [ ] T030 [P] Create LoginUserDto in `backend/src/auth/dto/login-user.dto.ts`
- [ ] T031 Create AuthService with register method in `backend/src/auth/auth.service.ts`
- [ ] T032 Create AuthService with login method in `backend/src/auth/auth.service.ts`
- [ ] T033 Create AuthService with refresh token method in `backend/src/auth/auth.service.ts`
- [ ] T034 Create AuthController with register endpoint in `backend/src/auth/auth.controller.ts`
- [ ] T035 Create AuthController with login endpoint in `backend/src/auth/auth.controller.ts`
- [ ] T036 Create AuthController with refresh endpoint in `backend/src/auth/auth.controller.ts`
- [ ] T037 Create AuthController with logout endpoint in `backend/src/auth/auth.controller.ts`

### Frontend Implementation

- [ ] T038 [P] Create LoginView component in `frontend/src/views/LoginView.vue`
- [ ] T039 [P] Create RegisterView component in `frontend/src/views/RegisterView.vue`
- [ ] T040 Create LoginForm component in `frontend/src/components/auth/LoginForm.vue`
- [ ] T041 Create RegisterForm component in `frontend/src/components/auth/RegisterForm.vue`
- [ ] T042 Implement login API integration in `frontend/src/api/auth.ts`
- [ ] T043 Implement registration API integration in `frontend/src/api/auth.ts`
- [ ] T044 Add route guards for authenticated routes in `frontend/src/router/index.ts`
- [ ] T045 Implement token refresh logic in `frontend/src/api/client.ts`

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 4: User Story 1 - 语音记录宝宝日常 (Priority: P1) 🎯 MVP

**Goal**: 宝妈通过长按语音按钮，用自然语言描述宝宝的日常活动，系统自动识别并生成结构化记录

**Independent Test**: 可以独立测试语音输入到记录生成的完整流程，验证AI识别准确性和记录正确性

### Backend Implementation

- [ ] T046 [P] Create CreateRecordDto in `backend/src/records/dto/create-record.dto.ts`
- [ ] T047 [P] Create RecordResponseDto in `backend/src/records/dto/record-response.dto.ts`
- [ ] T048 Create RecordsService with create method in `backend/src/records/records.service.ts`
- [ ] T049 Create RecordsService with findAll method in `backend/src/records/records.service.ts`
- [ ] T050 Create RecordsController with POST /records endpoint in `backend/src/records/records.controller.ts`
- [ ] T051 Create RecordsController with GET /records endpoint in `backend/src/records/records.controller.ts`
- [ ] T052 Create AIModule for speech processing in `backend/src/ai/ai.module.ts`
- [ ] T053 Create AIService with speech-to-text method in `backend/src/ai/ai.service.ts`
- [ ] T054 Create AIService with parse-record method in `backend/src/ai/ai.service.ts`
- [ ] T055 Create AIController with speech-to-text endpoint in `backend/src/ai/ai.controller.ts`
- [ ] T056 Create AIController with parse-record endpoint in `backend/src/ai/ai.controller.ts`
- [ ] T057 Implement time parsing utility in `backend/src/common/utils/time-parser.util.ts`
- [ ] T058 Create clarification dialog DTO in `backend/src/ai/dto/clarification.dto.ts`

### Frontend Implementation

- [ ] T059 [P] Create HomeView component in `frontend/src/views/HomeView.vue`
- [ ] T060 [P] Create VoiceButton component in `frontend/src/components/voice/VoiceButton.vue`
- [ ] T061 Create RecordCard component in `frontend/src/components/records/RecordCard.vue`
- [ ] T062 Create RecordList component in `frontend/src/components/records/RecordList.vue`
- [ ] T063 Create ClarificationDialog component in `frontend/src/components/voice/ClarificationDialog.vue`
- [ ] T064 Create voice recording composable in `frontend/src/composables/useVoiceRecorder.ts`
- [ ] T065 Create records API client in `frontend/src/api/records.ts`
- [ ] T066 Create AI API client in `frontend/src/api/ai.ts`
- [ ] T067 Create records store in `frontend/src/stores/records.ts`
- [ ] T068 Implement voice recording UI with long-press in `frontend/src/components/voice/VoiceButton.vue`
- [ ] T069 Implement record display with emoji icons in `frontend/src/components/records/RecordCard.vue`
- [ ] T070 Implement clarification dialog flow in `frontend/src/components/voice/ClarificationDialog.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 5: User Story 2 - 记录查看与筛选 (Priority: P1) 🎯 MVP

**Goal**: 宝妈可以查看所有历史记录，按时间排序，并支持按事项类型筛选和按时间范围筛选

**Independent Test**: 可以独立测试记录的展示、排序、筛选功能，验证数据组织和展示逻辑

### Backend Implementation

- [ ] T071 [P] Create RecordFilterDto in `backend/src/records/dto/record-filter.dto.ts`
- [ ] T072 Update RecordsService with filter and pagination in `backend/src/records/records.service.ts`
- [ ] T073 Update RecordsController with query parameters in `backend/src/records/records.controller.ts`
- [ ] T074 Create pagination utility in `backend/src/common/utils/pagination.util.ts`

### Frontend Implementation

- [ ] T075 [P] Create FilterBar component in `frontend/src/components/records/FilterBar.vue`
- [ ] T076 [P] Create TypeFilter component in `frontend/src/components/records/TypeFilter.vue`
- [ ] T077 [P] Create DateRangeFilter component in `frontend/src/components/records/DateRangeFilter.vue`
- [ ] T078 Update RecordList with filtering logic in `frontend/src/components/records/RecordList.vue`
- [ ] T079 Implement infinite scroll for record list in `frontend/src/components/records/RecordList.vue`
- [ ] T080 Update records store with filter state in `frontend/src/stores/records.ts`

**Checkpoint**: At this point, User Stories 1, 2, and 4 should all work independently

---

## Phase 6: User Story 3 - 数据统计图表 (Priority: P2)

**Goal**: 宝妈可以通过左上角的按钮进入统计页面，查看近一个月的宝宝数据可视化图表

**Independent Test**: 可以独立测试图表展示功能，验证数据聚合和可视化正确性

### Backend Implementation

- [ ] T081 [P] Create StatsModule in `backend/src/stats/stats.module.ts`
- [ ] T082 [P] Create StatsService with aggregation methods in `backend/src/stats/stats.service.ts`
- [ ] T083 Create StatsController with summary endpoint in `backend/src/stats/stats.controller.ts`
- [ ] T084 Create StatsController with feeding stats endpoint in `backend/src/stats/stats.controller.ts`
- [ ] T085 Create StatsController with diaper stats endpoint in `backend/src/stats/stats.controller.ts`
- [ ] T086 Create StatsController with poop stats endpoint in `backend/src/stats/stats.controller.ts`
- [ ] T087 Create StatsController with sleep stats endpoint in `backend/src/stats/stats.controller.ts`
- [ ] T088 Create StatsController with food stats endpoint in `backend/src/stats/stats.controller.ts`
- [ ] T089 Implement response caching for stats in `backend/src/stats/stats.service.ts`

### Frontend Implementation

- [ ] T090 [P] Create StatsView component in `frontend/src/views/StatsView.vue`
- [ ] T091 [P] Create LineChart component in `frontend/src/components/charts/LineChart.vue`
- [ ] T092 [P] Create PieChart component in `frontend/src/components/charts/PieChart.vue`
- [ ] T093 Create StatsCard component in `frontend/src/components/stats/StatsCard.vue`
- [ ] T094 Create stats API client in `frontend/src/api/stats.ts`
- [ ] T095 Create stats store in `frontend/src/stores/stats.ts`
- [ ] T096 Implement feeding trend chart in `frontend/src/components/stats/FeedingChart.vue`
- [ ] T097 Implement diaper count chart in `frontend/src/components/stats/DiaperChart.vue`
- [ ] T098 Implement poop count chart in `frontend/src/components/stats/PoopChart.vue`
- [ ] T099 Implement sleep duration chart in `frontend/src/components/stats/SleepChart.vue`
- [ ] T100 Implement food distribution chart in `frontend/src/components/stats/FoodChart.vue`
- [ ] T101 Add stats page navigation button in `frontend/src/components/layout/Header.vue`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### UI/UX Polish

- [ ] T102 [P] Create cute/healing theme CSS variables in `frontend/src/styles/theme.css`
- [ ] T103 [P] Implement responsive mobile layout in `frontend/src/App.vue`
- [ ] T104 Create loading spinner component in `frontend/src/components/common/LoadingSpinner.vue`
- [ ] T105 Create error toast component in `frontend/src/components/common/ErrorToast.vue`
- [ ] T106 Implement smooth animations for voice recording in `frontend/src/components/voice/VoiceButton.vue`
- [ ] T107 Add emoji icons for all record types in `frontend/src/utils/emoji-map.ts`

### Performance Optimization

- [ ] T108 [P] Configure lazy loading for routes in `frontend/src/router/index.ts`
- [ ] T109 [P] Optimize bundle size with tree shaking in `frontend/vite.config.ts`
- [ ] T110 Add virtual scrolling for long record lists in `frontend/src/components/records/RecordList.vue`
- [ ] T111 Implement request debouncing for voice input in `frontend/src/composables/useVoiceRecorder.ts`
- [ ] T112 Add database query optimization in `backend/src/records/records.service.ts`

### Security Hardening

- [ ] T113 [P] Add input sanitization middleware in `backend/src/common/middleware/sanitize.middleware.ts`
- [ ] T114 [P] Configure security headers in `backend/src/main.ts`
- [ ] T115 Implement request size limits in `backend/src/main.ts`
- [ ] T116 Add audit logging for sensitive operations in `backend/src/common/interceptors/audit.interceptor.ts`

### Documentation & Testing

- [ ] T117 [P] Create API documentation with Swagger in `backend/src/main.ts`
- [ ] T118 [P] Add unit tests for AuthService in `backend/src/auth/auth.service.spec.ts`
- [ ] T119 Add unit tests for RecordsService in `backend/src/records/records.service.spec.ts`
- [ ] T120 Add e2e tests for auth flow in `backend/test/auth.e2e-spec.ts`
- [ ] T121 Add e2e tests for records flow in `backend/test/records.e2e-spec.ts`
- [ ] T122 Update README with setup instructions in `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 4 (P1) → User Story 1 (P1) → User Story 2 (P1) → User Story 3 (P2)
  - Or in parallel if team capacity allows
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 4 (P1)**: Authentication foundation - must complete first
- **User Story 1 (P1)**: Core voice recording - depends on US4
- **User Story 2 (P1)**: Record viewing - depends on US1
- **User Story 3 (P2)**: Statistics - depends on US1 and US2

### Within Each User Story

- DTOs before services
- Services before controllers
- Backend API before frontend integration
- Components before views
- Core implementation before polish

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- DTOs and models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all DTOs for User Story 1 together:
Task: "Create CreateRecordDto in backend/src/records/dto/create-record.dto.ts"
Task: "Create RecordResponseDto in backend/src/records/dto/record-response.dto.ts"

# Launch all backend service methods together:
Task: "Create RecordsService with create method in backend/src/records/records.service.ts"
Task: "Create RecordsService with findAll method in backend/src/records/records.service.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 4 + 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 4 (Authentication)
4. Complete Phase 4: User Story 1 (Voice Recording)
5. Complete Phase 5: User Story 2 (Record Viewing)
6. **STOP and VALIDATE**: Test core MVP features
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 4 → Test independently → Deploy/Demo (Auth ready!)
3. Add User Story 1 → Test independently → Deploy/Demo (Voice recording ready!)
4. Add User Story 2 → Test independently → Deploy/Demo (Full MVP ready!)
5. Add User Story 3 → Test independently → Deploy/Demo (Statistics ready!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 4 (Backend auth)
   - Developer B: User Story 4 (Frontend auth)
   - Developer C: User Story 1 (Backend voice)
   - Developer D: User Story 1 (Frontend voice)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

**Total Tasks**: 122

**Task Distribution**:
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 20 tasks
- Phase 3 (US4 - Auth): 17 tasks
- Phase 4 (US1 - Voice Recording): 26 tasks
- Phase 5 (US2 - Record Viewing): 11 tasks
- Phase 6 (US3 - Statistics): 21 tasks
- Phase 7 (Polish): 19 tasks
