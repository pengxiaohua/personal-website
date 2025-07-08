#!/bin/bash

# 部署脚本
set -e

echo "🚀 开始部署 xiaohua.run..."

# 项目目录
PROJECT_DIR="/home/ubuntu/personal-website"
BACKUP_DIR="/home/ubuntu/backups"

# 创建备份
echo "📦 创建备份..."
mkdir -p $BACKUP_DIR
if [ -d "$PROJECT_DIR" ]; then
    cp -r $PROJECT_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
cd $PROJECT_DIR
git pull origin main

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 重启 PM2 应用
echo "🔄 重启应用..."
pm2 restart xiaohua-website || pm2 start npm --name "xiaohua-website" -- start

# 重新加载 Nginx
echo "🔄 重新加载 Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ 部署完成！"
echo "🌐 网站地址："
echo "   - https://xiaohua.run"
echo "   - https://resume.xiaohua.run"
echo "   - https://blog.xiaohua.run"

# 清理旧备份（保留最近5个）
echo "🧹 清理旧备份..."
cd $BACKUP_DIR
ls -t | tail -n +6 | xargs -r rm -rf

echo "🎉 部署完成！" 