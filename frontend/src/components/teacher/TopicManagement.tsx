import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { apiFetch } from '../../utils/api';

type Topic = {
  id: number;
  title: string;
  type?: string;
  difficulty?: string;
  max_students?: number;
  selected_students?: number;
  status?: string;
  description?: string;
  requirements?: string;
};

export function TopicManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [typeVal, setTypeVal] = useState('应用研究');
  const [difficulty, setDifficulty] = useState('中等');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [maxStudents, setMaxStudents] = useState(1);
  const [saving, setSaving] = useState(false);

  const loadTopics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/topics/my-topics/');
      setTopics(Array.isArray(data) ? data : []);
    } catch (err: any) {
      // fallback: keep empty and surface error
      setError(err?.data?.detail || (err?.data || err?.toString()) || '加载课题失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const openNew = () => {
    setEditingTopic(null);
    setTitle('');
    setTypeVal('应用研究');
    setDifficulty('中等');
    setDescription('');
    setRequirements('');
    setMaxStudents(1);
    setDialogOpen(true);
  };

  const openEdit = (t: Topic) => {
    setEditingTopic(t);
    setTitle(t.title || '');
    setTypeVal(t.type || '应用研究');
    setDifficulty(t.difficulty || '中等');
    setDescription(t.description || '');
    setRequirements(t.requirements || '');
    setMaxStudents(t.max_students || 1);
    setDialogOpen(true);
  };

  const saveTopic = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: title.trim(),
        type: typeVal,
        difficulty,
        description,
        requirements,
        max_students: Number(maxStudents) || 1,
      };
      if (editingTopic) {
        // update
        await apiFetch(`/api/auth/topics/${editingTopic.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        // create
        await apiFetch('/api/auth/topics/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      // reload list from server to reflect accurate computed fields
      await loadTopics();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err?.data?.detail || (err?.data || err?.toString()) || '保存课题失败');
    } finally {
      setSaving(false);
    }
  };

  const deleteTopic = async (t: Topic) => {
    if (!confirm('确认删除该课题吗？删除后无法恢复。')) return;
    try {
      await apiFetch(`/api/auth/topics/${t.id}/`, { method: 'DELETE' });
      // reload server list
      await loadTopics();
    } catch (err: any) {
      setError(err?.data?.detail || (err?.data || err?.toString()) || '删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>我的课题</CardTitle>
              <CardDescription>管理您发布的毕业论文课题</CardDescription>
            </div>
            <Button onClick={openNew}>
              <Plus className="size-4 mr-2" />
              发布新课题
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-gray-600">加载中...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="space-y-4">
            {topics.length === 0 && !loading ? (
              <div className="text-center py-12">
                <h3 className="text-lg mb-2">暂无课题</h3>
                <p className="text-gray-600">点击“发布新课题”添加</p>
              </div>
            ) : (
              topics.map((topic) => (
                <Card key={topic.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{topic.title}</CardTitle>
                          <Badge variant={topic.status === 'full' ? 'default' : 'secondary'}>
                            {topic.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <Badge variant="outline">{topic.type}</Badge>
                          <Badge variant="outline">难度: {topic.difficulty}</Badge>
                          <div className="flex items-center gap-1">
                            <Users className="size-4" />
                            <span>{topic.selected_students || 0}/{topic.max_students || 1}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(topic)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={(topic.selected_students || 0) > 0}
                          onClick={() => deleteTopic(topic)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
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
                    {topic.selected_students && topic.selected_students > 0 && (
                      <div className="pt-3 border-t">
                        <h4 className="text-sm mb-2">已选学生：</h4>
                        <div className="p-3 bg-blue-50 rounded">
                          <p className="text-sm">若已被选中，将在此展示已选学生信息</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTopic ? '编辑课题' : '发布新课题'}</DialogTitle>
            <DialogDescription>
              填写课题信息，学生将能够浏览并选择您的课题
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="topic-title">课题名称</Label>
              <Input
                id="topic-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入课题名称"
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="topic-type">课题类型</Label>
                <select
                  id="topic-type"
                  value={typeVal}
                  onChange={(e) => setTypeVal(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                >
                  <option>应用研究</option>
                  <option>理论研究</option>
                  <option>系统设计</option>
                  <option>算法设计</option>
                </select>
              </div>
              <div>
                <Label htmlFor="topic-difficulty">难度等级</Label>
                <select
                  id="topic-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                >
                  <option>较易</option>
                  <option>中等</option>
                  <option>较难</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="topic-description">课题简介</Label>
              <Textarea
                id="topic-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请详细描述课题的研究内容、目标等"
                className="mt-2 min-h-24"
              />
            </div>
            <div>
              <Label htmlFor="topic-requirements">学生要求</Label>
              <Textarea
                id="topic-requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="请说明对学生的技能要求、前置知识等"
                className="mt-2 min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="max-students">可选学生数</Label>
              <Input
                id="max-students"
                type="number"
                value={maxStudents}
                onChange={(e) => setMaxStudents(Number(e.target.value))}
                min={1}
                max={10}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveTopic} disabled={!title || saving}>
              {saving ? '保存中...' : (editingTopic ? '保存修改' : '发布课题')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
