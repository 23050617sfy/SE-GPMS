import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { FileText, CheckCircle2, XCircle, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { apiFetch } from '../../utils/api';

type Review = {
  id: number;
  feedback: string | null;
  score: number | null;
  result: string;
  reviewed_at: string;
  reviewer_name?: string;
};

type Midterm = {
  id: number;
  student_id: string;
  student_name: string;
  title: string;
  file_url?: string | null;
  status: string;
  submitted_at: string;
  reviews?: Review[];
};

export function MidtermReview() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Midterm | null>(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [approved, setApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Midterm[]>([]);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/midterm/all-midterms/');
      setReports(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.data?.detail || '加载中期列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleReview = (report: Midterm) => {
    setSelectedReport(report);
    setError(''); // 清除之前的错误
    setScore('');
    setFeedback('');
    setApproved(null);
    setReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!selectedReport) {
      setError('请选择要审核的中期检查');
      return;
    }
    if (approved === null) {
      setError('请选择审核结果（通过/不通过）');
      return;
    }
    if (!score) {
      setError('请输入评分');
      return;
    }
    if (!feedback) {
      setError('请填写反馈意见');
      return;
    }
    const scoreNum = Number(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setError('评分必须为 0-100 之间的数字');
      return;
    }

    try {
      const body = {
        score: scoreNum,
        feedback,
        result: approved ? 'pass' : 'fail',
      };
      console.log('Submitting review:', { midterm_id: selectedReport.id, body });
      const response = await apiFetch(`/api/auth/midterm/${selectedReport.id}/review/`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Review submitted successfully:', response);
      setReviewDialogOpen(false);
      setScore('');
      setFeedback('');
      setApproved(null);
      setError('');
      await loadReports();
    } catch (e: any) {
      console.error('Submit review error:', e);
      let errorMsg = '提交审核失败';
      if (typeof e?.data === 'string') {
        errorMsg = e.data;
      } else if (e?.data?.detail) {
        errorMsg = e.data.detail;
      } else if (e?.data?.feedback) {
        errorMsg = e.data.feedback;
      } else if (e?.data?.score) {
        errorMsg = e.data.score;
      }
      setError(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>中期检查审核</CardTitle>
          <CardDescription>审核学生的中期检查报告</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          {loading ? (
            <div className="text-center py-8 text-gray-600">加载中...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">暂无待审核的中期检查</h3>
              <p className="text-gray-600">学生提交中期检查后将在此显示</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {report.student_name} ({report.student_id})
                          </CardTitle>
                          <Badge variant="secondary">{report.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          提交时间：{new Date(report.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="size-6 text-blue-600" />
                        <span className="text-sm">{report.title}</span>
                      </div>
                      {report.file_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={report.file_url} target="_blank" rel="noreferrer">
                            <Download className="size-4 mr-2" />
                            下载
                          </a>
                        </Button>
                      )}
                    </div>

                    {report.reviews && report.reviews.length > 0 ? (
                      <Button className="w-full" variant="outline" disabled>
                        <CheckCircle2 className="size-4 mr-2" />
                        已审核
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleReview(report)}>
                        <CheckCircle2 className="size-4 mr-2" />
                        审核评分
                      </Button>
                    )}
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
            <DialogTitle>中期检查审核</DialogTitle>
            <DialogDescription>
              {selectedReport?.student_name} - {selectedReport?.title}
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
