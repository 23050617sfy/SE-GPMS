# 教师权限管理 - 只能查看自己课程的学生提交

## 功能概述

实现了对教师权限的细粒度控制，使教师只能查看选了自己课程的学生的提交记录。

## 实现原理

### 数据关系
```
User (teacher) ─┐
                ├─→ Topic ─→ TopicSelection ←─ User (student)
                └─→ Proposal/MidtermCheck ←─ User (student)
```

### 查询逻辑

#### 原来的逻辑
```python
# 教师可以看到所有学生的提交
if self.request.user.profile.role in ['teacher', 'admin']:
    return Proposal.objects.all()
```

#### 新的逻辑
```python
if self.request.user.profile.role == 'admin':
    # 管理员仍可看所有
    return Proposal.objects.all()
elif self.request.user.profile.role == 'teacher':
    # 教师只能看选了自己课程的学生的提交
    # Step 1: 找出选了此教师课程的所有学生
    students_with_my_topics = User.objects.filter(
        selected_topics__topic__teacher=self.request.user
    ).distinct()
    # Step 2: 返回这些学生的提交
    return Proposal.objects.filter(student__in=students_with_my_topics)
return Proposal.objects.none()
```

### 修改的API端点

#### 1. 开题报告
- **端点**: `GET /api/auth/proposal/all-proposals/`
- **旧行为**: 教师看到所有学生的开题
- **新行为**: 教师只看选了自己课程的学生的开题

#### 2. 中期检查
- **端点**: `GET /api/auth/midterm/all-midterms/`
- **旧行为**: 教师看到所有学生的中期检查
- **新行为**: 教师只看选了自己课程的学生的中期检查

## 权限矩阵

| 用户角色 | 能看到的提交             | 说明                                 |
| -------- | ------------------------ | ------------------------------------ |
| 学生     | 仅自己的提交             | `my-proposals` 和 `my-midterms` 端点 |
| 教师     | 选了自己课程的学生的提交 | 通过 Topic + TopicSelection 关联     |
| 管理员   | 所有学生的提交           | 保持原来的权限                       |

## 技术细节

### 数据库查询
```python
# 使用 Django ORM 的反向关系查询
User.objects.filter(selected_topics__topic__teacher=self.request.user)

# 等价的 SQL
SELECT DISTINCT user.* FROM auth_user
JOIN users_topicselection ON auth_user.id = users_topicselection.student_id
JOIN users_topic ON users_topicselection.topic_id = users_topic.id
WHERE users_topic.teacher_id = {teacher_id}
```

### distinct() 的作用
- 如果学生选了同一教师的多个课程，会出现重复
- 使用 `distinct()` 去重，确保每个学生只出现一次

## 前端的适配

前端无需修改，API 返回的数据格式保持不变：
```json
{
  "id": 1,
  "student_name": "张三",
  "student_id": "2023001",
  "title": "开题报告",
  "reviews": [...],
  ...
}
```

## 测试场景

### 场景1：教师查看开题
1. 教师 A 有课程 Topic A
2. 学生 A 选了 Topic A
3. 学生 B 没选 Topic A
4. 学生 A 和 B 都提交了开题

**预期结果**：教师 A 只看到学生 A 的开题，看不到学生 B 的

### 场景2：教师有多个课程
1. 教师 A 有课程 Topic A 和 Topic B
2. 学生 A 选了 Topic A
3. 学生 B 选了 Topic B
4. 学生 C 都没选

**预期结果**：教师 A 看到学生 A 和 B 的提交，看不到学生 C 的

### 场景3：管理员权限不变
1. 管理员查看开题
2. 所有学生（无论是否选了哪个教师的课）的开题都可见

**预期结果**：管理员看到所有提交

## 使用 curl 验证

### 教师账户查询
```bash
TOKEN="teacher_token"
curl -H "Authorization: Token $TOKEN" \
  http://127.0.0.1:8000/api/auth/proposal/all-proposals/
```

**响应**：仅包含选了此教师课程的学生的提交

### 管理员账户查询
```bash
TOKEN="admin_token"
curl -H "Authorization: Token $TOKEN" \
  http://127.0.0.1:8000/api/auth/proposal/all-proposals/
```

**响应**：包含所有学生的提交

## 相关文件修改

- `backend/users/views.py`
  - `AllProposalsListAPIView.get_queryset()` - 添加权限过滤
  - `AllMidtermsListAPIView.get_queryset()` - 添加权限过滤

## 注意事项

### 1. 性能考虑
查询包含了 JOIN 操作，如果学生和课程数量很大，可能需要优化：
```python
# 可使用 prefetch_related 或 select_related 优化查询性能
students_with_my_topics = User.objects.filter(
    selected_topics__topic__teacher=self.request.user
).distinct().select_related('profile')
```

### 2. 异常处理
如果学生没选任何课程，会得到空列表，这是预期行为。

### 3. 审核权限
教师只能审核自己看得到的提交，因为：
- 教师 URL 中指定了 `proposal_id` 或 `midterm_id`
- 如果该提交不在教师的课程范围内，后端已有权限检查

## 升级建议

### 短期
- [ ] 添加数据库索引优化查询性能
- [ ] 添加缓存减少数据库查询

### 中期
- [ ] 支持按课程分组展示学生提交
- [ ] 显示学生选择的是教师的哪个课程

### 长期
- [ ] 支持课程分配给多个教师（共同指导）
- [ ] 支持教学助理(TA)权限管理
- [ ] 支持按提交时间、审核状态等筛选
