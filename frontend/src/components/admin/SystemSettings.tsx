import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Settings, Calendar, Bell, Database } from 'lucide-react';

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Calendar className="size-5" />
            <div>
              <CardTitle>时间节点设置</CardTitle>
              <CardDescription>设置毕业论文各阶段的时间节点</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic-start">课题申报开始时间</Label>
              <Input
                id="topic-start"
                type="date"
                defaultValue="2025-03-01"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="topic-end">课题申报结束时间</Label>
              <Input
                id="topic-end"
                type="date"
                defaultValue="2025-03-20"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="selection-start">学生选题开始时间</Label>
              <Input
                id="selection-start"
                type="date"
                defaultValue="2025-03-10"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="selection-end">学生选题结束时间</Label>
              <Input
                id="selection-end"
                type="date"
                defaultValue="2025-03-25"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="proposal-deadline">开题报告截止时间</Label>
              <Input
                id="proposal-deadline"
                type="date"
                defaultValue="2025-04-15"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="draft-deadline">论文初稿截止时间</Label>
              <Input
                id="draft-deadline"
                type="date"
                defaultValue="2025-05-10"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="final-deadline">论文终稿截止时间</Label>
              <Input
                id="final-deadline"
                type="date"
                defaultValue="2025-05-30"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="defense-period">答辩时间段</Label>
              <Input
                id="defense-period"
                type="text"
                defaultValue="2025-06-10 至 2025-06-20"
                className="mt-2"
              />
            </div>
          </div>
          <Button className="w-full md:w-auto">保存时间设置</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="size-5" />
            <div>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>配置系统通知和提醒</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p>课题申报提醒</p>
                <p className="text-sm text-gray-600">提前3天提醒教师申报课题</p>
              </div>
              <input type="checkbox" defaultChecked className="size-5" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p>选题截止提醒</p>
                <p className="text-sm text-gray-600">提前1周提醒学生完成选题</p>
              </div>
              <input type="checkbox" defaultChecked className="size-5" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p>提交截止提醒</p>
                <p className="text-sm text-gray-600">在各阶段截止前发送提醒</p>
              </div>
              <input type="checkbox" defaultChecked className="size-5" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p>审核完成通知</p>
                <p className="text-sm text-gray-600">导师审核后通知学生</p>
              </div>
              <input type="checkbox" defaultChecked className="size-5" />
            </div>
          </div>
          <Button className="w-full md:w-auto">保存通知设置</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="size-5" />
            <div>
              <CardTitle>系统参数</CardTitle>
              <CardDescription>配置系统基本参数</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-topics">教师最多发布课题数</Label>
              <Input
                id="max-topics"
                type="number"
                defaultValue="5"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="max-students">每个课题最多指导人数</Label>
              <Input
                id="max-students"
                type="number"
                defaultValue="1"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="proposal-min-score">开题报告及格分数</Label>
              <Input
                id="proposal-min-score"
                type="number"
                defaultValue="60"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="defense-duration">每位学生答辩时长（分钟）</Label>
              <Input
                id="defense-duration"
                type="number"
                defaultValue="30"
                className="mt-2"
              />
            </div>
          </div>
          <Button className="w-full md:w-auto">保存系统参数</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="size-5" />
            <div>
              <CardTitle>数据管理</CardTitle>
              <CardDescription>数据备份与清理</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p>数据备份</p>
                <p className="text-sm text-gray-600">最后备份时间：2025-11-19 23:00</p>
              </div>
              <Button variant="outline" size="sm">立即备份</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p>历史数据</p>
                <p className="text-sm text-gray-600">2024届毕业论文数据</p>
              </div>
              <Button variant="outline" size="sm">归档</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
