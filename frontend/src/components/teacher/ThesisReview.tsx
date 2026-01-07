import { useEffect, useState } from 'react';
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
import { apiFetch } from '../../utils/api';

type Review = {
  id: number;
  stage: string;
  feedback: string | null;
  score: number | null;
  result: string;
};

type Thesis = {
  id: number;
  student_id: string;
  student_name?: string;
  title: string;
  version: string;
  stage: string;
  status: string;
  file_url?: string | null;
  submitted_at: string;
  reviews?: Review[];
};

const getFileName = (url?: string | null) => {
  if (!url) return '未提供下载链接';
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split('/');
    const last = parts[parts.length - 1];
    return decodeURIComponent(last || pathname);
  } catch (err) {
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    try {
      return decodeURIComponent(last || url);
    } catch (e) {
      return last || url;
    }
  }
};

const stageLabel = (stage?: string) => {
  const map: Record<string, string> = {
    first_review: '一审',
    second_review: '二审',
    final_submission: '终稿',
  };
  return stage ? map[stage] || '' : '';
};

const statusLabel = (status?: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    first_review: '一审中',
    first_pass: '一审通过',
    first_fail: '一审未通过',
    second_review: '二审中',
    second_pass: '二审通过',
    second_fail: '二审未通过',
    final: '终稿',
  };
  return status ? map[status] || '' : '';
};

const reviewResultLabel = (result?: string) => {
  const map: Record<string, string> = {
    pass: '通过',
    revise: '需修改',
    fail: '不通过',
  };
  return result ? map[result] || result : '';
};

const reviewResultClass = (result?: string) => {
  const map: Record<string, string> = {
    pass: '!bg-green-600 !text-white',
    revise: '!bg-yellow-400 !text-black',
    fail: '!bg-red-600 !text-white',
  };
  return result ? map[result] || '' : '';
};

const reviewResultStyle = (result?: string) => {
  const map: Record<string, { backgroundColor: string; color: string }> = {
    pass: { backgroundColor: '#15803d', color: '#ffffff' },
    revise: { backgroundColor: '#f59e0b', color: '#000000' },
    fail: { backgroundColor: '#dc2626', color: '#ffffff' },
  };
  return result ? map[result] || undefined : undefined;
};

export function ThesisReview() {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [reviewResult, setReviewResult] = useState<'pass' | 'revise' | 'fail' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTheses = async (username?: string) => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/auth/thesis/all-theses/';
      if (username && username.trim() !== '') {
        url += `?username=${encodeURIComponent(username.trim())}`;
      }
      const data = await apiFetch(url);
      setTheses(data || []);
    } catch (err: any) {
      setError(err?.data?.detail || '加载论文列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheses();
  }, []);

  const handleSearch = async () => {
    await loadTheses(usernameFilter);
  };

  const handleReview = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    setReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!selectedThesis || !reviewResult) return;
    setSubmitting(true);
    setError('');
    try {
      await apiFetch(`/api/auth/thesis/${selectedThesis.id}/review/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback,
          score: score ? Number(score) : null,
          result: reviewResult,
          stage: selectedThesis.stage,
        }),
      });
      setReviewDialogOpen(false);
      setFeedback('');
      setScore('');
      setReviewResult(null);
      await loadTheses();
    } catch (err: any) {
      setError(err?.data?.detail || '提交审阅失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>论文评审</CardTitle>
          <CardDescription>查看学生提交的论文，在线给出反馈与评分</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
            <h4 className="mb-2">论文审核说明：</h4>
            <ul className="space-y-1 text-sm list-disc list-inside text-gray-700">
              <li><span className="font-medium">一审</span>：审核初稿，给出修改意见与评分</li>
              <li><span className="font-medium">二审</span>：审核修改稿，确认是否可进入终稿</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="按用户名或姓名搜索（支持部分匹配）"
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
            />
            <Button onClick={handleSearch}>搜索</Button>
            <Button variant="ghost" onClick={async () => { setUsernameFilter(''); await loadTheses(); }}>重置</Button>
          </div>
          {loading && <p className="text-sm text-gray-600">加载中...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && theses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">暂无待审阅的论文</h3>
              <p className="text-gray-600">学生提交论文后将在此显示</p>
            </div>
          ) : (
            <div className="space-y-4">
              {theses.map((thesis) => (
                <Card key={thesis.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {thesis.student_name ? `${thesis.student_name}(${thesis.student_id})` : thesis.student_id}
                          </CardTitle>
                          {thesis.version && <Badge variant="outline">{thesis.version}</Badge>}
                          {stageLabel(thesis.stage) && <Badge className="bg-blue-600">{stageLabel(thesis.stage)}</Badge>}
                          {statusLabel(thesis.status) && <Badge variant="secondary">{statusLabel(thesis.status)}</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{thesis.title}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          提交时间：{new Date(thesis.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="size-6 text-blue-600" />
                        <span className="text-sm break-all">{getFileName(thesis.file_url)}</span>
                      </div>
                      {thesis.file_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={thesis.file_url} target="_blank" rel="noreferrer">
                            <Download className="size-4 mr-2" />
                            下载
                          </a>
                        </Button>
                      )}
                    </div>

                    {thesis.reviews && thesis.reviews.length > 0 && (
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 space-y-2">
                            <h4 className="text-sm mb-1">历史审阅意见：</h4>
                            {thesis.reviews.map((rev) => (
                              <div key={rev.id} className="text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={reviewResultClass(rev.result)} style={reviewResultStyle(rev.result)}>{reviewResultLabel(rev.result)}</Badge>
                                  <Badge variant="outline">{rev.score !== null ? `${rev.score}分` : '—分'}</Badge>
                                </div>
                                <p className="text-gray-700 mt-2"><span className="font-medium">评语：</span>{rev.feedback || '暂无意见'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {thesis.reviews && thesis.reviews.length > 0 ? (
                      <div className="w-full py-4 text-center text-sm text-gray-600 bg-gray-50 rounded">
                        已审阅
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleReview(thesis)}
                      >
                        <MessageSquare className="size-4 mr-2" />
                        提交审阅
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>论文审阅</DialogTitle>
            <DialogDescription>
              {selectedThesis
                ? (selectedThesis.student_name ? `${selectedThesis.student_name}(${selectedThesis.student_id})` : selectedThesis.student_id)
                : ''} - {selectedThesis?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <Button onClick={submitReview} disabled={!feedback || !score || !reviewResult || submitting}>
              {submitting ? '提交中...' : '提交审阅意见'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}