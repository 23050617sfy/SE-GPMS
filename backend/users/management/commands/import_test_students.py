from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import Profile


class Command(BaseCommand):
    help = 'Import test student accounts'

    def handle(self, *args, **options):
        student_names = [
            '张明',
            '李芯',
            '王钰',
            '刘诗',
            '陈梦',
            '杨音',
            '黄岚',
            '吴优',
            '周晴',
            '徐悦',
        ]

        password = 'miku1314'
        created_count = 0
        skipped_count = 0

        for i in range(10):
            student_id = f'1000{i}'
            email = f'{student_id}@mail.com'
            name = student_names[i]

            # 检查用户是否已存在
            if User.objects.filter(username=student_id).exists():
                self.stdout.write(
                    self.style.WARNING(f'用户 {student_id} 已存在，跳过')
                )
                skipped_count += 1
                continue

            # 创建用户
            user = User.objects.create_user(
                username=student_id,
                email=email,
                password=password,
                first_name=name,
            )

            # 设置角色为学生
            user.profile.role = 'student'
            user.profile.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f'✓ 创建用户: {student_id} ({name}) - {email}'
                )
            )
            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'\n导入完成！创建: {created_count}, 跳过: {skipped_count}'
            )
        )
