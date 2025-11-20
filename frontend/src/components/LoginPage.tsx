import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GraduationCap } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  email: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: 'student' | 'teacher' | 'admin') => {
    // Mock login - in real app, this would validate credentials
    const mockUsers = {
      student: {
        id: '1',
        name: '张三',
        role: 'student' as const,
        email: 'zhangsan@student.edu.cn',
      },
      teacher: {
        id: '2',
        name: '李老师',
        role: 'teacher' as const,
        email: 'li@teacher.edu.cn',
      },
      admin: {
        id: '3',
        name: '管理员',
        role: 'admin' as const,
        email: 'admin@edu.cn',
      },
    };

    onLogin(mockUsers[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="size-8 text-white" />
            </div>
          </div>
          <CardTitle>毕业论文管理系统</CardTitle>
          <CardDescription>请选择您的角色登录</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">学生</TabsTrigger>
              <TabsTrigger value="teacher">教师</TabsTrigger>
              <TabsTrigger value="admin">管理员</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin('student');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="student-email">学号/邮箱</Label>
                  <Input
                    id="student-email"
                    type="text"
                    placeholder="输入学号或邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">密码</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="teacher">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin('teacher');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="teacher-email">工号/邮箱</Label>
                  <Input
                    id="teacher-email"
                    type="text"
                    placeholder="输入工号或邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">密码</Label>
                  <Input
                    id="teacher-password"
                    type="password"
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin('admin');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="admin-email">管理员账号</Label>
                  <Input
                    id="admin-email"
                    type="text"
                    placeholder="输入管理员账号"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">密码</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
