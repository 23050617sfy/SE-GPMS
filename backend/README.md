# Backend (Django) — 最小示例

说明：此目录提供一个最小的 Django 后端骨架，包含注册与登录的 REST API（基于 Token）。

安装依赖（建议在虚拟环境中执行）：

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

初始化并运行：

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser  # 可选，用于 admin
python manage.py seed_demo_data	  # 可选，用于 导入测试数据
python manage.py runserver 0.0.0.0:8000
```

API:
- `POST /api/auth/register/`  body: `{ "student_id": "学工号", "email": "a@b.com", "role": "student|teacher|admin", "password": "..." }` 返回 token 与用户信息
- `POST /api/auth/login/` body: `{ "identifier": "学工号或邮箱", "password": "..." }` 返回 token 与用户信息
 - 论文提交：
	 - 学生提交：`POST /api/auth/thesis/submit/` (multipart form: `title`, `file`, `stage`, `version`)
	 - 学生历史：`GET /api/auth/thesis/my-thesis/`
	 - 教师查看全部：`GET /api/auth/thesis/all-theses/`
	 - 教师评审：`POST /api/auth/thesis/{thesis_id}/review/` body: `{ score, feedback, result: pass|fail|revise, stage }`
 - 开题提交与评审：
	 - 学生提交：`POST /api/auth/proposal/submit/` (multipart form: `title`, `file`)
	 - 学生历史：`GET /api/auth/proposal/my-proposals/`
	 - 教师查看全部：`GET /api/auth/proposal/all-proposals/`
	 - 教师评审：`POST /api/auth/proposal/{proposal_id}/review/` body: `{ score, feedback, result: pass|fail|revise }`
 - 中期提交与评审：
	 - 学生提交：`POST /api/auth/midterm/submit/` (multipart form: `title`, `file`)
	 - 学生历史：`GET /api/auth/midterm/my-midterms/`
	 - 教师查看全部：`GET /api/auth/midterm/all-midterms/`
	 - 教师评审：`POST /api/auth/midterm/{midterm_id}/review/` body: `{ score, feedback, result: pass|fail|revise }`

说明：
- 学工号被保存在 `User.username` 字段中，`Profile.role` 保存角色。
- 这是一个开发样例；生产环境请做好安全设置、SECRET_KEY 管理、CORS 配置、以及使用 HTTPS。 
