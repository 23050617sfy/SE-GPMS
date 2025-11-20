import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { FileText, Download, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const mockTheses = [
  {
    id: '1',
    studentName: '张三',
    studentId: '20210101',
    topic: '基于深度学习的图像识别系统研究',
    version: '修改稿',
    submitDate: '2025-05-18',
    fileName: '毕业论文_修改稿_张三.pdf',
    status: '待审阅',
    previousFeedback: '论文结构完整，但第三章的实验部分需要补充更多数据。图表格式需要统一。',
  },
];

export function ThesisReview() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<typeof mockTheses[0] | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleReview = (thesis: typeof mockTheses[0]) => {
    setSelectedThesis(thesis);
    setReviewDialogOpen(true);
  };

  const submitReview = () => {
    // In real app, this would make an API call
    setReviewDialogOpen(false);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>论文评审</CardTitle>
          <CardDescription>审阅学生提交的论文并提供反馈</CardDescription>
        </CardHeader>
        <CardContent>
          {mockTheses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">暂无待审阅的论文</h3>
              <p className="text-gray-600">学生提交论文后将在此显示</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockTheses.map((thesis) => (
                <Card key={thesis.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {thesis.studentName} ({thesis.studentId})
                          </CardTitle>
                          <Badge variant="secondary">{thesis.version}</Badge>
                          <Badge>{thesis.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{thesis.topic}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          提交时间：{thesis.submitDate}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="size-6 text-blue-600" />
                        <span className="text-sm">{thesis.fileName}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" />
                        下载
                      </Button>
                    </div>

                    {thesis.previousFeedback && (
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm mb-1">上次反馈：</h4>
                            <p className="text-sm text-gray-700">{thesis.previousFeedback}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={() => handleReview(thesis)}
                    >
                      <MessageSquare className="size-4 mr-2" />
                      提供审阅意见
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>论文审阅</DialogTitle>
            <DialogDescription>
              {selectedThesis?.studentName} - {selectedThesis?.topic}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="text-sm mb-2">审阅要点：</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                <li>论文结构是否完整合理</li>
                <li>研究内容是否充实</li>
                <li>实验数据是否充分</li>
                <li>图表格式是否规范</li>
                <li>参考文献是否准确</li>
              </ul>
            </div>

            <div>
              <Label htmlFor="review-feedback">审阅意见</Label>
              <Textarea
                id="review-feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="请详细说明论文的优点和需要改进的地方..."
                className="mt-2 min-h-48"
              />
            </div>

            <div>
              <Label>审阅结果</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <span className="text-lg mb-1">✓</span>
                  <span className="text-sm">通过</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <span className="text-lg mb-1">↻</span>
                  <span className="text-sm">需修改</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <span className="text-lg mb-1">✗</span>
                  <span className="text-sm">不通过</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={submitReview} disabled={!feedback}>
              提交审阅意见
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
