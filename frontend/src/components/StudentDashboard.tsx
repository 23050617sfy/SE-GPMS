import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  GraduationCap, 
  LogOut, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  Upload,
  Calendar,
  Award
} from 'lucide-react';
import { TopicSelection } from './student/TopicSelection';
import { ProposalSubmission } from './student/ProposalSubmission';
import { MidtermCheck } from './student/MidtermCheck';
import { ThesisSubmission } from './student/ThesisSubmission';
import { DefenseSchedule } from './student/DefenseSchedule';
import { MyProgress } from './student/MyProgress';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
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
              <p className="text-sm text-gray-500">学生端</p>
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
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="selection">选题</TabsTrigger>
            <TabsTrigger value="proposal">开题</TabsTrigger>
            <TabsTrigger value="midterm">中期检查</TabsTrigger>
            <TabsTrigger value="thesis">论文提交</TabsTrigger>
            <TabsTrigger value="progress">我的进度</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">选题状态</CardTitle>
                  <BookOpen className="size-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">已完成</div>
                  <p className="text-xs text-muted-foreground">
                    指导教师：李老师
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">开题报告</CardTitle>
                  <FileText className="size-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">已通过</div>
                  <p className="text-xs text-muted-foreground">
                    评分：85分
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">论文状态</CardTitle>
                  <Upload className="size-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">审阅中</div>
                  <p className="text-xs text-muted-foreground">
                    已提交初稿
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">答辩安排</CardTitle>
                  <Calendar className="size-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">待安排</div>
                  <p className="text-xs text-muted-foreground">
                    预计6月中旬
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>论文进度时间线</CardTitle>
                <CardDescription>您的毕业论文各阶段完成情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="size-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4>课题选择</h4>
                        <span className="text-sm text-gray-500">2025-03-15</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        已选择课题《基于深度学习的图像识别系统研究》，指导教师：李老师
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="size-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4>开题报告</h4>
                        <span className="text-sm text-gray-500">2025-04-20</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        开题报告已通过审核，评分：85分
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="size-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4>中期检查</h4>
                        <span className="text-sm text-gray-500">2025-04-28</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        中期检查已通过，评分：88分
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="size-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4>论文撰写</h4>
                        <span className="text-sm text-gray-500">进行中</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        一审已通过（78分），修改稿正在二审中
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Calendar className="size-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4>论文答辩</h4>
                        <span className="text-sm text-gray-500">待安排</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        等待论文终稿通过后安排答辩时间
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>重要通知</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <p className="text-sm">
                      <span className="text-blue-600">[提醒]</span> 论文终稿提交截止时间：2025-05-30
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                    <p className="text-sm">
                      <span className="text-yellow-600">[重要]</span> 请注意查收导师对您论文初稿的反馈意见
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="selection">
            <TopicSelection />
          </TabsContent>

          <TabsContent value="proposal">
            <ProposalSubmission />
          </TabsContent>

          <TabsContent value="midterm">
            <MidtermCheck />
          </TabsContent>

          <TabsContent value="thesis">
            <ThesisSubmission />
          </TabsContent>

          <TabsContent value="defense">
            <DefenseSchedule />
          </TabsContent>

          <TabsContent value="progress">
            <MyProgress />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
