import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, User, BookOpen, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

const mockTopics = [
  {
    id: '1',
    title: '基于深度学习的图像识别系统研究',
    teacher: '李老师',
    department: '计算机学院',
    type: '应用研究',
    difficulty: '中等',
    description: '研究深度学习在图像识别领域的应用，包括卷积神经网络、目标检测等技术。',
    requirements: '熟悉Python编程，了解机器学习基础知识。',
    available: true,
    selected: true,
  },
  {
    id: '2',
    title: '电商平台推荐算法优化研究',
    teacher: '王老师',
    department: '计算机学院',
    type: '算法设计',
    difficulty: '较难',
    description: '针对电商平台的个性化推荐系统进行算法优化研究。',
    requirements: '掌握数据结构与算法，有一定的数据分析能力。',
    available: true,
    selected: false,
  },
  {
    id: '3',
    title: '智能家居控制系统设计',
    teacher: '张老师',
    department: '物联网学院',
    type: '系统设计',
    difficulty: '中等',
    description: '设计并实现基于物联网技术的智能家居控制系统。',
    requirements: '了解物联网基础知识，熟悉嵌入式开发。',
    available: true,
    selected: false,
  },
  {
    id: '4',
    title: '区块链技术在供应链中的应用',
    teacher: '刘老师',
    department: '计算机学院',
    type: '应用研究',
    difficulty: '较难',
    description: '探索区块链技术在供应链管理中的应用场景和实现方法。',
    requirements: '了解区块链基本原理，有一定的软件开发经验。',
    available: false,
    selected: false,
  },
];

export function TopicSelection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<typeof mockTopics[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTopics = mockTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTopic = (topic: typeof mockTopics[0]) => {
    setSelectedTopic(topic);
    setDialogOpen(true);
  };

  const confirmSelection = () => {
    // In real app, this would make an API call
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>选择毕业论文课题</CardTitle>
          <CardDescription>浏览并选择您感兴趣的课题，每位学生只能选择一个课题</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="搜索课题或指导教师..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredTopics.map((topic) => (
          <Card key={topic.id} className={topic.selected ? 'border-green-500 bg-green-50' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    {topic.selected && (
                      <Badge className="bg-green-600">
                        <CheckCircle2 className="size-3 mr-1" />
                        已选择
                      </Badge>
                    )}
                    {!topic.available && (
                      <Badge variant="secondary">已满</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      <span>{topic.teacher}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="size-4" />
                      <span>{topic.department}</span>
                    </div>
                    <Badge variant="outline">{topic.type}</Badge>
                    <Badge variant="outline">难度: {topic.difficulty}</Badge>
                  </div>
                </div>
                {!topic.selected && topic.available && (
                  <Button onClick={() => handleSelectTopic(topic)}>选择课题</Button>
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
              您确定要选择这个课题吗？选择后将无法更改。
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
                <p>{selectedTopic.teacher}</p>
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
            <Button onClick={confirmSelection}>确认选择</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
