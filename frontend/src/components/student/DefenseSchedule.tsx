import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Clock, MapPin, Users, FileText, AlertCircle } from 'lucide-react';

export function DefenseSchedule() {
  const defenseInfo = {
    scheduled: false,
    date: '2025-06-15',
    time: '14:00-14:30',
    location: '教学楼A201',
    committee: [
      { name: '张教授', role: '答辩主席' },
      { name: '王老师', role: '答辩委员' },
      { name: '刘老师', role: '答辩委员' },
      { name: '李老师', role: '答辩秘书' },
    ],
    group: '第3组',
    order: 5,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>答辩安排</CardTitle>
          <CardDescription>查看您的毕业论文答辩时间和地点</CardDescription>
        </CardHeader>
        <CardContent>
          {!defenseInfo.scheduled ? (
            <div className="text-center py-12">
              <Calendar className="size-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">答辩时间待安排</h3>
              <p className="text-gray-600">
                答辩时间将在论文终稿通过后统一安排，请耐心等待通知
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-600">已安排</Badge>
                  <span>答辩{defenseInfo.group}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">答辩日期</p>
                      <p className="mt-1">{defenseInfo.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">答辩时间</p>
                      <p className="mt-1">{defenseInfo.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">答辩地点</p>
                      <p className="mt-1">{defenseInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">答辩顺序</p>
                      <p className="mt-1">第{defenseInfo.order}位</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">答辩委员会</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {defenseInfo.committee.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Users className="size-4 text-blue-600" />
                          </div>
                          <span>{member.name}</span>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>答辩准备事项</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="mb-2">答辩前准备清单：</p>
                <ul className="space-y-2 list-disc list-inside text-gray-700">
                  <li>准备答辩PPT（建议15-20页，时间控制在10-15分钟）</li>
                  <li>准备论文纸质版3份（需导师签字）</li>
                  <li>熟悉论文内容，准备回答可能的提问</li>
                  <li>提前15分钟到达答辩地点</li>
                  <li>着装得体，准备好学生证等证件</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>答辩流程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: '1', title: '自述环节', desc: '10-15分钟，陈述论文主要内容和创新点', time: '10-15分钟' },
              { step: '2', title: '提问环节', desc: '答辩委员针对论文提问', time: '10分钟' },
              { step: '3', title: '回答问题', desc: '学生回答委员提出的问题', time: '10分钟' },
              { step: '4', title: '评议打分', desc: '答辩委员会评议并给出成绩', time: '5分钟' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4>{item.title}</h4>
                    <Badge variant="outline">{item.time}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
