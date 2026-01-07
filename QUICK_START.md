# 📖 快速开始指南

## 🎯 重构内容一览

学生端"我的进度"页面已完全重构，现在支持独立检查6个阶段的进度状态。

## 🔑 核心改进

### 前后对比

| 方面           | 重构前               | 重构后           |
| -------------- | -------------------- | ---------------- |
| **数据源**     | 多个API聚合+本地推断 | 单一统一API      |
| **状态逻辑**   | 复杂的本地推断       | 后端明确返回     |
| **前置依赖**   | 有考虑               | 无依赖，独立检查 |
| **教师反馈**   | 不展示               | 完整展示         |
| **代码复杂度** | 高                   | 低               |
| **可维护性**   | 困难                 | 容易             |

## 📊 检查的6个阶段

```
1️⃣ 选题 ─→ 检查学生是否选题
        ├─ 状态: completed / pending

2️⃣ 开题报告 ─→ 检查提交和审核状态  
          ├─ 状态: completed / in-progress / failed / pending

3️⃣ 中期检查 ─→ 检查提交和审核状态
          ├─ 状态: completed / in-progress / failed / pending

4️⃣ 论文初稿 ─→ 检查提交和审核状态
          ├─ 状态: completed / in-progress / failed / pending

5️⃣ 论文修改 ─→ 检查提交和审核状态
          ├─ 状态: completed / in-progress / failed / pending

6️⃣ 论文终稿 ─→ 检查提交和审核状态
          ├─ 状态: completed / in-progress / failed / pending
```

## 🚀 快速测试

### 1. 启动后端
```bash
cd backend
python manage.py runserver
```

### 2. 测试API
```bash
# 获取学生进度
curl -H "Authorization: Token YOUR_TOKEN" \
     http://localhost:8000/api/auth/progress/
```

### 3. 查看前端
```bash
cd frontend
npm run dev
# 访问学生页面的"我的进度"模块
```

## 📝 API调用示例

### JavaScript/TypeScript
```typescript
// 获取进度数据
const progressData = await apiFetch('/api/auth/progress/');

// 检查是否所有阶段完成
const allCompleted = Object.values(progressData).every(
  stage => stage.status === 'completed'
);

// 找出需要修改的阶段
const needsRevision = Object.entries(progressData).filter(
  ([, data]) => data.status === 'in-progress' && data.message?.includes('修改')
);
```

### cURL
```bash
# 基础请求
curl http://localhost:8000/api/auth/progress/ \
  -H "Authorization: Token abc123def456"

# 格式化输出
curl http://localhost:8000/api/auth/progress/ \
  -H "Authorization: Token abc123def456" | python -m json.tool
```

## 📋 数据字段说明

### 所有阶段通用字段

| 字段           | 类型    | 说明                                         |
| -------------- | ------- | -------------------------------------------- |
| `status`       | string  | `completed`/`in-progress`/`pending`/`failed` |
| `message`      | string? | 状态说明（选填）                             |
| `score`        | number? | 审核成绩（选填）                             |
| `reviewed_at`  | string? | 审核时间（选填）                             |
| `submitted_at` | string? | 提交时间（选填）                             |
| `comments`     | string? | 教师反馈（选填）                             |

### 选题独有字段

| 字段           | 类型   | 说明           |
| -------------- | ------ | -------------- |
| `topic_title`  | string | 选择的课题名称 |
| `teacher_name` | string | 指导教师姓名   |
| `selected_at`  | string | 选题时间       |

## 🔍 状态详解

### ✅ completed（已完成）
- **含义**: 阶段已通过审核
- **标志**: 前面显示✓，旁边显示"已完成"
- **包含信息**: score, reviewed_at, comments

### 🔄 in-progress（进行中）
- **含义**: 阶段进行中，可能需要修改或等待审核
- **子状态1**: 需要修改 → 显示教师评语
- **子状态2**: 等待审核 → 显示提交时间
- **标志**: 前面显示⏱，旁边显示"进行中"

### ⏳ pending（待开始）
- **含义**: 尚未开始该阶段
- **标志**: 前面显示○，旁边显示"待开始"
- **包含信息**: message（说明为什么未开始）

### ❌ failed（未通过）
- **含义**: 审核不通过
- **标志**: 前面显示✖，旁边显示"不通过"
- **包含信息**: score, reviewed_at, comments

## 🎨 前端UI说明

### 进度条
- 显示已完成阶段数 vs 总阶段数
- 百分比计算: (已完成 / 6) × 100%

### 统计框
- 已完成: 状态为`completed`的阶段数
- 进行中: 状态为`in-progress`的阶段数
- 待开始: 状态为`pending`的阶段数

### 阶段详情卡片
- 前面图标: 表示该阶段的状态
- 阶段名称: 如"论文初稿（一审）"
- 时间戳: 审核/提交时间
- 成绩: 如有审核成绩则显示
- 状态徽章: 配合相应颜色显示
- 描述文本: 根据阶段类型显示不同内容

### 提醒面板
- 只在有"需要修改"或"未通过"的阶段时显示
- 黄色提醒: 需要修改
- 红色警告: 未通过

## 🛠 故障排除

### 问题: 显示"加载中..."不停止

**原因**: API调用失败或卡死

**解决**:
1. 检查浏览器控制台是否有错误
2. 检查后端服务是否运行
3. 检查认证令牌是否有效

### 问题: 显示"暂无数据"

**原因**: API返回空对象或null

**解决**:
1. 检查用户是否已认证
2. 检查用户role是否为'student'
3. 检查后端是否正确配置

### 问题: 显示错误信息

**常见错误**:
- "身份认证信息未提供" → 检查Token
- "只有学生可以查看进度" → 检查用户角色

## 📚 相关文档

- 📖 [详细设计说明](PROGRESS_REFACTOR_SUMMARY.md)
- 🔌 [API使用指南](STUDENT_PROGRESS_API.md)
- ✅ [完成总结](REFACTOR_COMPLETION.md)
- 📝 [变更日志](CHANGELOG.md)

## 💬 常见问题

**Q: 为什么阶段之间没有前置依赖？**
A: 这是为了让学生能看到所有阶段的真实状态，便于理解整个流程。

**Q: 可以跳过某个阶段吗？**
A: API不强制要求前置阶段完成，但实际业务流程中应该按顺序进行。

**Q: 教师评语从哪里来？**
A: 来自审核记录中的 `feedback` 字段。

**Q: 为什么有些分数是null？**
A: 表示该阶段尚未被审核。

**Q: 时间显示的是什么时区？**
A: API返回的是ISO 8601格式，前端会转换为本地时区。

## 🎓 学习资源

### 代码阅读建议

1. 先读 `backend/users/views.py` 中的 `StudentProgressAPIView`
2. 再读 `frontend/src/components/student/MyProgress.tsx`
3. 对比理解前后端的交互

### 相关概念

- RESTful API 设计
- Django Views 和 Serializers
- React Hooks (useState, useEffect)
- TypeScript 接口定义
- API 数据聚合

---

**最后更新**: 2026年1月7日
**状态**: ✅ 已就绪
