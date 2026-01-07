# 开题和中期审核测试指南

本指南用于验证开题报告和中期检查的提交、审核和反馈功能。

## 前置条件

1. 后端服务运行：`python manage.py runserver`
2. 前端服务运行：`npm run dev`
3. 已创建至少以下用户：
   - 学生账户（role: student）
   - 教师账户（role: teacher）

## 测试步骤

### 1. 学生端提交开题报告

**操作步骤：**
1. 以学生身份登录前端
2. 进入 StudentDashboard → 开题报告 (ProposalSubmission)
3. 在"提交开题"标签中：
   - 选择一个 PDF 文件
   - 输入标题（可选，默认为"开题报告"）
   - 点击"上传"按钮
   - 点击"提交开题报告"按钮

**预期结果：**
- 显示"提交成功"的绿色消息
- 新提交的开题出现在"提交历史"中
- 文件显示为可下载

**调试信息：**
- 打开浏览器开发工具（F12）→ Network 标签
- 检查 POST /api/auth/proposal/submit/ 响应状态是否为 201
- 如果失败，查看响应体中的错误信息

### 2. 教师端审核开题报告

**操作步骤：**
1. 以教师身份登录前端
2. 进入 TeacherDashboard → 开题报告审核 (ProposalReview)
3. 在列表中找到学生的开题报告
4. 点击"审核评分"按钮
5. 在弹出对话框中：
   - 选择审核结果（通过/不通过）
   - 输入评分（0-100）
   - 填写反馈意见
   - 点击"提交审核"按钮

**预期结果：**
- 对话框关闭
- 列表页面自动刷新
- 浏览器控制台显示："Review submitted successfully: {...}"

**调试信息：**
- 打开浏览器开发工具（F12）→ Console 标签
- 查找 "Submitting review:" 和 "Review submitted successfully:" 日志
- 检查 POST /api/auth/proposal/{proposal_id}/review/ 的响应
- 检查响应状态是否为 201
- 如果有错误，查看 "Submit review error:" 日志

### 3. 学生端查看审核反馈

**操作步骤：**
1. 以学生身份登录前端
2. 进入 StudentDashboard → 开题报告
3. 切换到"提交历史"标签
4. 查看刚才提交的开题报告卡片

**预期结果：**
- 在卡片下方看到一个蓝色背景的反馈区块
- 显示审核结果（✓ 通过 / ✗ 不通过 / ◐ 需修改）
- 显示教师的反馈意见
- 显示评分（如：评分：85分）
- 显示审核者姓名和时间

**调试信息：**
- 打开浏览器开发工具（F12）→ Network 标签
- 检查 GET /api/auth/proposal/my-proposals/ 的响应
- 查看响应 JSON 中是否包含 `reviews` 数组
- 如果 reviews 为空数组，说明后端查询有问题

### 4. 中期检查流程

**操作步骤：**
同上，但操作以下路径：
- 学生提交：StudentDashboard → 中期检查 (MidtermCheck) → 提交中期
- 教师审核：TeacherDashboard → 中期检查审核 (MidtermReview)
- 学生查看：StudentDashboard → 中期检查 → 提交历史

## 常见问题排查

### 问题1：提交审核时出现"提交审核失败"

**可能原因和解决方案：**

1. **缺少必填字段**
   - 检查是否选择了审核结果（通过/不通过）
   - 检查评分是否为 0-100 之间的数字
   - 检查是否填写了反馈意见
   - 界面会显示具体的缺失字段提示

2. **没有教师权限**
   - 确保使用教师账户登录
   - 检查用户 profile.role 是否为 "teacher"
   - 浏览器开发工具 Console 中查看错误信息

3. **开题/中期报告不存在**
   - 确保学生已提交了开题/中期检查
   - 刷新页面重新加载列表

4. **网络/API 错误**
   - 检查后端服务是否运行
   - 查看浏览器控制台的错误日志
   - 检查 POST 请求的响应状态码

### 问题2：提交后反馈不显示

**可能原因和解决方案：**

1. **审核结果未保存到数据库**
   - 检查后端数据库中是否有 ProposalReview/MidtermReview 记录
   - 命令行运行：
     ```bash
     python manage.py shell
     >>> from users.models import ProposalReview
     >>> ProposalReview.objects.all()
     ```

