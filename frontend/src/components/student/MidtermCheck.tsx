import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
import { apiFetch, apiUpload } from '../../utils/api';

type Midterm = {
  id: number;
  title: string;
  file: string | null;
  file_url?: string | null;
  status: string;
  submitted_at: string;
};

export function MidtermCheck() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<Midterm[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = async () => {
    setLoadingHistory(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/midterm/my-midterms/');
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
      setError('请选择要上传的文件（建议PDF）');
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('title', title || '中期检查');
      formData.append('file', file);

      await apiUpload('/api/auth/midterm/submit/', formData);
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
          <CardTitle>中期检查</CardTitle>
          <CardDescription>上传中期检查文件，教师可在线查看</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 mb-2">中期检查要求：</p>
                <ul className="space-y-1 text-blue-800 list-disc list-inside">
                  <li>建议上传PDF格式，大小不超过20MB</li>
                  <li>文件应包含阶段性成果与后续计划</li>
                </ul>
              </div>
            </div>
          </div>

          <Tabs defaultValue="submit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submit">提交中期</TabsTrigger>
              <TabsTrigger value="history">提交历史</TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="space-y-4">
              <div>
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：中期检查"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="midterm-file">上传文件</Label>
                <div className="mt-2 flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="midterm-file"
                      type="file"
                      accept="application/pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    <Upload className="size-4 mr-2" />
                    {submitting ? '上传中...' : '上传'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">建议PDF格式</p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? '提交中...' : '提交中期检查'}
              </Button>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {loadingHistory && <p className="text-sm text-gray-600">加载中...</p>}
              {!loadingHistory && history.length === 0 && (
                <div className="text-center py-8 text-gray-600">暂无提交记录</div>
              )}
              {history.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-8 text-blue-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{item.title || '中期检查'}</CardTitle>
                            <Badge variant="outline">中期</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            提交时间：{new Date(item.submitted_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{item.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm break-all">{item.title}</span>
                      {item.file_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.file_url} target="_blank" rel="noreferrer">
                            <Download className="size-4 mr-2" />
                            下载
                          </a>
                        </Button>
                      )}
                    </div>
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
