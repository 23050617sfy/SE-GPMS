import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GraduationCap } from 'lucide-react';
import { apiFetch } from '../utils/api';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (role: 'student' | 'teacher' | 'admin') => {
    console.log('Login button clicked', { role, email });
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login/', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ identifier: email, password }),
      });

      // res: { token, user: { student_id, email, role } }
      const serverRole = (res.user.role || '') as 'student' | 'teacher' | 'admin';
      if (serverRole !== role) {
        setError('所选角色与账户角色不匹配。');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.token);
      const user = {
        id: res.user.student_id || res.user.id || res.user.email || '',
        name: res.user.name || res.user.email || res.user.student_id || '',
        role: serverRole,
        email: res.user.email || '',
      };
      onLogin(user);
    } catch (err: any) {
      console.error('login error', err);
      // Normalize backend error payloads into a user-friendly string
      const payload = err?.data;
      let message = '登录失败';
      if (!payload) {
        message = '登录失败';
      } else if (typeof payload === 'string') {
        message = payload;
      } else if (payload.detail && typeof payload.detail === 'string') {
        message = payload.detail;
      } else if (typeof payload === 'object') {
        // payload may be like { identifier: ['This field is required'] } or { non_field_errors: ['Invalid credentials'] }
        const values = Object.values(payload).flat();
        if (values.length > 0) {
          message = String(values[0]);
        }
      }

      if (message.toLowerCase().includes('invalid')) {
        setError('请核对您的账户与密码');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '登录中...' : '登录'}
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '登录中...' : '登录'}
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '登录中...' : '登录'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
