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
import { Input } from '../ui/input';

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
    reviewStage: '二审',
    previousFeedback: '【一审意见】论文结构完整，但第三章的实验部分需要补充更多数据。图表格式需要统一。',
    firstReviewScore: 78,
  },
  {
    id: '2',
    studentName: '王五',
    studentId: '20210103',
    topic: '区块链技术在供应链中的应用',
    version: '初稿',
    submitDate: '2025-05-12',
    fileName: '毕业论文_初稿_王五.pdf',
    status: '待审阅',
    reviewStage: '一审',
    previousFeedback: null,
    firstReviewScore: null,
  },
];

export function ThesisReview() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<typeof mockTheses[0] | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [reviewResult, setReviewResult] = useState<'pass' | 'revise' | 'fail' | null>(null);

  const handleReview = (thesis: typeof mockTheses[0]) => {
    setSelectedThesis(thesis);
    setReviewDialogOpen(true);
  };

  const submitReview = () => {
    // In real app, this would make an API call
    setReviewDialogOpen(false);
    setFeedback('');
    setScore('');
    setReviewResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>论文评审</CardTitle>
          <CardDescription>审阅学生提交的论文并提供反馈（一审、二审）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
            <h4 className="mb-2">论文审核说明：</h4>
            <ul className="space-y-1 text-sm list-disc list-inside text-gray-700">
              <li><span className="font-medium">一审</span>：审核论文初稿，给出修改意见和评分</li>
              <li><span className="font-medium">二审</span>：审核修改后的论文，确认是否达到终稿要求</li>
              <li>两次审核均通过后，学生方可提交终稿并参加答辩</li>
            </ul>
          </div>

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
                          <Badge variant="outline">{thesis.version}</Badge>
                          <Badge className={
                            thesis.reviewStage === '一审' ? 'bg-blue-600' : 'bg-green-600'
                          }>
                            {thesis.reviewStage}
                          </Badge>
                          <Badge variant="secondary">{thesis.status}</Badge>
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
                          <div className="flex-1">
                            <h4 className="text-sm mb-1">历史审阅意见：</h4>
                            <p className="text-sm text-gray-700">{thesis.previousFeedback}</p>
                            {thesis.firstReviewScore && (
                              <p className="text-sm text-gray-600 mt-2">
                                一审评分：{thesis.firstReviewScore}分
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={() => handleReview(thesis)}
                    >
                      <MessageSquare className="size-4 mr-2" />
                      {thesis.reviewStage}审阅评分
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
            <DialogTitle>论文{selectedThesis?.reviewStage}审阅</DialogTitle>
            <DialogDescription>
              {selectedThesis?.studentName} - {selectedThesis?.topic}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="text-sm mb-2">
                {selectedThesis?.reviewStage === '一审' ? '一审' : '二审'}审阅要点：
              </h4>
              {selectedThesis?.reviewStage === '一审' ? (
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                  <li>论文结构是否完整合理</li>
                  <li>研究内容是否充实</li>
                  <li>实验数据是否充分</li>
                  <li>图表格式是否规范</li>
                  <li>参考文献是否准确</li>
                </ul>
              ) : (
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                  <li>是否按照一审意见进行了修改</li>
                  <li>修改是否达到要求</li>
                  <li>是否可以进入终稿阶段</li>
                </ul>
              )}
            </div>

            <div>
              <Label htmlFor="review-score">评分（0-100）</Label>
              <Input
                id="review-score"
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
                <Button 
                  variant={reviewResult === 'pass' ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col"
                  onClick={() => setReviewResult('pass')}
                >
                  <span className="text-lg mb-1">✓</span>
                  <span className="text-sm">通过</span>
                </Button>
                <Button 
                  variant={reviewResult === 'revise' ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col"
                  onClick={() => setReviewResult('revise')}
                >
                  <span className="text-lg mb-1">↻</span>
                  <span className="text-sm">需修改</span>
                </Button>
                <Button 
                  variant={reviewResult === 'fail' ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col"
                  onClick={() => setReviewResult('fail')}
                >
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
            <Button onClick={submitReview} disabled={!feedback || !score || !reviewResult}>
              提交审阅意见
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}