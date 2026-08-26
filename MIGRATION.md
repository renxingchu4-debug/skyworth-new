# Panasonic Learning Center 迁移与接管说明

本项目代码已经在 GitHub 仓库中：

- 仓库：`https://github.com/renxingchu4-debug/skyworth-new.git`
- 分支：`main`
- Render 服务：`skyworth-central-america.onrender.com`

## 换 CodeBuddy 账号

CodeBuddy 账号切换不会改变本地项目文件，也不会自动转移第三方授权。新账号打开本目录即可继续开发；首次推送前确认当前 GitHub 账号对仓库有写权限。

```bash
cd /Users/crx/Downloads/skyworth-new-site
git remote -v
git status
git pull origin main
```

如果新账号使用不同的 GitHub 仓库，可替换远程地址：

```bash
git remote set-url origin https://github.com/你的账号/你的仓库.git
git push -u origin main
```

## 一键开发、检查、推送

项目依赖 Node 18 或更高版本。安装依赖并检查语法：

```bash
npm install
npm run check
```

本地启动：

```bash
npm start
```

访问：`http://127.0.0.1:4173/`

提交推送：

```bash
git add -A
git commit -m "描述本次修改"
git push origin main
```

推送到 `main` 后，Render 会按照 `render.yaml` 自动构建并部署。Render 的环境变量和持久化磁盘属于 Render 账号/服务，不存储在 Git 仓库中。

## 必须重新确认的授权

以下内容不会随代码仓库迁移：

- GitHub 登录和仓库写权限
- Render 服务授权、自动部署设置和环境变量
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_ANON_KEY`
- Render 持久化磁盘 `/var/data`

不要把这些密钥写入 Git，也不要提交 `.env` 文件。换账号后应在对应服务的授权界面重新登录；如果 GitHub 仓库属于原账号，给新账号添加 collaborator 或改用新仓库。

## 图片资源

Learning 页面预留的资源路径：

- `assets/images/panasonic-tv-hero.jpg`
- `assets/images/tv-basics.jpg`
- `assets/images/course-tv-basics.jpg`
- `assets/images/course-product-training.jpg`
- `assets/images/course-operation-steps.jpg`
- `assets/images/user-avatar.jpg`

图片目录目前可以直接创建并提交：

```bash
mkdir -p assets/images
```

## 当前页面代码

- `index.html`：Learning 页面结构和资源插槽
- `learning-v3.css`：Panasonic 三栏视觉和响应式样式
- `learning-v3.js`：搜索、通知、发帖、回复、Toast
- `app.js`：原有课程、学习记录、视频、资料、Quiz、后台和服务端数据逻辑
- `render.yaml`：Render Node 服务配置

## 数据注意事项

课程、用户、学习记录和销售数据保存在 Supabase 或 Render 的持久化数据目录中，不在 Git 提交中。迁移代码仓库不会自动复制数据库数据；迁移线上服务前要单独确认 Supabase 项目和 Render 磁盘仍然指向原数据源。
