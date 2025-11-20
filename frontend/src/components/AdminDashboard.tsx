import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GraduationCap, LogOut, Users, FileText, Calendar, Settings } from 'lucide-react';
import { SystemSettings } from './admin/SystemSettings';
import { UserManagement } from './admin/UserManagement';
import { ProcessManagement } from './admin/ProcessManagement';
import { StatisticsReport } from './admin/StatisticsReport';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="size-6 text-white" />
            </div>
            <div>
              <h1>毕业论文管理系统</h1>
              <p className="text-sm text-gray-500">管理员端</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p>{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="size-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="users">用户管理</TabsTrigger>
            <TabsTrigger value="process">流程管理</TabsTrigger>
            <TabsTrigger value="statistics">统计报表</TabsTrigger>
            <TabsTrigger value="settings">系统设置</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">学生总数</CardTitle>
                  <Users className="size-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">342</div>
                  <p className="text-xs text-muted-foreground">
                    2025届毕业生
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">指导教师</CardTitle>
                  <Users className="size-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">45</div>
                  <p className="text-xs text-muted-foreground">
                    参与指导教师数
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">课题数量</CardTitle>
                  <FileText className="size-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">287</div>
                  <p className="text-xs text-muted-foreground">
                    已发布课题
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">答辩场次</CardTitle>
                  <Calendar className="size-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">28</div>
                  <p className="text-xs text-muted-foreground">
                    已安排场次
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>各阶段进度统计</CardTitle>
                  <CardDescription>学生论文完成情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: '选题完成', count: 342, total: 342, percent: 100, color: 'bg-green-600' },
                      { stage: '开题通过', count: 315, total: 342, percent: 92, color: 'bg-blue-600' },
                      { stage: '论文提交', count: 268, total: 342, percent: 78, color: 'bg-orange-600' },
                      { stage: '答辩完成', count: 156, total: 342, percent: 46, color: 'bg-purple-600' },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>{item.stage}</span>
                          <span className="text-gray-600">
                            {item.count}/{item.total} ({item.percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>近期答辩安排</CardTitle>
                  <CardDescription>本周答辩时间表</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: '11月20日 周四', time: '09:00-12:00', location: '教学楼A201', count: 12 },
                      { date: '11月21日 周五', time: '14:00-17:00', location: '教学楼A203', count: 15 },
                      { date: '11月22日 周六', time: '09:00-12:00', location: '教学楼B101', count: 10 },
                      { date: '11月22日 周六', time: '14:00-17:00', location: '教学楼B102', count: 13 },
                    ].map((defense, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>{defense.date}</p>
                            <p className="text-sm text-gray-600">{defense.time} · {defense.location}</p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {defense.count}人
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>系统通知</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded">
                    <p className="text-sm">
                      <span className="text-red-600">[紧急]</span> 论文终稿提交截止时间临近，请提醒学生按时提交
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <p className="text-sm">
                      <span className="text-blue-600">[系统]</span> 答辩分组已完成，请通知相关教师和学生
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border-l-4 border-green-600 rounded">
                    <p className="text-sm">
                      <span className="text-green-600">[完成]</span> 本学期开题报告审核工作已全部完成
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="process">
            <ProcessManagement />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsReport />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
