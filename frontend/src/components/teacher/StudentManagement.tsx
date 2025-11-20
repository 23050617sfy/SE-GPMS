import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { User, Mail, Phone, FileText, MessageSquare } from 'lucide-react';

const mockStudents = [
  {
    id: '1',
    name: '张三',
    studentId: '20210101',
    major: '计算机科学与技术',
    email: 'zhangsan@student.edu.cn',
    phone: '138****1234',
    topic: '基于深度学习的图像识别系统研究',
    progress: 75,
    currentStage: '论文修改中',
    proposalScore: 85,
    thesisSubmitted: true,
    defenseScheduled: false,
  },
  {
    id: '2',
    name: '李四',
    studentId: '20210102',
    major: '软件工程',
    email: 'lisi@student.edu.cn',
    phone: '139****5678',
    topic: '智能客服系统的设计与实现',
    progress: 60,
    currentStage: '开题已通过',
    proposalScore: 88,
    thesisSubmitted: false,
    defenseScheduled: false,
  },
];

export function StudentManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>指导学生</CardTitle>
          <CardDescription>管理您指导的学生及其论文进度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockStudents.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <User className="size-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{student.name}</CardTitle>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>{student.studentId} · {student.major}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Mail className="size-3" />
                              <span>{student.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="size-3" />
                              <span>{student.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge>{student.currentStage}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm mb-2">论文题目：</h4>
                    <p className="text-sm text-gray-700">{student.topic}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>完成进度</span>
                      <span>{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">开题报告</p>
                      {student.proposalScore ? (
                        <p className="text-lg mt-1">{student.proposalScore}分</p>
                      ) : (
                        <Badge variant="secondary" className="mt-1">未评分</Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">论文状态</p>
                      <Badge
                        variant={student.thesisSubmitted ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {student.thesisSubmitted ? '已提交' : '未提交'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">答辩安排</p>
                      <Badge
                        variant={student.defenseScheduled ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {student.defenseScheduled ? '已安排' : '待安排'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <FileText className="size-4 mr-2" />
                      查看材料
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="size-4 mr-2" />
                      发送消息
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
