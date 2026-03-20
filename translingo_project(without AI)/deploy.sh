#!/bin/bash

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
git pull origin main

# 2. Renew SSL Certs (if using Certbot)
docker-compose run --rm certbot renew

# 3. Build & Restart Containers
# --build: forces rebuild of images
# -d: detach mode
# --remove-orphans: cleans up old containers
docker-compose -f docker-compose.prod.yml up --build -d --remove-orphans

# 4. Scale specific services
echo "⚖️ Scaling Gateway..."
docker-compose -f docker-compose.prod.yml up -d --scale gateway=3 --no-recreate

echo "✅ Deployment Complete. System Operational."