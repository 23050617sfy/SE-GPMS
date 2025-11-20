import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { FileText, Download, CheckCircle2, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const mockProposals = [
  {
    id: '1',
    studentName: '赵六',
    studentId: '20210104',
    topic: '智能推荐算法在电商平台的应用研究',
    submitDate: '2025-04-12',
    fileName: '开题报告_赵六.pdf',
    status: '待审核',
  },
];

export function ProposalReview() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<typeof mockProposals[0] | null>(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [approved, setApproved] = useState<boolean | null>(null);

  const handleReview = (proposal: typeof mockProposals[0]) => {
    setSelectedProposal(proposal);
    setReviewDialogOpen(true);
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
          <CardTitle>开题报告审核</CardTitle>
          <CardDescription>审核学生提交的开题报告</CardDescription>
        </CardHeader>
        <CardContent>
          {mockProposals.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">暂无待审核的开题报告</h3>
              <p className="text-gray-600">学生提交开题报告后将在此显示</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockProposals.map((proposal) => (
                <Card key={proposal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {proposal.studentName} ({proposal.studentId})
                          </CardTitle>
                          <Badge variant="secondary">{proposal.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{proposal.topic}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          提交时间：{proposal.submitDate}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <FileText className="size-6 text-blue-600" />
                          <span className="text-sm">{proposal.fileName}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="size-4 mr-2" />
                          下载
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => handleReview(proposal)}
                        >
                          <CheckCircle2 className="size-4 mr-2" />
                          审核评分
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>开题报告审核</DialogTitle>
            <DialogDescription>
              {selectedProposal?.studentName} - {selectedProposal?.topic}
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
                  不通过
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
                placeholder="请填写对开题报告的评价和修改建议..."
                className="mt-2 min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={submitReview} disabled={!approved || !score || !feedback}>
              提交审核
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
