# 审核状态切换修复

## 问题描述
教师端的"开题审核"和"中期检查"提交评语后的"审核评分"按钮没有切换为已审核状态。

## 解决方案

### 修改内容

#### 1. ProposalReview.tsx
- **添加 Review 类型定义**：
  ```typescript
  type Review = {
    id: number;
    feedback: string | null;
    score: number | null;
    result: string;
    reviewed_at: string;
    reviewer_name?: string;
  };
  ```

- **扩展 Proposal 类型**：添加 `reviews?: Review[]` 字段

- **修改按钮状态逻辑**：
  ```tsx
  {proposal.reviews && proposal.reviews.length > 0 ? (
    <Button className="flex-1" variant="outline" disabled>
      <CheckCircle2 className="size-4 mr-2" />
      已审核
    </Button>
  ) : (
    <Button className="flex-1" onClick={() => handleReview(proposal)}>
      <CheckCircle2 className="size-4 mr-2" />
      审核评分
    </Button>
  )}
  ```

#### 2. MidtermReview.tsx
- 完全相同的修改，只是类型名改为 Midterm
- 状态检查逻辑相同

### 工作流程

1. **初始加载**：教师进入审核页面
   - 调用 `loadProposals()` 或 `loadReports()`
   - 后端返回所有提交，包括 `reviews` 数组

2. **没有审核时**：
   - `reviews` 为空数组 `[]`
   - 条件 `proposal.reviews && proposal.reviews.length > 0` 为 `false`
   - 显示可点击的"审核评分"按钮

3. **已审核后**：
   - `reviews` 数组包含至少一条审核记录
   - 条件为 `true`
   - 按钮变灰、显示"已审核"、禁用点击

4. **提交审核后**：
   - 自动调用 `loadProposals()` / `loadReports()`
   - 重新获取数据，状态自动更新
   - 按钮自动切换为已审核状态

### 技术细节

#### 数据流
```
后端 (all-proposals / all-midterms 端点)
  ↓
返回 JSON: { reviews: [{...}, {...}] }
  ↓
前端 setProposals(data)
  ↓
组件重新渲染
  ↓
检查 proposal.reviews.length > 0
  ↓
渲染相应的按钮状态
```

#### 按钮样式变化
| 状态   | 样式        | 图标         | 文本     | 可点击 |
| ------ | ----------- | ------------ | -------- | ------ |
| 未审核 | 蓝色/默认   | CheckCircle2 | 审核评分 | ✓      |
| 已审核 | 灰色outline | CheckCircle2 | 已审核   | ✗      |

### 验证步骤

1. **教师端提交审核前**：
   - 按钮显示"审核评分"，蓝色可点击

2. **提交审核**：
   - 填写分数、反馈、选择结果
   - 点击"提交审核"

3. **提交后立即检查**：
   - 列表自动刷新（loadProposals/loadReports 被调用）
   - 同一条提交的按钮应变为灰色"已审核"
   - 按钮禁用，无法再次点击

4. **刷新页面后**：
   - 重新加载页面
   - 按钮仍显示为"已审核"（确认数据持久化）

### 依赖关系

- ✓ 后端需要在返回列表时包含 `reviews` 字段（已在 ProposalSerializer 和 MidtermCheckSerializer 中实现）
- ✓ `get_reviews()` 方法需要正确查询相关的 Review 对象（已实现）
- ✓ 前端需要正确接收并处理 `reviews` 数组（本次修复）

### 问题排查

如果按钮在提交审核后仍未切换状态，请检查：

1. **浏览器控制台**（F12 → Console）
   - 查看是否有 JavaScript 错误
   - 检查网络请求是否成功（Network 标签）

2. **后端返回数据**
   - 在 Network 标签中检查 GET /api/auth/proposal/all-proposals/ 的响应
   - 确认 reviews 数组是否包含数据
   ```json
   {
     "id": 1,
     "reviews": [
       {
         "id": 1,
         "feedback": "...",
         "score": 85,
         "result": "pass",
         "reviewed_at": "...",
         "reviewer_name": "..."
       }
     ]
   }
   ```

3. **前端状态更新**
   - 在代码中添加 console.log 检查：
   ```tsx
   console.log('Proposal reviews:', proposal.reviews);
   console.log('Has reviews:', proposal.reviews && proposal.reviews.length > 0);
   ```

### 相关文件变更

- `frontend/src/components/teacher/ProposalReview.tsx` - 添加 Review 类型、按钮逻辑
- `frontend/src/components/teacher/MidtermReview.tsx` - 同步修改

### 后续改进建议

1. **显示审核信息**：在"已审核"状态下显示审核者、分数、反馈摘要
2. **允许编辑**：可选择"编辑最后一次审核"功能
3. **批量审核**：支持多个审核记录，而不仅仅是禁用按钮
4. **审核历史**：展示所有审核记录而不仅仅检查是否存在
