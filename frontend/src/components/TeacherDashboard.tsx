import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GraduationCap, LogOut, FileText, Users, CheckCircle2, Calendar } from 'lucide-react';
import { TopicManagement } from './teacher/TopicManagement';
import { StudentManagement } from './teacher/StudentManagement';
import { ReviewCenter } from './teacher/ReviewCenter';
import { DefenseManagement } from './teacher/DefenseManagement';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
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
              <p className="text-sm text-gray-500">教师端</p>
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
            <TabsTrigger value="topics">课题管理</TabsTrigger>
            <TabsTrigger value="students">学生管理</TabsTrigger>
            <TabsTrigger value="reviews">审核评阅</TabsTrigger>
            <TabsTrigger value="defense">答辩管理</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">发布课题</CardTitle>
                  <FileText className="size-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">5</div>
                  <p className="text-xs text-muted-foreground">
                    3个已被选择
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">指导学生</CardTitle>
                  <Users className="size-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">8</div>
                  <p className="text-xs text-muted-foreground">
                    本学期指导人数
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">待审核</CardTitle>
                  <CheckCircle2 className="size-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">3</div>
                  <p className="text-xs text-muted-foreground">
                    开题报告+论文
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">答辩安排</CardTitle>
                  <Calendar className="size-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">2</div>
                  <p className="text-xs text-muted-foreground">
                    本周答辩场次
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>我的学生</CardTitle>
                <CardDescription>指导学生的论文进度概览</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: '张三', topic: '基于深度学习的图像识别系统研究', status: '论文审阅中', progress: 75 },
                    { name: '李四', topic: '电商平台推荐算法优化研究', status: '开题已通过', progress: 60 },
                    { name: '王五', topic: '区块链技术在供应链中的应用', status: '论文终稿', progress: 90 },
                    { name: '赵六', topic: '智能客服系统的设计与实现', status: '开题待审', progress: 45 },
                  ].map((student, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4>{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.topic}</p>
                        </div>
                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {student.status}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">完成进度</span>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>待处理事项</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 border-l-4 border-orange-600 rounded">
                    <p className="text-sm">
                      <span className="text-orange-600">[待审核]</span> 赵六的开题报告等待您的审核
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <p className="text-sm">
                      <span className="text-blue-600">[提醒]</span> 张三提交了论文修改稿，请查阅
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border-l-4 border-purple-600 rounded">
                    <p className="text-sm">
                      <span className="text-purple-600">[答辩]</span> 王五的答辩安排在本周五下午2:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <TopicManagement />
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewCenter />
          </TabsContent>

          <TabsContent value="defense">
            <DefenseManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
