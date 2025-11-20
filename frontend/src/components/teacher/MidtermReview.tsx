import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { FileText, CheckCircle2, XCircle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const mockMidtermReports = [
  {
    id: '1',
    studentName: '李四',
    studentId: '20210102',
    topic: '智能客服系统的设计与实现',
    submitDate: '2025-04-23',
    progress: '已完成系统需求分析和架构设计，正在进行功能模块开发。',
    achievements: '1. 完成了需求文档\n2. 设计了系统架构\n3. 实现了基础对话功能',
    problems: '自然语言处理模块性能需要优化',
    nextPlan: '完成剩余功能模块开发，进行系统测试',
    status: '待审核',
  },
];

export function MidtermReview() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof mockMidtermReports[0] | null>(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [approved, setApproved] = useState<boolean | null>(null);

  const handleReview = (report: typeof mockMidtermReports[0]) => {
    setSelectedReport(report);
    setReviewDialogOpen(true);
  };

  const handleViewDetail = (report: typeof mockMidtermReports[0]) => {
    setSelectedReport(report);
    setDetailDialogOpen(true);
  };

  const submitReview = () => {
    // In real app, this would make an API call
    setReviewDialogOpen(false);
    setScore('');
    setFeedback('');
    setApproved(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>中期检查审核</CardTitle>
          <CardDescription>审核学生的中期检查报告</CardDescription>
        </CardHeader>
        <CardContent>
          {mockMidtermReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">暂无待审核的中期检查</h3>
              <p className="text-gray-600">学生提交中期检查后将在此显示</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockMidtermReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {report.studentName} ({report.studentId})
                          </CardTitle>
                          <Badge variant="secondary">{report.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{report.topic}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          提交时间：{report.submitDate}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">工作进展：</Label>
                      <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                        {report.progress}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetail(report)}
                      >
                        <Eye className="size-4 mr-2" />
                        查看详情
                      </Button>
                      <Button onClick={() => handleReview(report)}>
                        <CheckCircle2 className="size-4 mr-2" />
                        审核评分
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 详情对话框 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>中期检查详情</DialogTitle>
            <DialogDescription>
              {selectedReport?.studentName} - {selectedReport?.topic}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div>
                <Label>工作进展描述</Label>
                <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded">
                  {selectedReport.progress}
                </p>
              </div>

              <div>
                <Label>阶段性成果</Label>
                <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded whitespace-pre-line">
                  {selectedReport.achievements}
                </p>
              </div>

              <div>
                <Label>存在问题</Label>
                <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded">
                  {selectedReport.problems}
                </p>
              </div>

              <div>
                <Label>下一步计划</Label>
                <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded">
                  {selectedReport.nextPlan}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              setDetailDialogOpen(false);
              if (selectedReport) handleReview(selectedReport);
            }}>
              开始审核
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 审核对话框 */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>中期检查审核</DialogTitle>
            <DialogDescription>
              {selectedReport?.studentName} - {selectedReport?.topic}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>审核结果</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  variant={approved === true ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setApproved(true)}
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  通过
                </Button>
                <Button
                  variant={approved === false ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setApproved(false)}
                >
                  <XCircle className="size-4 mr-2" />
                  需改进
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="score">评分（0-100）</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="请输入分数"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="feedback">反馈意见</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="请填写对学生工作进展的评价和建议..."
                className="mt-2 min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={submitReview} disabled={approved === null || !score || !feedback}>
              提交审核
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
