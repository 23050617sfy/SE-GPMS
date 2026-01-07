import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { User, BookOpen, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { apiFetch } from '../../utils/api';

type Topic = {
  id: number;
  title: string;
  teacher_id?: string;
  teacher_name?: string;
  type?: string;
  difficulty?: string;
  description?: string;
  requirements?: string;
  max_students?: number;
  selected_students?: number;
  status?: string;
  is_selected?: boolean;
};

export function TopicSelection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selecting, setSelecting] = useState(false);
  const [deselecting, setDeselecting] = useState(false);

  const loadTopics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/topics/');
      setTopics(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.data?.detail || (err?.data || err?.toString()) || '加载课题失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setDialogOpen(true);
  };

  const confirmSelection = async () => {
    if (!selectedTopic) return;
    setSelecting(true);
    setError('');
    try {
      await apiFetch(`/api/auth/topics/${selectedTopic.id}/select/`, { method: 'POST' });
      await loadTopics();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err?.data?.detail || (err?.data || err?.toString()) || '选择失败');
    } finally {
      setSelecting(false);
    }
  };

  const handleDeselectTopic = async (topic: Topic) => {
    if (!confirm('确定要取消选择此课题吗？')) return;
    setDeselecting(true);
    setError('');
    try {
      await apiFetch(`/api/auth/topics/${topic.id}/select/`, { method: 'DELETE' });
      await loadTopics();
    } catch (err: any) {
      setError(err?.data?.detail || (err?.data || err?.toString()) || '取消选择失败');
    } finally {
      setDeselecting(false);
    }
  };

  // Determine if student already selected any topic
  const hasSelected = topics.some((t) => t.is_selected);

  const visibleTopics = topics; // no search/filter for now

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>选择毕业论文课题</CardTitle>
          <CardDescription>浏览并选择您感兴趣的课题，每位学生只能选择一个课题</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-gray-600">加载中...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {visibleTopics.map((topic) => (
          <Card key={topic.id} className={topic.is_selected ? 'border-green-500 bg-green-50' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    {topic.is_selected && (
                      <Badge className="bg-green-600">
                        <CheckCircle2 className="size-3 mr-1" />
                        已选择
                      </Badge>
                    )}
                    {topic.status === 'full' && (
                      <Badge variant="secondary">已满</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      <span>{topic.teacher_name || topic.teacher_id}</span>
                    </div>
                    <Badge variant="outline">{topic.type}</Badge>
                    <Badge variant="outline">难度: {topic.difficulty}</Badge>
                  </div>
                </div>
                {!topic.is_selected && topic.status !== 'full' && !hasSelected && (
                  <Button onClick={() => handleSelectTopic(topic)}>选择课题</Button>
                )}
                {topic.is_selected && (
                  <Button variant="destructive" disabled={deselecting} onClick={() => handleDeselectTopic(topic)}>
                    {deselecting ? '取消中...' : '取消选择'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm mb-1">课题简介：</h4>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
              <div>
                <h4 className="text-sm mb-1">学生要求：</h4>
                <p className="text-sm text-gray-600">{topic.requirements}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认选择课题</DialogTitle>
            <DialogDescription>
              选择后将无法更改。确定要选择该课题吗？
            </DialogDescription>
          </DialogHeader>
          {selectedTopic && (
            <div className="space-y-3 py-4">
              <div>
                <p className="text-sm text-gray-500">课题名称</p>
                <p>{selectedTopic.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">指导教师</p>
                <p>{selectedTopic.teacher_name || selectedTopic.teacher_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">课题类型</p>
                <p>{selectedTopic.type} - {selectedTopic.difficulty}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmSelection} disabled={selecting}>
              {selecting ? '提交中...' : '确认选择'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
