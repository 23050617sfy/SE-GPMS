import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart3, Download, TrendingUp, Users, FileText, Award } from 'lucide-react';

export function StatisticsReport() {
  const collegeStats = [
    {
      college: '计算机学院',
      students: 156,
      teachers: 18,
      topics: 132,
      proposalPassed: 150,
      thesisSubmitted: 120,
      defenseCompleted: 78,
      avgScore: 82.5,
    },
    {
      college: '软件学院',
      students: 98,
      teachers: 12,
      topics: 85,
      proposalPassed: 95,
      thesisSubmitted: 75,
      defenseCompleted: 45,
      avgScore: 81.2,
    },
    {
      college: '物联网学院',
      students: 88,
      teachers: 15,
      topics: 70,
      proposalPassed: 70,
      thesisSubmitted: 73,
      defenseCompleted: 33,
      avgScore: 80.8,
    },
  ];

  const topicTypeStats = [
    { type: '应用研究', count: 145, percentage: 50.5 },
    { type: '理论研究', count: 52, percentage: 18.1 },
    { type: '系统设计', count: 68, percentage: 23.7 },
    { type: '算法设计', count: 22, percentage: 7.7 },
  ];

  const scoreDistribution = [
    { range: '90-100分', count: 45, percentage: 28.8 },
    { range: '80-89分', count: 68, percentage: 43.6 },
    { range: '70-79分', count: 32, percentage: 20.5 },
    { range: '60-69分', count: 11, percentage: 7.1 },
    { range: '60分以下', count: 0, percentage: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">总体完成率</CardTitle>
            <TrendingUp className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">68.4%</div>
            <p className="text-xs text-muted-foreground mt-1">
              较去年同期 +5.2%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">平均分数</CardTitle>
            <Award className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">81.8</div>
            <p className="text-xs text-muted-foreground mt-1">
              开题报告平均分
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">优秀率</CardTitle>
            <BarChart3 className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">28.8%</div>
            <p className="text-xs text-muted-foreground mt-1">
              90分以上占比
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">及格率</CardTitle>
            <FileText className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">100%</div>
            <p className="text-xs text-muted-foreground mt-1">
              开题报告通过率
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>各学院统计</CardTitle>
              <CardDescription>各学院毕业论文进度和质量统计</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="size-4 mr-2" />
              导出报表
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">学院</th>
                  <th className="px-4 py-3 text-left text-sm">学生数</th>
                  <th className="px-4 py-3 text-left text-sm">指导教师</th>
                  <th className="px-4 py-3 text-left text-sm">课题数</th>
                  <th className="px-4 py-3 text-left text-sm">开题通过</th>
                  <th className="px-4 py-3 text-left text-sm">论文提交</th>
                  <th className="px-4 py-3 text-left text-sm">答辩完成</th>
                  <th className="px-4 py-3 text-left text-sm">平均分</th>
                </tr>
              </thead>
              <tbody>
                {collegeStats.map((college, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{college.college}</td>
                    <td className="px-4 py-3 text-sm">{college.students}</td>
                    <td className="px-4 py-3 text-sm">{college.teachers}</td>
                    <td className="px-4 py-3 text-sm">{college.topics}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">
                        {college.proposalPassed}/{college.students}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">
                        {college.thesisSubmitted}/{college.students}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">
                        {college.defenseCompleted}/{college.students}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{college.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>课题类型分布</CardTitle>
            <CardDescription>各类型课题数量统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topicTypeStats.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index],
                        }}
                      />
                      <span>{item.type}</span>
                    </div>
                    <span className="text-gray-600">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>成绩分布</CardTitle>
            <CardDescription>开题报告成绩分布情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>{item.range}</span>
                    <span className="text-gray-600">
                      {item.count} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        index === 0
                          ? 'bg-green-600'
                          : index === 1
                          ? 'bg-blue-600'
                          : index === 2
                          ? 'bg-orange-600'
                          : index === 3
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>教师指导情况</CardTitle>
          <CardDescription>指导学生数量最多的教师</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: '李教授', college: '计算机学院', students: 8, avgScore: 84.5 },
              { name: '王老师', college: '软件学院', students: 7, avgScore: 83.2 },
              { name: '张教授', college: '物联网学院', students: 6, avgScore: 82.8 },
              { name: '刘老师', college: '计算机学院', students: 6, avgScore: 81.5 },
              { name: '陈老师', college: '软件学院', students: 5, avgScore: 85.0 },
            ].map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p>{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.college}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">指导 {teacher.students} 人</p>
                  <p className="text-sm text-gray-600">平均分 {teacher.avgScore}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>导出报表</CardTitle>
          <CardDescription>下载各类统计报表</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start">
              <Download className="size-4 mr-2" />
              导出完整统计报表 (Excel)
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="size-4 mr-2" />
              导出学院统计报表 (PDF)
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="size-4 mr-2" />
              导出教师统计报表 (Excel)
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="size-4 mr-2" />
              导出学生成绩统计 (Excel)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
