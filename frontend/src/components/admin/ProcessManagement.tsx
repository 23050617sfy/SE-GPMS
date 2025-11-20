import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export function ProcessManagement() {
  const processStages = [
    {
      id: 1,
      name: '课题申报',
      startDate: '2025-03-01',
      endDate: '2025-03-20',
      status: 'completed',
      teacherSubmitted: 45,
      teacherTotal: 45,
      topicsSubmitted: 287,
    },
    {
      id: 2,
      name: '学生选题',
      startDate: '2025-03-10',
      endDate: '2025-03-25',
      status: 'completed',
      studentsSelected: 342,
      studentsTotal: 342,
    },
    {
      id: 3,
      name: '开题报告',
      startDate: '2025-03-26',
      endDate: '2025-04-15',
      status: 'completed',
      submitted: 342,
      reviewed: 342,
      passed: 315,
      total: 342,
    },
    {
      id: 4,
      name: '中期检查',
      startDate: '2025-04-16',
      endDate: '2025-04-25',
      status: 'completed',
      submitted: 342,
      reviewed: 342,
      passed: 338,
      total: 342,
    },
    {
      id: 5,
      name: '论文一审',
      startDate: '2025-04-26',
      endDate: '2025-05-15',
      status: 'completed',
      submitted: 315,
      reviewed: 315,
      passed: 298,
      total: 342,
    },
    {
      id: 6,
      name: '论文二审',
      startDate: '2025-05-16',
      endDate: '2025-05-28',
      status: 'in-progress',
      submitted: 245,
      reviewed: 156,
      passed: 120,
      total: 298,
    },
    {
      id: 7,
      name: '论文终稿',
      startDate: '2025-05-29',
      endDate: '2025-05-30',
      status: 'pending',
      submitted: 0,
      total: 342,
    },
    {
      id: 8,
      name: '论文答辩',
      startDate: '2025-06-10',
      endDate: '2025-06-20',
      status: 'pending',
      scheduled: 0,
      completed: 0,
      total: 342,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="size-3 mr-1" />
            已完成
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-blue-600">
            <Clock className="size-3 mr-1" />
            进行中
          </Badge>
        );
      case 'pending':
        return <Badge variant="secondary">待开始</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>流程管理</CardTitle>
          <CardDescription>监控和管理毕业论文各个阶段的进度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {processStages.map((stage, index) => (
              <div key={stage.id} className="relative">
                {index !== processStages.length - 1 && (
                  <div
                    className={`absolute left-3 top-16 bottom-0 w-0.5 ${
                      stage.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="flex-shrink-0 relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              stage.status === 'completed'
                                ? 'bg-green-600'
                                : stage.status === 'in-progress'
                                ? 'bg-blue-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            <span className="text-white text-sm">{stage.id}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{stage.name}</CardTitle>
                            {getStatusBadge(stage.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {stage.startDate} 至 {stage.endDate}
                          </p>
                        </div>
                      </div>
                      {stage.status === 'in-progress' && (
                        <Button size="sm">管理阶段</Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {stage.name === '课题申报' && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>教师参与率</span>
                            <span>
                              {stage.teacherSubmitted}/{stage.teacherTotal} (
                              {Math.round((stage.teacherSubmitted / stage.teacherTotal) * 100)}%)
                            </span>
                          </div>
                          <Progress
                            value={(stage.teacherSubmitted / stage.teacherTotal) * 100}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                          <div>
                            <p className="text-sm text-gray-600">课题总数</p>
                            <p className="text-2xl mt-1">{stage.topicsSubmitted}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">参与教师</p>
                            <p className="text-2xl mt-1">{stage.teacherSubmitted}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {stage.name === '学生选题' && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>选题完成率</span>
                            <span>
                              {stage.studentsSelected}/{stage.studentsTotal} (
                              {Math.round((stage.studentsSelected / stage.studentsTotal) * 100)}%)
                            </span>
                          </div>
                          <Progress
                            value={(stage.studentsSelected / stage.studentsTotal) * 100}
                          />
                        </div>
                      </div>
                    )}

                    {stage.name === '开题报告' && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>提交率</span>
                            <span>
                              {stage.submitted}/{stage.total} (
                              {Math.round((stage.submitted / stage.total) * 100)}%)
                            </span>
                          </div>
                          <Progress value={(stage.submitted / stage.total) * 100} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                          <div>
                            <p className="text-sm text-gray-600">已提交</p>
                            <p className="text-2xl mt-1">{stage.submitted}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">已审核</p>
                            <p className="text-2xl mt-1">{stage.reviewed}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">已通过</p>
                            <p className="text-2xl mt-1 text-green-600">{stage.passed}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {(stage.name === '中期检查' || stage.name === '论文一审' || stage.name === '论文二审') && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>提交率</span>
                            <span>
                              {stage.submitted}/{stage.total} (
                              {Math.round((stage.submitted / stage.total) * 100)}%)
                            </span>
                          </div>
                          <Progress value={(stage.submitted / stage.total) * 100} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                          <div>
                            <p className="text-sm text-gray-600">已提交</p>
                            <p className="text-2xl mt-1">{stage.submitted}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">已审核</p>
                            <p className="text-2xl mt-1">{stage.reviewed}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">已通过</p>
                            <p className="text-2xl mt-1 text-green-600">{stage.passed}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {stage.name === '论文终稿' && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>提交进度</span>
                            <span>
                              {stage.submitted}/{stage.total} (
                              {Math.round((stage.submitted / stage.total) * 100)}%)
                            </span>
                          </div>
                          <Progress value={(stage.submitted / stage.total) * 100} />
                        </div>
                      </div>
                    )}

                    {(stage.name === '论文初稿' || stage.name === '论文修改') && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>提交进度</span>
                            <span>
                              {stage.submitted}/{stage.total} (
                              {Math.round((stage.submitted / stage.total) * 100)}%)
                            </span>
                          </div>
                          <Progress value={(stage.submitted / stage.total) * 100} />
                        </div>
                      </div>
                    )}

                    {stage.name === '论文答辩' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">待安排</p>
                            <p className="text-2xl mt-1">{stage.total - stage.scheduled}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">已安排</p>
                            <p className="text-2xl mt-1">{stage.scheduled}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">已完成</p>
                            <p className="text-2xl mt-1 text-green-600">{stage.completed}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>流程控制</CardTitle>
          <CardDescription>管理当前流程状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4>当前阶段：论文二审</h4>
                  <p className="text-sm text-gray-600 mt-1">截止时间：2025-05-28</p>
                </div>
                <Badge className="bg-blue-600">进行中</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  延长截止时间
                </Button>
                <Button variant="outline" size="sm">
                  发送提醒通知
                </Button>
                <Button variant="outline" size="sm">
                  查看详情
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4>下一阶段：论文终稿</h4>
                  <p className="text-sm text-gray-600 mt-1">预计开始：2025-05-29</p>
                </div>
                <Button size="sm">准备启动</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}