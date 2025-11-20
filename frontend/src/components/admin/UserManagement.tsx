import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Plus, Edit, Trash2, Download, Upload } from 'lucide-react';

const mockStudents = [
  { id: '1', name: '张三', studentId: '20210101', major: '计算机科学与技术', email: 'zhangsan@student.edu.cn', status: '在读' },
  { id: '2', name: '李四', studentId: '20210102', major: '软件工程', email: 'lisi@student.edu.cn', status: '在读' },
  { id: '3', name: '王五', studentId: '20210103', major: '网络工程', email: 'wangwu@student.edu.cn', status: '在读' },
];

const mockTeachers = [
  { id: '1', name: '李老师', teacherId: 'T001', department: '计算机学院', title: '副教授', email: 'li@teacher.edu.cn' },
  { id: '2', name: '王老师', teacherId: 'T002', department: '计算机学院', title: '讲师', email: 'wang@teacher.edu.cn' },
  { id: '3', name: '张老师', teacherId: 'T003', department: '物联网学院', title: '教授', email: 'zhang@teacher.edu.cn' },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>用户管理</CardTitle>
          <CardDescription>管理系统中的学生和教师账号</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList>
              <TabsTrigger value="students">学生管理</TabsTrigger>
              <TabsTrigger value="teachers">教师管理</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="搜索学生姓名或学号..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Upload className="size-4 mr-2" />
                  批量导入
                </Button>
                <Button>
                  <Plus className="size-4 mr-2" />
                  添加学生
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm">学号</th>
                      <th className="px-4 py-3 text-left text-sm">姓名</th>
                      <th className="px-4 py-3 text-left text-sm">专业</th>
                      <th className="px-4 py-3 text-left text-sm">邮箱</th>
                      <th className="px-4 py-3 text-left text-sm">状态</th>
                      <th className="px-4 py-3 text-left text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.map((student) => (
                      <tr key={student.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{student.studentId}</td>
                        <td className="px-4 py-3 text-sm">{student.name}</td>
                        <td className="px-4 py-3 text-sm">{student.major}</td>
                        <td className="px-4 py-3 text-sm">{student.email}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="secondary">{student.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">共 {mockStudents.length} 名学生</p>
                <Button variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  导出数据
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="teachers" className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="搜索教师姓名或工号..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Upload className="size-4 mr-2" />
                  批量导入
                </Button>
                <Button>
                  <Plus className="size-4 mr-2" />
                  添加教师
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm">工号</th>
                      <th className="px-4 py-3 text-left text-sm">姓名</th>
                      <th className="px-4 py-3 text-left text-sm">学院</th>
                      <th className="px-4 py-3 text-left text-sm">职称</th>
                      <th className="px-4 py-3 text-left text-sm">邮箱</th>
                      <th className="px-4 py-3 text-left text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTeachers.map((teacher) => (
                      <tr key={teacher.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{teacher.teacherId}</td>
                        <td className="px-4 py-3 text-sm">{teacher.name}</td>
                        <td className="px-4 py-3 text-sm">{teacher.department}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline">{teacher.title}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{teacher.email}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">共 {mockTeachers.length} 名教师</p>
                <Button variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  导出数据
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}