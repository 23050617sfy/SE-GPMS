from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.utils import timezone
from users.models import Profile, Topic, TopicSelection, Proposal, ProposalReview, MidtermCheck, MidtermReview, Thesis, ThesisReview
import random


def pdf_bytes(title: str) -> bytes:
    # Minimal PDF bytes; enough for testing file uploads
    content = f"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n1 0 obj<<>>endobj\n2 0 obj<<>>endobj\n3 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n4 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>/MediaBox[0 0 200 200]/Contents 5 0 R>>endobj\n5 0 obj<</Length 44>>stream\nBT /F1 12 Tf 10 180 Td (" + title + ") Tj ET\nendstream\nendobj\ntrailer<</Root 3 0 R>>\n%%EOF"
    return content.encode('utf-8', errors='ignore')


class Command(BaseCommand):
    help = 'Seed demo data: teachers, topics, selections, and student submissions with reviews.'

    def handle(self, *args, **options):
        password = 'miku1314'

        # 1) Ensure students 10000-10009 exist
        student_names = ['张明','李芯','王钰','刘诗','陈梦','杨音','黄岚','吴优','周晴','徐悦']
        students = []
        for i in range(10):
            sid = f"1000{i}"
            email = f"{sid}@mail.com"
            name = student_names[i]
            user, created = User.objects.get_or_create(username=sid, defaults={
                'email': email,
                'first_name': name,
            })
            if created:
                user.set_password(password)
                user.save()
            # ensure role
            if hasattr(user, 'profile'):
                if user.profile.role != 'student':
                    user.profile.role = 'student'
                    user.profile.save()
            students.append(user)
            self.stdout.write(self.style.SUCCESS(f"学生: {sid} - {name} - {email}{' (新建)' if created else ''}"))

        # 2) Create teachers 20000-20002
        teacher_names = ['赵衡','钱武','孙策']
        teachers = []
        for i in range(3):
            tid = f"2000{i}"
            email = f"{tid}@mail.com"
            name = teacher_names[i]
            user, created = User.objects.get_or_create(username=tid, defaults={
                'email': email,
                'first_name': name,
            })
            if created:
                user.set_password(password)
                user.save()
            # ensure role
            if hasattr(user, 'profile'):
                if user.profile.role != 'teacher':
                    user.profile.role = 'teacher'
                    user.profile.save()
            teachers.append(user)
            self.stdout.write(self.style.SUCCESS(f"教师: {tid} - {name} - {email}{' (新建)' if created else ''}"))

        # 3) Create topics for teachers (2 each)
        sample_topics = [
            ("智能问答系统设计", '系统设计', '中等'),
            ("深度学习图像分类", '算法设计', '较难'),
            ("校园二手交易平台", '应用研究', '较易'),
            ("图数据库与可视化", '理论研究', '中等'),
            ("推荐系统评测", '应用研究', '中等'),
            ("自然语言处理入门", '理论研究', '较易'),
        ]

        topics = []
        topic_idx = 0
        for t in teachers:
            for _ in range(2):
                title, ttype, diff = sample_topics[topic_idx % len(sample_topics)]
                topic_idx += 1
                topic = Topic.objects.create(
                    teacher=t,
                    title=title,
                    type=ttype,
                    difficulty=diff,
                    max_students=3,
                    description=f"{title} 的研究与实现",
                    requirements="具备基础编程能力，认真负责",
                )
                topics.append(topic)
                self.stdout.write(self.style.SUCCESS(f"课题: {topic.title} by {t.username}"))

        # 4) Assign students to topics (round-robin)
        for idx, s in enumerate(students):
            topic = topics[idx % len(topics)]
            TopicSelection.objects.get_or_create(topic=topic, student=s)
        # update selected_students counts
        for topic in topics:
            count = TopicSelection.objects.filter(topic=topic).count()
            if topic.selected_students != count:
                topic.selected_students = count
                topic.save(update_fields=['selected_students'])
            self.stdout.write(self.style.WARNING(f"课题 {topic.title} 已选人数: {topic.selected_students}/{topic.max_students}"))

        # 5) For each student, strictly progress only if previous stage PASSED
        for idx, s in enumerate(students):
            reviewer = teachers[idx % len(teachers)]

            # helper to derive a stable score per student and stage
            def stable_score(base: int, span: int) -> int:
                rnd = (int(s.username) * 31 + base) % span
                return base + rnd % span

            progressed = True

            # Proposal (必须通过才能进入中期)
            if progressed:
                p = Proposal.objects.create(student=s, title='开题报告')
                p.file.save(f"proposal_{s.username}.pdf", ContentFile(pdf_bytes(f"Proposal {s.username}")))
                p.save()
                pr = ProposalReview.objects.create(
                    proposal=p,
                    reviewer=reviewer,
                    feedback="选题方向明确，建议补充相关工作综述。",
                    score=max(80, stable_score(82, 15)),
                    result='pass',
                )
                progressed = pr.result == 'pass'

            # Midterm (必须通过才能进入论文一审)
            if progressed:
                m = MidtermCheck.objects.create(student=s, title='中期检查')
                m.file.save(f"midterm_{s.username}.pdf", ContentFile(pdf_bytes(f"Midterm {s.username}")))
                m.save()
                mr = MidtermReview.objects.create(
                    midterm=m,
                    reviewer=reviewer,
                    feedback="进度良好，后续关注实验复现细节。",
                    score=max(80, stable_score(85, 12)),
                    result='pass',
                )
                progressed = mr.result == 'pass'

            # Thesis - first review (必须通过才能进入二审)
            if progressed:
                th1 = Thesis.objects.create(
                    student=s,
                    title=f"毕业论文（初稿） - {s.username}",
                    version='v1',
                    status='first_review',
                    stage='first_review',
                )
                th1.file.save(f"thesis_first_{s.username}.pdf", ContentFile(pdf_bytes(f"Thesis First {s.username}")))
                th1.save()
                tr1 = ThesisReview.objects.create(
                    thesis=th1,
                    reviewer=reviewer,
                    stage='first_review',
                    feedback="初稿结构完整，部分章节需补充实验数据。",
                    score=max(78, stable_score(83, 14)),
                    result='pass',
                )
                progressed = tr1.result == 'pass'

            # Thesis - second review (必须通过才能进入终稿)
            if progressed:
                th2 = Thesis.objects.create(
                    student=s,
                    title=f"毕业论文（二审稿） - {s.username}",
                    version='v2',
                    status='second_review',
                    stage='second_review',
                )
                th2.file.save(f"thesis_second_{s.username}.pdf", ContentFile(pdf_bytes(f"Thesis Second {s.username}")))
                th2.save()
                tr2 = ThesisReview.objects.create(
                    thesis=th2,
                    reviewer=reviewer,
                    stage='second_review',
                    feedback="二审修订较好，语言表达进一步润色。",
                    score=max(80, stable_score(86, 10)),
                    result='pass',
                )
                progressed = tr2.result == 'pass'

            # Thesis - final submission（仅当二审通过）
            if progressed:
                thf = Thesis.objects.create(
                    student=s,
                    title=f"毕业论文（终稿） - {s.username}",
                    version='v3',
                    status='final',
                    stage='final_submission',
                )
                thf.file.save(f"thesis_final_{s.username}.pdf", ContentFile(pdf_bytes(f"Thesis Final {s.username}")))
                thf.save()

        self.stdout.write(self.style.SUCCESS("\nDemo 数据生成完成（严格阶段门控）：教师、课题、选题、开题/中期/论文阶段均已按通过结果逐步创建。"))
