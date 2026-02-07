# Oracle Cloud Deployment Guide

## Prerequisites ✅
- OCI Account (already have)
- Domain name (already have)
- Anthropic API key (already have)
- GitHub repository with your code

---

## Step 1: Create an Oracle Compute Instance

### 1.1 Sign in to Oracle Cloud Console
- Go to https://www.oracle.com/cloud/sign-in/
- Sign in with your account

### 1.2 Create a Compute Instance
1. Click **Create a VM instance**
2. **Image**: Select **Ubuntu 22.04** (free tier eligible)
3. **Shape**: Select **Ampere (A1 Compute)** - Always Free tier
4. **VCN**: Create new VCN or use existing
5. **Public IP**: Enable
6. **SSH Key**: Download and save the private key safely
7. Click **Create**

Wait 2-3 minutes for the instance to launch.

---

## Step 2: Connect to Your Instance

### 2.1 Get Your Instance IP
1. In Oracle Cloud Console, go to **Compute → Instances**
2. Click your instance
3. Copy the **Public IP Address**

### 2.2 SSH into Your Instance
```bash
# From your Mac terminal
ssh -i ~/path/to/your-key.key ubuntu@YOUR_PUBLIC_IP

# Example:
ssh -i ~/Downloads/oracle-key ubuntu@144.24.xxx.xxx
```

---

## Step 3: Install Docker & Docker Compose

Run these commands on your Oracle instance:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

Exit and reconnect SSH session for group changes to take effect:
```bash
exit
# Reconnect
ssh -i ~/path/to/your-key.key ubuntu@YOUR_PUBLIC_IP
```

---

## Step 4: Clone Your Repository

```bash
# Install git
sudo apt install git -y

# Clone your repo (adjust URL)
git clone https://github.com/YOUR_USERNAME/your-repo.git
cd your-repo
```

---

## Step 5: Configure Environment Variables

Create the backend environment file:

```bash
cat > backend/.env << EOF
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
DATABASE_URL=/app/backend/data/tasks.db
EOF
```

---

## Step 6: Update Docker Compose for Production

Update your `docker-compose.yml` for public access:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./backend/data:/app/backend/data
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: ../Dockerfile.frontend
    ports:
      - "80:5173"
    environment:
      - VITE_API_URL=https://YOUR_DOMAIN_OR_IP:3001
    restart: unless-stopped
```

---

## Step 7: Configure Oracle Firewall Rules

1. In Oracle Cloud Console: **Networking → Virtual Cloud Networks**
2. Click your VCN
3. Click **Security Lists**
4. Edit the security list:
   - **Add Ingress Rule**: Port 80 (HTTP), Source 0.0.0.0/0
   - **Add Ingress Rule**: Port 443 (HTTPS), Source 0.0.0.0/0
   - **Add Ingress Rule**: Port 3001 (Backend), Source 0.0.0.0/0

---

## Step 8: Deploy Your Application

On your Oracle instance:

```bash
# Build and start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

## Step 9: Set Up Nginx as Reverse Proxy (Recommended)

This enables HTTPS and better performance:

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo cat > /etc/nginx/sites-available/default << 'EOF'
upstream backend {
    server localhost:3001;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name _;

    # Redirect HTTP to HTTPS (if using SSL)
    # return 301 https://$host$request_uri;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Step 10: Set Up SSL with Let's Encrypt (Free HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot certonly --nginx -d YOUR_DOMAIN.com

# Auto-renew SSL
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Step 11: Point Your Domain to Oracle Instance

In your domain registrar (GoDaddy, Namecheap, etc.):

1. Go to **DNS Settings**
2. Add an **A Record**:
   - **Name**: @ (or your domain)
   - **Type**: A
   - **Value**: YOUR_ORACLE_PUBLIC_IP
   - **TTL**: 3600

Wait 5-15 minutes for DNS propagation.

---

## Step 12: Verify Deployment

```bash
# Check if services are running
curl http://YOUR_ORACLE_PUBLIC_IP/health

# Check Nginx
curl http://YOUR_DOMAIN

# Check backend
curl http://YOUR_ORACLE_PUBLIC_IP:3001/health
```

---

## Ongoing Maintenance

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Update Code
```bash
git pull origin main
docker-compose build
docker-compose up -d
```

### Stop/Restart
```bash
docker-compose down
docker-compose up -d
```

---

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :3001
sudo kill -9 PID
```

### Docker permission issues
```bash
sudo usermod -aG docker ubuntu
# Then reconnect SSH
```

### Nginx not working
```bash
sudo systemctl status nginx
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

### Check instance logs
```bash
# In Oracle Console, click your instance → Console Connections
```

---

## Your Public Access Details

Once deployed:
- **Frontend**: https://YOUR_DOMAIN (or http://YOUR_PUBLIC_IP)
- **Backend API**: https://YOUR_DOMAIN/api (proxied through Nginx)
- **Direct Backend**: http://YOUR_PUBLIC_IP:3001 (if needed)

---

## Next Steps

1. Follow Steps 1-8 first
2. Get your instance IP
3. Configure firewall rules
4. Deploy containers
5. Set up Nginx (optional but recommended)
6. Configure SSL (optional for production)
7. Point your domain

**Need help with any step? Let me know!**
