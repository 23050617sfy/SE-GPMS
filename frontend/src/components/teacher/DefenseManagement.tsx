import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const mockDefenses = [
  {
    id: '1',
    date: '2025-06-15',
    time: '14:00-17:00',
    location: '教学楼A201',
    group: '第3组',
    role: '答辩委员',
    students: [
      { name: '王五', topic: '区块链技术在供应链中的应用', time: '14:00' },
      { name: '赵六', topic: '智能推荐算法在电商平台的应用研究', time: '14:30' },
      { name: '孙七', topic: '移动端社交应用的设计与实现', time: '15:00' },
    ],
  },
  {
    id: '2',
    date: '2025-06-16',
    time: '09:00-12:00',
    location: '教学楼A203',
    group: '第5组',
    role: '答辩主席',
    students: [
      { name: '周八', topic: '基于机器学习的股票预测系统', time: '09:00' },
      { name: '吴九', topic: '智能家居控制系统的设计', time: '09:30' },
    ],
  },
];

export function DefenseManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>答辩安排</CardTitle>
          <CardDescription>查看和管理答辩相关事宜</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDefenses.map((defense) => (
              <Card key={defense.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <CardTitle className="text-lg">答辩{defense.group}</CardTitle>
                        <Badge>{defense.role}</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-gray-600" />
                          <span>{defense.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-gray-600" />
                          <span>{defense.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-600" />
                          <span>{defense.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="size-4 text-gray-600" />
                      <h4 className="text-sm">答辩学生（{defense.students.length}人）</h4>
                    </div>
                    <div className="space-y-2">
                      {defense.students.map((student, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{student.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {student.time}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{student.topic}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>我的指导学生答辩</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4>张三</h4>
                  <p className="text-sm text-gray-600">基于深度学习的图像识别系统研究</p>
                </div>
                <Badge variant="secondary">待安排</Badge>
              </div>
              <p className="text-sm text-gray-500">
                论文状态：修改稿审阅中
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4>李四</h4>
                  <p className="text-sm text-gray-600">智能客服系统的设计与实现</p>
                </div>
                <Badge variant="secondary">待安排</Badge>
              </div>
              <p className="text-sm text-gray-500">
                论文状态：开题已通过
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
