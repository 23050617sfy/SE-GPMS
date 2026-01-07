import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

interface ProgressStage {
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  message?: string;
  score?: number;
  reviewed_at?: string;
  submitted_at?: string;
  comments?: string;
  topic_title?: string;
  teacher_name?: string;
  selected_at?: string;
}

interface ProgressData {
  topic_selection: ProgressStage;
  proposal: ProgressStage;
  midterm: ProgressStage;
  first_review: ProgressStage;
  second_review: ProgressStage;
  final_submission: ProgressStage;
}

export function MyProgress() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch('/api/auth/progress/');
        setProgressData(data);
      } catch (err: any) {
        setError(err?.data?.detail || '无法加载进度信息');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!progressData) {
    return <div className="text-center py-8">暂无数据</div>;
  }

  const stages = [
    {
      id: 1,
      name: '选题',
      key: 'topic_selection',
      data: progressData.topic_selection,
    },
    {
      id: 2,
      name: '开题报告',
      key: 'proposal',
      data: progressData.proposal,
    },
    {
      id: 3,
      name: '中期检查',
      key: 'midterm',
      data: progressData.midterm,
    },
    {
      id: 4,
      name: '论文初稿（一审）',
      key: 'first_review',
      data: progressData.first_review,
    },
    {
      id: 5,
      name: '论文修改（二审）',
      key: 'second_review',
      data: progressData.second_review,
    },
    {
      id: 6,
      name: '论文终稿',
      key: 'final_submission',
      data: progressData.final_submission,
    },
  ];

  const completedStages = stages.filter(s => s.data.status === 'completed').length;
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

  const formatDateShort = (iso?: string) => {
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

  const getStageDescription = (stage: any) => {
    const data = stage.data;

    // 选题特殊处理
    if (stage.key === 'topic_selection') {
      if (data.status === 'completed') {
        return `已选择课题：${data.topic_title || ''}，指导教师：${data.teacher_name || ''}`;
      }
      return data.message || '尚未选题';
    }

    // 其他阶段统一处理
    if (data.status === 'completed') {
      return `已通过${data.score !== null && data.score !== undefined ? `，成绩：${data.score}分` : ''}`;
    } else if (data.status === 'in-progress') {
      return data.message || '进行中';
    } else if (data.status === 'failed') {
      return data.message || '未通过';
    }
    return data.message || '尚未开始';
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
                  {stages.filter(s => s.data.status === 'in-progress').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">进行中</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-gray-600">
                  {stages.filter(s => s.data.status === 'pending').length}
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
            {stages.map((stage, index) => {
              const data = stage.data;
              const timeInfo = data.reviewed_at || data.submitted_at || data.selected_at;

              return (
                <div key={stage.id} className="relative">
                  {index !== stages.length - 1 && (
                    <div
                      className={`absolute left-3 top-12 bottom-0 w-0.5 ${data.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                    />
                  )}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 relative z-10 bg-white">
                      {getStatusIcon(data.status)}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{stage.name}</h4>
                          {timeInfo && (
                            <p className="text-sm text-gray-500 mt-1">
                              {data.reviewed_at && '完成时间：'}
                              {data.submitted_at && !data.reviewed_at && '提交时间：'}
                              {data.selected_at && '选题时间：'}
                              {formatDateShort(timeInfo)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {data.score !== null && data.score !== undefined && (
                            <Badge variant="outline">{data.score}分</Badge>
                          )}
                          {getStatusBadge(data.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{getStageDescription(stage)}</p>
                      {data.comments && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <p className="text-gray-500 mb-1">教师评语：</p>
                          <p className="text-gray-700">{data.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 提示信息 */}
      {stages.some(s => s.data.status === 'in-progress' || s.data.status === 'failed') && (
        <Card>
          <CardHeader>
            <CardTitle>重要提醒</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stages.map(stage => {
                const data = stage.data;
                if (data.status === 'in-progress' && data.message?.includes('修改')) {
                  return (
                    <div key={stage.id} className="flex gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                      <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-yellow-900 mb-1">{stage.name}需要修改：</p>
                        <p className="text-yellow-800">{data.comments || '请根据导师反馈意见修改'}</p>
                      </div>
                    </div>
                  );
                } else if (data.status === 'failed') {
                  return (
                    <div key={stage.id} className="flex gap-3 p-3 bg-red-50 border-l-4 border-red-600 rounded">
                      <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-red-900 mb-1">{stage.name}未通过：</p>
                        <p className="text-red-800">{data.comments || '请联系导师了解详情'}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}