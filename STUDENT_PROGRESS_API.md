# 学生进度API使用指南

## API端点

### 获取学生进度信息

**请求**:
```
GET /api/auth/progress/
Authorization: Token <your_token>
```

**权限**: 
- 仅限学生用户
- 需要有效的认证令牌

**响应状态码**:
- `200 OK`: 成功返回进度信息
- `401 Unauthorized`: 未认证或令牌无效
- `403 Forbidden`: 非学生用户尝试访问

## 响应格式

### 成功响应 (200)

```json
{
  "topic_selection": {
    "status": "completed|pending",
    "topic_title": "string (如果已选题)",
    "teacher_name": "string (如果已选题)",
    "selected_at": "ISO 8601 datetime (如果已选题)"
  },
  "proposal": {
    "status": "completed|in-progress|failed|pending",
    "message": "string (如果未完成)",
    "score": "number (如果已评审) | null",
    "reviewed_at": "ISO 8601 datetime (如果已评审) | null",
    "comments": "string (教师反馈，如果有) | null",
    "submitted_at": "ISO 8601 datetime (如果已提交但未评审) | null"
  },
  "midterm": { /* 结构同上 */ },
  "first_review": { /* 结构同上 */ },
  "second_review": { /* 结构同上 */ },
  "final_submission": { /* 结构同上 */ }
}
```

## 状态值说明

| 状态          | 含义                             | 适用阶段         |
| ------------- | -------------------------------- | ---------------- |
| `completed`   | 已完成/已通过                    | 所有阶段         |
| `in-progress` | 进行中（可能需要修改或等待审核） | 选题外的所有阶段 |
| `failed`      | 未通过                           | 有审核流程的阶段 |
| `pending`     | 待开始/尚未提交                  | 所有阶段         |

## 示例

### 示例1：获取学生进度

```bash
curl -X GET http://localhost:8000/api/auth/progress/ \
  -H "Authorization: Token abc123def456"
```

响应:
```json
{
  "topic_selection": {
    "status": "completed",
    "topic_title": "基于深度学习的推荐系统",
    "teacher_name": "张三",
    "selected_at": "2026-01-05T10:30:00+00:00"
  },
  "proposal": {
    "status": "completed",
    "score": 85,
    "reviewed_at": "2026-01-06T14:25:00+00:00",
    "comments": "开题报告内容充实，研究方向明确。"
  },
  "midterm": {
    "status": "completed",
    "score": 88,
    "reviewed_at": "2026-01-07T09:15:00+00:00",
    "comments": "进度良好，按计划推进。"
  },
  "first_review": {
    "status": "in-progress",
    "message": "需要修改",
    "score": 78,
    "comments": "论文结构完整，但实验部分需要补充更多数据分析。",
    "reviewed_at": "2026-01-07T15:20:00+00:00"
  },
  "second_review": {
    "status": "pending",
    "message": "尚未提交论文修改稿"
  },
  "final_submission": {
    "status": "pending",
    "message": "尚未提交论文终稿"
  }
}
```

### 示例2：处理API响应（前端）

```typescript
const progressData = await apiFetch('/api/auth/progress/');

// 计算完成度
const completedCount = Object.values(progressData).filter(
  stage => stage.status === 'completed'
).length;
const totalCount = Object.keys(progressData).length;
const progress = (completedCount / totalCount) * 100;

// 检查是否有需要修改的阶段
const needsRevision = Object.entries(progressData).filter(
  ([, data]) => data.status === 'in-progress' && data.message?.includes('修改')
);

if (needsRevision.length > 0) {
  console.log('以下阶段需要修改:');
  needsRevision.forEach(([stage, data]) => {
    console.log(`${stage}: ${data.comments}`);
  });
}
```

## 数据库要求

确保以下数据库表存在且有相关记录：
- `auth_user` - 用户信息
- `users_topicselection` - 选题记录
- `users_proposal` - 开题报告
- `users_proposalreview` - 开题报告审核
- `users_midtermcheck` - 中期检查
- `users_midtermreview` - 中期检查审核
- `users_thesis` - 论文
- `users_thesisreview` - 论文审核

## 错误处理

### 未认证的请求

```bash
curl http://localhost:8000/api/auth/progress/
```

响应:
```json
{
  "detail": "身份认证信息未提供。"
}
```

### 非学生用户访问

教师或管理员试图访问此端点会收到:
```json
{
  "detail": "只有学生可以查看进度"
}
```

## 性能注意事项

- 该端点会查询多张表，对于数据量大的系统可考虑添加缓存
- 建议在前端进行合理的缓存，避免频繁刷新
- 如果响应时间过长，可检查是否需要添加数据库索引

## 故障排除

### API返回401
- 检查令牌是否有效
- 检查令牌是否已过期
- 确保请求头格式正确: `Authorization: Token <token>`

### API返回403
- 确认当前用户的角色是"student"
- 检查用户profile的role字段设置

### 返回空的pending状态
- 这是正常的，表示该阶段尚未开始
- 学生需要在相应时间提交相关内容

## 相关API端点

- `POST /api/auth/thesis/submit/` - 提交论文
- `POST /api/auth/proposal/submit/` - 提交开题报告
- `POST /api/auth/midterm/submit/` - 提交中期检查
- `POST /api/auth/topics/<id>/select/` - 选择课题