2. **序列化器未正确返回 reviews**
   - 检查 ProposalSerializer.get_reviews() 是否被调用
   - 在后端 serializers.py 中添加日志：
     ```python
     def get_reviews(self, obj):
         qs = getattr(obj, 'reviews', None)
         print(f"DEBUG: reviews queryset = {qs}")  # 调试日志
         if qs is None:
             return []
         return ProposalReviewSerializer(qs, many=True).data
     ```

3. **前端未重新加载列表**
   - 手动刷新页面（按 F5）
   - 检查学生端是否调用了 loadHistory()
   - 查看浏览器控制台是否有错误

### 问题3：教师列表中看不到学生的提交

**可能原因和解决方案：**

1. **学生未提交内容**
   - 使用学生账户提交开题/中期检查

2. **权限问题**
   - 检查教师用户的 profile.role 是否为 "teacher"
   - 后端视图 AllProposalsListAPIView 中验证权限

3. **数据库问题**
   - 检查学生的提交是否真的保存到了数据库

## API 端点验证

使用 curl 或 Postman 验证 API 端点：

### 学生提交开题
```bash
curl -X POST http://127.0.0.1:8000/api/auth/proposal/submit/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -F "title=开题报告" \
  -F "file=@path/to/file.pdf"
```

### 教师获取所有开题
```bash
curl -X GET http://127.0.0.1:8000/api/auth/proposal/all-proposals/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### 教师提交评审
```bash
curl -X POST http://127.0.0.1:8000/api/auth/proposal/1/review/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 85,
    "feedback": "不错的开题",
    "result": "pass"
  }'
```

### 学生获取自己的开题
```bash
curl -X GET http://127.0.0.1:8000/api/auth/proposal/my-proposals/ \
  -H "Authorization: Token YOUR_TOKEN"
```

响应应包含 `reviews` 数组：
```json
{
  "id": 1,
  "title": "开题报告",
  "reviews": [
    {
      "id": 1,
      "feedback": "不错的开题",
      "score": 85,
      "result": "pass",
      "reviewed_at": "2025-01-20T10:30:00Z",
      "reviewer_name": "张三"
    }
  ]
}
```

## 数据库检查

在 Django shell 中验证：

```bash
python manage.py shell
```

```python
from users.models import Proposal, ProposalReview, User

# 查看所有开题
proposals = Proposal.objects.all()
for p in proposals:
    print(f"Proposal: {p.id}, Student: {p.student.username}")
    print(f"  Reviews: {p.reviews.all()}")
    for r in p.reviews.all():
        print(f"    - {r.reviewer.username}: {r.result}")

# 创建测试数据
student = User.objects.get(username='student')
teacher = User.objects.get(username='teacher')

# 创建开题（如果不存在）
proposal, created = Proposal.objects.get_or_create(
    student=student,
    defaults={'title': '测试开题', 'file': 'test.pdf'}
)

# 创建评审
review = ProposalReview.objects.create(
    proposal=proposal,
    reviewer=teacher,
    feedback='测试反馈',
    score=80,
    result='pass'
)
```

## 前端日志检查

打开浏览器开发工具（F12），在 Console 标签中查找：

**提交时：**
- `Submitting review: { proposal_id: X, body: {...} }`
- `Review submitted successfully: {...}`

**加载时：**
- 检查 API 响应中 reviews 数组的内容

## 完整工作流验证清单

- [ ] 学生能成功提交开题报告
- [ ] 提交后在历史中可见
- [ ] 教师可以看到所有学生的开题
- [ ] 教师可以填写评分和反馈
- [ ] 教师点击"提交审核"后无错误
- [ ] 学生刷新后可以看到教师的反馈
- [ ] 反馈中显示了正确的审核结果、分数和评论
- [ ] 中期检查流程同样正常
- [ ] 多个评审叠加显示正确

## 联系方式

如果问题仍未解决，请提供：
1. 浏览器控制台的完整错误日志
2. 网络请求/响应的截图
3. 后端 manage.py shell 中的数据库内容
