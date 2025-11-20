import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ProposalReview } from './ProposalReview';
import { MidtermReview } from './MidtermReview';
import { ThesisReview } from './ThesisReview';

export function ReviewCenter() {
  return (
    <Tabs defaultValue="proposal" className="space-y-6">
      <TabsList>
        <TabsTrigger value="proposal">开题审核</TabsTrigger>
        <TabsTrigger value="midterm">中期检查</TabsTrigger>
        <TabsTrigger value="thesis">论文评审</TabsTrigger>
      </TabsList>

      <TabsContent value="proposal">
        <ProposalReview />
      </TabsContent>

      <TabsContent value="midterm">
        <MidtermReview />
      </TabsContent>

      <TabsContent value="thesis">
        <ThesisReview />
      </TabsContent>
    </Tabs>
  );
}
