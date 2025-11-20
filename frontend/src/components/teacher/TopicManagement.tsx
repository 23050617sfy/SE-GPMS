import { useState } from 'react';
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

const mockTopics = [
  {
    id: '1',
    title: '基于深度学习的图像识别系统研究',
    type: '应用研究',
    difficulty: '中等',
    maxStudents: 1,
    selectedStudents: 1,
    status: '已满',
    description: '研究深度学习在图像识别领域的应用...',
    requirements: '熟悉Python编程，了解机器学习基础知识',
  },
  {
    id: '2',
    title: '智能客服系统的设计与实现',
    type: '系统设计',
    difficulty: '中等',
    maxStudents: 1,
    selectedStudents: 1,
    status: '已满',
    description: '设计并实现基于NLP的智能客服系统...',
    requirements: '熟悉Web开发，了解自然语言处理基础',
  },
  {
    id: '3',
    title: '区块链技术在数字版权保护中的应用',
    type: '应用研究',
    difficulty: '较难',
    maxStudents: 1,
    selectedStudents: 0,
    status: '可选',
    description: '探索区块链技术在数字版权保护领域的应用...',
    requirements: '了解区块链原理，有一定的开发经验',
  },
];

export function TopicManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<typeof mockTopics[0] | null>(null);

  const handleAddTopic = () => {
    setEditingTopic(null);
    setDialogOpen(true);
  };

  const handleEditTopic = (topic: typeof mockTopics[0]) => {
    setEditingTopic(topic);
    setDialogOpen(true);
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
            <Button onClick={handleAddTopic}>
              <Plus className="size-4 mr-2" />
              发布新课题
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTopics.map((topic) => (
              <Card key={topic.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <Badge variant={topic.status === '已满' ? 'default' : 'secondary'}>
                          {topic.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline">{topic.type}</Badge>
                        <Badge variant="outline">难度: {topic.difficulty}</Badge>
                        <div className="flex items-center gap-1">
                          <Users className="size-4" />
                          <span>{topic.selectedStudents}/{topic.maxStudents}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTopic(topic)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={topic.selectedStudents > 0}
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
                  {topic.selectedStudents > 0 && (
                    <div className="pt-3 border-t">
                      <h4 className="text-sm mb-2">已选学生：</h4>
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-sm">张三 - 计算机学院 - 20210101</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
                defaultValue={editingTopic?.title}
                placeholder="请输入课题名称"
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="topic-type">课题类型</Label>
                <select
                  id="topic-type"
                  defaultValue={editingTopic?.type}
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
                  defaultValue={editingTopic?.difficulty}
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
                defaultValue={editingTopic?.description}
                placeholder="请详细描述课题的研究内容、目标等"
                className="mt-2 min-h-24"
              />
            </div>
            <div>
              <Label htmlFor="topic-requirements">学生要求</Label>
              <Textarea
                id="topic-requirements"
                defaultValue={editingTopic?.requirements}
                placeholder="请说明对学生的技能要求、前置知识等"
                className="mt-2 min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="max-students">可选学生数</Label>
              <Input
                id="max-students"
                type="number"
                defaultValue={editingTopic?.maxStudents || 1}
                min={1}
                max={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              {editingTopic ? '保存修改' : '发布课题'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
