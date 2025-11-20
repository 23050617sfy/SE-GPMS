import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Upload, FileText, CheckCircle2, AlertCircle, Download, MessageSquare } from 'lucide-react';

export function MidtermCheck() {
  const midtermStatus = {
    submitted: true,
    reviewed: true,
    passed: true,
    score: 88,
    feedback: '研究进展符合预期，已完成论文框架和部分章节。建议加快实验进度，补充更多实验数据。',
    reviewDate: '2025-04-28',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>中期检查</CardTitle>
              <CardDescription>提交您的毕业论文中期检查报告</CardDescription>
            </div>
            {midtermStatus.submitted && (
              <Badge className="bg-green-600">
                <CheckCircle2 className="size-3 mr-1" />
                已提交
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 mb-2">中期检查要求：</p>
                <ul className="space-y-1 text-blue-800 list-disc list-inside">
                  <li>汇报开题以来的工作进展</li>
                  <li>说明已完成的研究内容和取得的阶段性成果</li>
                  <li>列出存在的问题和困难</li>
                  <li>阐述下一步工作计划</li>
                  <li>提交截止时间：2025-04-25</li>
                </ul>
              </div>
            </div>
          </div>

          {midtermStatus.submitted && midtermStatus.reviewed && (
            <Card className={midtermStatus.passed ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {midtermStatus.passed ? (
                    <>
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>检查通过</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-5 text-orange-600" />
                      <span>需要改进</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>评分</Label>
                  <p className="text-2xl mt-1">{midtermStatus.score}分</p>
                </div>
                <div>
                  <Label>指导教师反馈</Label>
                  <div className="mt-2 p-4 bg-white rounded border">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{midtermStatus.feedback}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>审核时间</Label>
                  <p className="text-sm text-gray-600 mt-1">{midtermStatus.reviewDate}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <Label>论文题目</Label>
              <Input
                value="基于深度学习的图像识别系统研究"
                disabled
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="progress">工作进展描述</Label>
              <Textarea
                id="progress"
                placeholder="详细描述开题以来完成的工作内容..."
                className="mt-2 min-h-32"
                disabled={midtermStatus.passed}
                defaultValue={midtermStatus.submitted ? "1. 完成了文献综述和理论研究部分\n2. 搭建了深度学习模型框架\n3. 收集并整理了训练数据集\n4. 完成了初步的模型训练和测试" : ""}
              />
            </div>

            <div>
              <Label htmlFor="achievements">阶段性成果</Label>
              <Textarea
                id="achievements"
                placeholder="列出已取得的研究成果..."
                className="mt-2 min-h-24"
                disabled={midtermStatus.passed}
                defaultValue={midtermStatus.submitted ? "1. 论文框架已完成60%\n2. 实现了基础的图像识别模型\n3. 模型准确率达到75%" : ""}
              />
            </div>

            <div>
              <Label htmlFor="problems">存在问题</Label>
              <Textarea
                id="problems"
                placeholder="说明当前遇到的困难和问题..."
                className="mt-2 min-h-24"
                disabled={midtermStatus.passed}
                defaultValue={midtermStatus.submitted ? "1. 部分实验数据不足\n2. 模型优化还需进一步改进" : ""}
              />
            </div>

            <div>
              <Label htmlFor="next-plan">下一步计划</Label>
              <Textarea
                id="next-plan"
                placeholder="阐述接下来的工作安排..."
                className="mt-2 min-h-24"
                disabled={midtermStatus.passed}
                defaultValue={midtermStatus.submitted ? "1. 补充实验数据\n2. 优化模型算法\n3. 完成论文实验部分撰写\n4. 5月底前完成初稿" : ""}
              />
            </div>

            <div>
              <Label htmlFor="midterm-file">上传中期检查表（可选）</Label>
              <div className="mt-2 flex gap-3">
                <div className="flex-1">
                  <Input
                    id="midterm-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled={midtermStatus.passed}
                  />
                </div>
                <Button disabled={midtermStatus.passed}>
                  <Upload className="size-4 mr-2" />
                  上传
                </Button>
              </div>
            </div>

            {midtermStatus.submitted && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="size-8 text-blue-600" />
                      <div>
                        <p>中期检查表_张三_20210101.pdf</p>
                        <p className="text-sm text-gray-500">提交时间：2025-04-22</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="size-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {!midtermStatus.passed && (
            <Button className="w-full" size="lg">
              提交中期检查
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
