import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

export function MyProgress() {
  const stages = [
    {
      id: 1,
      name: '选题',
      status: 'completed',
      completedDate: '2025-03-15',
      description: '已选择课题并确认指导教师',
      score: null,
    },
    {
      id: 2,
      name: '开题报告',
      status: 'completed',
      completedDate: '2025-04-20',
      description: '开题报告已通过审核',
      score: 85,
    },
    {
      id: 3,
      name: '中期检查',
      status: 'completed',
      completedDate: '2025-04-28',
      description: '中期检查已通过',
      score: 88,
    },
    {
      id: 4,
      name: '论文初稿（一审）',
      status: 'completed',
      completedDate: '2025-05-10',
      description: '一审已通过',
      score: 78,
    },
    {
      id: 5,
      name: '论文修改（二审）',
      status: 'in-progress',
      completedDate: null,
      description: '二审审阅中',
      score: null,
    },
    {
      id: 6,
      name: '论文终稿',
      status: 'pending',
      completedDate: null,
      description: '等待二审通过后提交',
      score: null,
    },
    {
      id: 7,
      name: '论文答辩',
      status: 'pending',
      completedDate: null,
      description: '等待答辩安排',
      score: null,
    },
  ];

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const totalStages = stages.length;
  const progressPercent = (completedStages / totalStages) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="size-6 text-green-600" />;
      case 'in-progress':
        return <Clock className="size-6 text-blue-600" />;
      case 'pending':
        return <Circle className="size-6 text-gray-400" />;
      default:
        return <Circle className="size-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">已完成</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-600">进行中</Badge>;
      case 'pending':
        return <Badge variant="secondary">待开始</Badge>;
      default:
        return <Badge variant="secondary">待开始</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>整体进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>完成进度</span>
                <span className="text-2xl">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl text-green-600">{completedStages}</p>
                <p className="text-sm text-gray-600 mt-1">已完成</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-blue-600">
                  {stages.filter(s => s.status === 'in-progress').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">进行中</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-gray-600">
                  {stages.filter(s => s.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">待开始</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>各阶段详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div key={stage.id} className="relative">
                {index !== stages.length - 1 && (
                  <div
                    className={`absolute left-3 top-12 bottom-0 w-0.5 ${
                      stage.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 relative z-10 bg-white">
                    {getStatusIcon(stage.status)}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4>{stage.name}</h4>
                        {stage.completedDate && (
                          <p className="text-sm text-gray-500 mt-1">
                            完成时间：{stage.completedDate}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {stage.score !== null && (
                          <Badge variant="outline">{stage.score}分</Badge>
                        )}
                        {getStatusBadge(stage.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>重要提醒</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded">
              <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-900 mb-1">待完成事项：</p>
                <p className="text-yellow-800">根据导师反馈意见修改论文，并在5月30日前提交终稿</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}