import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, FileText, Download, MessageSquare, Clock } from 'lucide-react';

export function ThesisSubmission() {
  const versions = [
    {
      id: '1',
      version: '初稿',
      fileName: '毕业论文_初稿_张三.pdf',
      submitDate: '2025-05-10',
      status: '一审已通过',
      reviewStage: '一审',
      feedback: '论文结构完整，但第三章的实验部分需要补充更多数据。图表格式需要统一。',
      score: 78,
    },
    {
      id: '2',
      version: '修改稿',
      fileName: '毕业论文_修改稿_张三.pdf',
      submitDate: '2025-05-18',
      status: '二审中',
      reviewStage: '二审',
      feedback: null,
      score: null,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>论文提交</CardTitle>
          <CardDescription>提交您的毕业论文各版本文档，经过一审、二审后方可参加答辩</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <h4 className="mb-2">论文提交要求：</h4>
            <ul className="space-y-1 text-sm list-disc list-inside text-gray-700">
              <li>初稿提交截止时间：2025-05-10（进入一审）</li>
              <li>一审通过后修改，提交修改稿进入二审</li>
              <li>二审通过后提交终稿</li>
              <li>终稿提交截止时间：2025-05-30</li>
              <li>论文字数不少于12000字（不含代码和附录）</li>
              <li>格式要求：严格按照学校论文模板排版</li>
              <li>文件格式：PDF格式</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
            <h4 className="mb-2">论文审核流程：</h4>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-blue-600">初稿提交</Badge>
              <span>→</span>
              <Badge className="bg-green-600">一审</Badge>
              <span>→</span>
              <Badge className="bg-orange-600">修改后二审</Badge>
              <span>→</span>
              <Badge className="bg-purple-600">终稿</Badge>
              <span>→</span>
              <Badge className="bg-indigo-600">答辩</Badge>
            </div>
          </div>

          <Tabs defaultValue="submit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submit">提交论文</TabsTrigger>
              <TabsTrigger value="history">提交历史</TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="space-y-4">
              <div>
                <Label>论文题目</Label>
                <Input
                  value="基于深度学习的图像识别系统研究"
                  disabled
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="version">提交版本</Label>
                <select
                  id="version"
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                >
                  <option>初稿（一审）</option>
                  <option>修改稿（二审）</option>
                  <option>终稿</option>
                </select>
              </div>

              <div>
                <Label htmlFor="thesis-file">上传论文文件</Label>
                <div className="mt-2 flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="thesis-file"
                      type="file"
                      accept=".pdf"
                    />
                  </div>
                  <Button>
                    <Upload className="size-4 mr-2" />
                    上传
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  仅支持PDF格式，文件大小不超过20MB
                </p>
              </div>

              <div>
                <Label>查重报告（可选）</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept=".pdf"
                  />
                </div>
              </div>

              <Button className="w-full" size="lg">
                提交论文
              </Button>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {versions.map((version) => (
                <Card key={version.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-8 text-blue-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{version.version}</CardTitle>
                            <Badge variant="outline">{version.reviewStage}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            提交时间：{version.submitDate}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={version.status.includes('通过') ? 'default' : 'secondary'}
                        className={
                          version.status.includes('通过') 
                            ? 'bg-green-600' 
                            : version.status.includes('审中')
                            ? 'bg-blue-600'
                            : ''
                        }
                      >
                        {version.status === '审中' && <Clock className="size-3 mr-1" />}
                        {version.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">{version.fileName}</span>
                      <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" />
                        下载
                      </Button>
                    </div>

                    {version.feedback && (
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm mb-1">{version.reviewStage}审阅意见：</h4>
                            <p className="text-sm text-gray-700">{version.feedback}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {version.score !== null && (
                      <div>
                        <Label>{version.reviewStage}评分</Label>
                        <p className="text-2xl mt-1">{version.score}分</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}