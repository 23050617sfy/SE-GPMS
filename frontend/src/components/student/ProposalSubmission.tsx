import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Upload, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';

export function ProposalSubmission() {
  const [file, setFile] = useState<File | null>(null);

  const proposalStatus = {
    submitted: true,
    reviewed: true,
    approved: true,
    score: 85,
    feedback: '开题报告内容充实，研究方案可行，文献综述较为全面。建议在研究方法部分增加更多技术细节。',
    reviewDate: '2025-04-20',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>开题报告</CardTitle>
              <CardDescription>提交您的毕业论文开题报告</CardDescription>
            </div>
            {proposalStatus.submitted && (
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
                <p className="text-blue-900 mb-2">开题报告要求：</p>
                <ul className="space-y-1 text-blue-800 list-disc list-inside">
                  <li>字数不少于3000字</li>
                  <li>包含研究背景、研究意义、研究方案、文献综述等内容</li>
                  <li>格式要求：PDF或Word文档</li>
                  <li>提交截止时间：2025-04-15</li>
                </ul>
              </div>
            </div>
          </div>

          {proposalStatus.submitted && proposalStatus.reviewed && (
            <Card className={proposalStatus.approved ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {proposalStatus.approved ? (
                    <>
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>审核通过</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-5 text-orange-600" />
                      <span>需要修改</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>评分</Label>
                  <p className="text-2xl mt-1">{proposalStatus.score}分</p>
                </div>
                <div>
                  <Label>指导教师反馈</Label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-white rounded border">
                    {proposalStatus.feedback}
                  </p>
                </div>
                <div>
                  <Label>审核时间</Label>
                  <p className="text-sm text-gray-600 mt-1">{proposalStatus.reviewDate}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <Label>课题名称</Label>
              <Input
                value="基于深度学习的图像识别系统研究"
                disabled
                className="mt-2"
              />
            </div>

            <div>
              <Label>指导教师</Label>
              <Input
                value="李老师"
                disabled
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="proposal-file">上传开题报告</Label>
              <div className="mt-2 flex gap-3">
                <div className="flex-1">
                  <Input
                    id="proposal-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button disabled={proposalStatus.approved}>
                  <Upload className="size-4 mr-2" />
                  {proposalStatus.submitted ? '重新上传' : '上传'}
                </Button>
              </div>
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  已选择文件：{file.name}
                </p>
              )}
            </div>

            {proposalStatus.submitted && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="size-8 text-blue-600" />
                      <div>
                        <p>开题报告_张三_20210101.pdf</p>
                        <p className="text-sm text-gray-500">提交时间：2025-04-10</p>
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

          <div>
            <Label htmlFor="remarks">备注说明</Label>
            <Textarea
              id="remarks"
              placeholder="如有需要，可以在此添加说明..."
              className="mt-2 min-h-24"
              disabled={proposalStatus.approved}
            />
          </div>

          {!proposalStatus.approved && (
            <Button className="w-full" size="lg">
              提交开题报告
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
