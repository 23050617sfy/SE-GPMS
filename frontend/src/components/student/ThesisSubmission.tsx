import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, FileText, Download, MessageSquare, Clock } from 'lucide-react';
import { apiFetch, apiUpload } from '../../utils/api';

type Thesis = {
  id: number;
  title: string;
  version: string;
  stage: string;
  status: string;
  file: string;
  file_url?: string | null;
  submitted_at: string;
  reviews?: {
    id: number;
    stage: string;
    feedback: string | null;
    score: number | null;
    result: string;
  }[];
};

const stageOptions = [
  { value: 'first_review', label: '初稿（一审）' },
  { value: 'second_review', label: '修改稿（二审）' },
  { value: 'final_submission', label: '终稿' },
];

export function ThesisSubmission() {
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState(stageOptions[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<Thesis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = async () => {
    setLoadingHistory(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/thesis/my-thesis/');
      setHistory(data || []);
    } catch (err: any) {
      setError(err?.data?.detail || '加载提交历史失败');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async () => {
    if (!file) {
      setError('请选择要上传的PDF文件');
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('title', title || '毕业论文');
      formData.append('stage', stage);
      formData.append('version', stageOptions.find((s) => s.value === stage)?.label || stage);
      formData.append('file', file);

      await apiUpload('/api/auth/thesis/submit/', formData);
      setMessage('提交成功');
      setFile(null);
      setTitle('');
      await loadHistory();
    } catch (err: any) {
      setError(err?.data?.detail || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>论文提交</CardTitle>
          <CardDescription>上传PDF论文，教师可在线查看与审阅</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <h4 className="mb-2">论文提交要求：</h4>
            <ul className="space-y-1 text-sm list-disc list-inside text-gray-700">
              <li>仅支持PDF格式，大小建议不超过20MB</li>
              <li>至少提交初稿进入一审；通过后提交修改稿进入二审；最终提交终稿</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
            <h4 className="mb-2">论文审核流程：</h4>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-blue-600">初稿</Badge>
              <span>→</span>
              <Badge className="bg-green-600">一审</Badge>
              <span>→</span>
              <Badge className="bg-orange-600">修改稿</Badge>
              <span>→</span>
              <Badge className="bg-purple-600">二审</Badge>
              <span>→</span>
              <Badge className="bg-indigo-600">终稿</Badge>
            </div>
          </div>

          <Tabs defaultValue="submit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submit">提交论文</TabsTrigger>
              <TabsTrigger value="history">提交历史</TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="space-y-4">
              <div>
                <Label htmlFor="title">论文题目</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入论文题目"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="stage">提交版本</Label>
                <select
                  id="stage"
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  {stageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="thesis-file">上传论文文件 (PDF)</Label>
                <div className="mt-2 flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="thesis-file"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    <Upload className="size-4 mr-2" />
                    {submitting ? '上传中...' : '上传'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  仅支持PDF格式
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? '提交中...' : '提交论文'}
              </Button>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {loadingHistory && <p className="text-sm text-gray-600">加载中...</p>}
              {!loadingHistory && history.length === 0 && (
                <div className="text-center py-8 text-gray-600">暂无提交记录</div>
              )}
              {history.map((thesis) => (
                <Card key={thesis.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-8 text-blue-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{thesis.version}</CardTitle>
                            <Badge variant="outline">{thesis.stage}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            提交时间：{new Date(thesis.submitted_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{thesis.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm break-all">{thesis.title}</span>
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
                      <div className="space-y-3">
                        {thesis.reviews.map((rev) => (
                          <div key={rev.id} className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-sm mb-1">{rev.stage} 审阅意见</h4>
                                <p className="text-sm text-gray-700">{rev.feedback || '暂无意见'}</p>
                                {rev.score !== null && (
                                  <p className="text-sm text-gray-600 mt-2">评分：{rev.score}分</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}