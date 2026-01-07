import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export function MyProgress() {
  const [theses, setTheses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stagesStatic = [
    { id: 1, name: '选题', status: 'completed', completedDate: null, description: '已选择课题并确认指导教师', score: null },
    { id: 2, name: '开题报告', status: 'completed', completedDate: null, description: '开题报告已通过审核', score: null },
    { id: 3, name: '中期检查', status: 'completed', completedDate: null, description: '中期检查已通过', score: null },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await apiFetch('/api/auth/thesis/my-thesis/');
        setTheses(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError(err?.data?.detail || '无法加载论文信息');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const computeStage = (stageKey: string, label: string) => {
    // default values
    let status = 'pending';
    let score: number | null = null;
    let completedDate: string | null = null;
    let description = '';

    if (!theses || theses.length === 0) {
      return { name: label, status, completedDate, description, score };
    }

    // 聚合所有论文记录的评审信息
    const allReviews: any[] = theses.flatMap((t) => Array.isArray(t.reviews) ? t.reviews : []);
    const reviewsOfStage = allReviews
      .filter((r) => r.stage === stageKey)
      .sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime());

    if (reviewsOfStage.length > 0) {
      // 优先使用最近的一条
      const latest = reviewsOfStage[0];
      score = latest.score;
      completedDate = latest.reviewed_at;
      if (latest.result === 'pass') {
        status = 'completed';
        description = `${label}已通过`;
      } else if (latest.result === 'revise') {
        status = 'in-progress';
        description = `${label}需修改`;
      } else if (latest.result === 'fail') {
        status = 'failed';
        description = `${label}未通过`;
      }
      return { name: label, status, completedDate, description, score };
    }

    // 无该阶段评审记录时：根据综合状态/当前阶段推断
    const latestThesis = theses[0]; // 后端按提交时间倒序
    const latestStatus: string = latestThesis?.status || '';
    const latestStage: string = latestThesis?.stage || '';

    if (stageKey === 'first_review') {
      // 如果任一论文状态已到达或超过一审通过
      if (theses.some((t) => t.status === 'first_pass')) {
        status = 'completed';
        description = `${label}已通过`;
      } else if (latestStage === stageKey) {
        status = 'in-progress';
        description = `${label}审阅中`;
      }
    } else if (stageKey === 'second_review') {
      if (theses.some((t) => t.status === 'second_pass')) {
        status = 'completed';
        description = `${label}已通过`;
      } else if (latestStage === stageKey) {
        status = 'in-progress';
        description = `${label}审阅中`;
      }
    } else if (stageKey === 'final_submission') {
      if (theses.some((t) => t.status === 'final')) {
        status = 'completed';
        description = `${label}已通过`;
      } else if (latestStage === stageKey) {
        status = 'in-progress';
        description = `${label}审阅中`;
      }
    }

    return { name: label, status, completedDate, description, score };
  };

  const stages = [
    ...stagesStatic,
    computeStage('first_review', '论文初稿（一审）'),
    computeStage('second_review', '论文修改（二审）'),
    computeStage('final_submission', '论文终稿'),
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
      case 'failed':
        return <AlertCircle className="size-6 text-red-600" />;
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
      case 'failed':
        return <Badge className="bg-red-600">不通过</Badge>;
      default:
        return <Badge variant="secondary">待开始</Badge>;
    }
  };

  const formatDateShort = (iso?: string | null) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hour = String(d.getHours()).padStart(2, '0');
      const minute = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    } catch (e) {
      return iso;
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
                    className={`absolute left-3 top-12 bottom-0 w-0.5 ${stage.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
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
                            {stage.name === '论文初稿（一审）' ? '通过时间：' : '完成时间：'}{formatDateShort(stage.completedDate)}
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