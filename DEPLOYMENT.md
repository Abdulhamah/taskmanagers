# Deployment Guide

## Overview
This guide covers deploying TaskMaster AI to production environments.

## Prerequisites
- Node.js v20+
- npm v10+
- Anthropic API key
- Cloud hosting account (Vercel, Heroku, AWS, etc.)

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Benefits:**
- Zero-config deployment
- Automatic HTTPS
- CDN included
- Free tier available

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the frontend**
```bash
npm run build --workspace=frontend
```

3. **Deploy**
```bash
vercel
```

4. **Configure environment**
```
VITE_API_URL=https://your-backend-domain.com/api
```

### Option 2: Netlify

**Steps:**

1. **Build**
```bash
npm run build --workspace=frontend
```

2. **Connect repository to Netlify**
```
https://app.netlify.com/start
```

3. **Set build command**
```
npm run build --workspace=frontend
```

4. **Set publish directory**
```
frontend/dist
```

### Option 3: Self-Hosted (Nginx)

**Steps:**

1. **Build frontend**
```bash
npm run build --workspace=frontend
```

2. **Upload to server**
```bash
scp -r frontend/dist/* user@server.com:/var/www/taskmaster/
```

3. **Configure Nginx**
```nginx
server {
  listen 80;
  server_name taskmaster.example.com;

  root /var/www/taskmaster;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://backend:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }
}
```

---

## Backend Deployment

### Option 1: Heroku

**Prerequisites:**
- Heroku CLI installed
- Heroku account

**Steps:**

1. **Create Heroku app**
```bash
heroku create taskmaster-api
```

2. **Set environment variables**
```bash
heroku config:set ANTHROPIC_API_KEY=sk-ant-your-key
heroku config:set PORT=3001
```

3. **Deploy**
```bash
git push heroku main
```

4. **View logs**
```bash
heroku logs --tail
```

### Option 2: Railway

**Steps:**

1. **Connect GitHub**
```
https://railway.app
```

2. **Create new project**
- Select repository
- Configure environment variables

3. **Deploy**
Railway auto-deploys on push

### Option 3: DigitalOcean App Platform

**Steps:**

1. **Create new app**
```
https://cloud.digitalocean.com/apps
```

2. **Connect GitHub repository**

3. **Configure**
- Set Node.js version
- Add environment variables
- Set build command: `npm run build --workspace=backend`
- Set run command: `npm start --workspace=backend`

4. **Deploy**

### Option 4: AWS EC2

**Steps:**

1. **Launch EC2 instance**
- Ubuntu 22.04 LTS
- t3.micro or larger

2. **Connect and setup**
```bash
ssh -i key.pem ubuntu@instance-ip
sudo apt update
sudo apt install nodejs npm nginx
sudo systemctl start nginx
```

3. **Clone and configure**
```bash
git clone https://github.com/yourusername/taskmaster-ai
cd taskmaster-ai
npm run install-all
npm run build --workspace=backend
```

4. **Create systemd service**
```
sudo nano /etc/systemd/system/taskmaster.service
```

Add:
```ini
[Unit]
Description=TaskMaster API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/taskmaster-ai
ExecStart=/usr/bin/node backend/dist/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

5. **Enable and start**
```bash
sudo systemctl enable taskmaster
sudo systemctl start taskmaster
```

6. **Configure Nginx proxy**
```bash
sudo nano /etc/nginx/sites-available/taskmaster
```

---

## Database

### SQLite (Development/Small Scale)
- Default option
- File-based: `backend/data/tasks.db`
- No setup needed
- Suitable for < 1000 users

### PostgreSQL (Production)

**Setup:**

1. **Install PostgreSQL**
```bash
apt install postgresql postgresql-contrib
```

2. **Create database**
```sql
CREATE DATABASE taskmaster;
CREATE USER taskmaster_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE taskmaster TO taskmaster_user;
```

3. **Update connection**
Edit `backend/.env`:
```
DATABASE_URL=postgresql://taskmaster_user:password@localhost:5432/taskmaster
```

4. **Update code** (if needed)
```typescript
// Use pg instead of sqlite3
import { Client } from 'pg';
```

---

## SSL/HTTPS

### Option 1: Let's Encrypt + Nginx
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Option 2: Cloud Provider SSL
- Vercel: Automatic
- Heroku: Included
- DigitalOcean: Automatic

---

## Environment Variables

### Production Checklist

```bash
# Required
ANTHROPIC_API_KEY=your-key

# Optional but recommended
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
```

### Security Best Practices

✅ DO:
- Use strong API keys
- Store keys in environment variables
- Enable HTTPS
- Set secure CORS headers
- Implement rate limiting
- Use database backups

❌ DON'T:
- Commit API keys to repository
- Use default credentials
- Disable HTTPS in production
- Allow all CORS origins
- Store sensitive data in logs

---

## Monitoring & Logging

### Error Tracking (Sentry)

```bash
npm install --save @sentry/node
```

Setup in `backend/src/index.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Uptime Monitoring (UptimeRobot)
- Monitor `https://api.yourdomain.com/health`
- Get alerts on downtime

### Performance Monitoring (New Relic)
```bash
npm install newrelic
```

---

## Backup Strategy

### Automated Backups
```bash
# Daily backup script
0 0 * * * /home/ubuntu/backup.sh
```

Backup script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
cp backend/data/tasks.db /backups/tasks-$DATE.db
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple backend instances
- Use shared database

### Vertical Scaling
- Upgrade server specs
- Optimize queries
- Add caching (Redis)

### Database Optimization
```sql
CREATE INDEX idx_status ON tasks(status);
CREATE INDEX idx_priority ON tasks(priority);
CREATE INDEX idx_category ON tasks(category);
```

---

## Rollback Plan

If deployment fails:

```bash
# Check version
git log --oneline -n 5

# Rollback
git revert HEAD
git push
```

---

## Post-Deployment Checklist

- [ ] HTTPS enabled
- [ ] API key configured
- [ ] Database initialized
- [ ] Health check passing
- [ ] Monitoring active
- [ ] Backups configured
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Error tracking setup
- [ ] Documentation updated

---

## Support

For deployment issues:
1. Check logs: `npm run dev` locally first
2. Verify environment variables
3. Check network connectivity
4. Review cloud provider documentation
5. Open an issue on GitHub

---

## Cost Estimates (Monthly)

| Provider | Tier | Cost |
|----------|------|------|
| Vercel | Free | $0 |
| Heroku | Basic | $7 |
| DigitalOcean | Starter | $5 |
| AWS | EC2 t3.micro | ~$8 |
| Railway | Starter | Free |

*Costs vary based on usage and region*
