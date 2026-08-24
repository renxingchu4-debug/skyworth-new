# SKYWORTH Learning Rewards Platform (New)

> 这是原站的独立副本（New Site）。原站仓库：`github.com/renxingchu4-debug/skyworth`。本副本用于独立部署一个新域名/标题的网站，品牌内容与功能保持不变。

## 部署

1. 在 GitHub 新建仓库（如 `skyworth-new`），推送本目录代码到 `main` 分支。
2. 在 Render 新建 Web Service，连接该新仓库。
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - 添加持久化磁盘：挂载路径 `/var/data`，至少 1GB
   - 添加环境变量：`DATA_DIR=/var/data`
   - 添加 Supabase 环境变量（值从原 Render 服务的 Environment 页面复制）：
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_KEY`
     - `SUPABASE_ANON_KEY`
   - > 注意：代码中不硬编码任何 Supabase 密钥，未配置环境变量时 Supabase 功能不可用。
3. 部署完成后新网站即上线，域名形如 `https://<service-name>.onrender.com/`。

## Local Run

Use the local server URL only:

```bash
/Users/crx/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.js
```

Then open:

```text
http://127.0.0.1:4173/
```

Do not switch between `file://.../index.html` and `http://127.0.0.1:4173/` for daily use. Browsers isolate IndexedDB and uploads by page origin, so `file://` data and `http://127.0.0.1` data are separate.

When this project is served by `server.js`, uploaded courses, videos, materials, sales images, point shop gift photos, users, records, and draw data are saved to:

```text
data/platform-data.json
```

On first load, the app tries to migrate any existing browser IndexedDB data into that server data file if the server file is empty.

For a public website that everyone can access and share the same saved uploads, deploy the Node server, not only the static HTML/CSS/JS files. A static host alone cannot persist uploads for all users. For production, replace this JSON file store with a real database and object/file storage.

## Implemented Features

- Learning module: upload a course title, video, material, question, and answer options.
- Learner quiz: learners enter their name, choose an answer, and submit.
- Sales record form: collect store, TV model, user name, and optional receipt upload.
- Lucky draw: submit the sales record, then spin the prize wheel.
- Draw dashboard: show the top 5 users by draw entries and gift winners from the last 7 days.
- Admin data: review courses, quiz attempts, sales records, and draw results.
- CSV export: export records from the admin page.
- Full backup/restore: migrate uploaded files and browser data between page origins.
- Server persistence: when using `server.js`, all app data is saved in `data/platform-data.json`.
- Local fallback: if the server API is unavailable, data is stored in this browser with IndexedDB when available, and falls back to browser storage for direct file opening.

## Suggested Next Steps for Production

- Add account login and separate admin/user permissions.
- Replace browser storage with a server database such as MySQL, PostgreSQL, or MongoDB.
- Store uploaded files in object storage such as S3, OSS, or COS.
- Add configurable questions, prize inventory, draw limits, and data access rules.
