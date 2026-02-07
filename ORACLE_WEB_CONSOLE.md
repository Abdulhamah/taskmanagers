# Deploy to Oracle Cloud via Web Console

## 🌐 Use Browser Terminal (No SSH Issues!)

Since SSH key authentication isn't working, use the Oracle Cloud web console which doesn't require SSH keys.

### Step 1: Access Console Connections

1. Go to [Oracle Cloud Console](https://www.oracle.com/cloud/sign-in/)
2. Sign in to your account
3. Navigate to **Compute → Instances**
4. Find your instance **204.216.111.48**
5. Click on it
6. Scroll down to **"Console Connections"** section
7. Click **"Create Console Connection"**

### Step 2: Get Console Access

After creating the console connection:
1. Click **"Open Cloud Shell Console"** (or similar button)
2. A new browser tab opens with a terminal
3. You're now logged in as **ubuntu** user!

### Step 3: Run Setup Commands (Copy & Paste)

In the browser terminal, copy and paste these commands one at a time:

```bash
# Update system
sudo apt update && sudo apt upgrade -y
```

Press Enter, wait for completion.

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh
```

Wait for this to complete.

```bash
# Add ubuntu to docker group
sudo usermod -aG docker ubuntu
```

```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

```bash
# Install Git
sudo apt install -y git
```

```bash
# Verify everything installed
docker --version
docker-compose --version
git --version
```

You should see version numbers for all three.

---

### Step 4: Clone Your Repository

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

Or if you want to use HTTPS (no SSH key needed):

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

### Step 5: Create Environment File

```bash
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=sk-ant-YOUR_API_KEY_HERE
EOF
```

**Make sure to replace `sk-ant-YOUR_API_KEY_HERE` with your actual Anthropic API key!**

---

### Step 6: Configure Oracle Firewall

First, get your instance's VNIC ID. In the Oracle console:
1. Your instance page
2. **Attached VNICs** section
3. Note the VNIC ID (looks like: ocid1.vnic.oc1.ca-...)

Then configure firewall:
1. **Networking → Virtual Cloud Networks**
2. Click your VCN
3. Click **Security Lists**
4. Click the default security list
5. Click **Add Ingress Rule**
6. Add these rules:
   - **Port**: 80, **Source**: 0.0.0.0/0 (HTTP)
   - **Port**: 443, **Source**: 0.0.0.0/0 (HTTPS)
   - **Port**: 3001, **Source**: 0.0.0.0/0 (Backend API)
   - **Port**: 5173, **Source**: 0.0.0.0/0 (Frontend Dev)

---

### Step 7: Deploy Your Application

In the browser terminal, from your repo directory:

```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

Wait 1-2 minutes for containers to build and start.

---

### Step 8: Verify Deployment

```bash
# Check if containers are running
docker-compose -f docker-compose.prod.yml ps
```

You should see:
```
NAME                    STATUS
taskmaster-backend      Up X seconds
taskmaster-frontend     Up X seconds
```

Test the backend:
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok"}`

---

### Step 9: Access Your Application

Get your instance's public IP:
1. Oracle Console → Your Instance
2. Look for **Public IP Address** (top section)
3. Or in terminal:
   ```bash
   curl -s http://169.254.169.254/opc/v2/instance/metadata | grep publicIp
   ```

Then visit in your browser:
- **Frontend**: `http://YOUR_PUBLIC_IP`
- **Backend API**: `http://YOUR_PUBLIC_IP:3001/health`

---

### Step 10: Point Your Domain (Optional)

In your domain registrar (GoDaddy, Namecheap, etc.):

1. Add **A Record**:
   - **Name**: @ (or leave blank)
   - **Value**: YOUR_PUBLIC_IP
   - **TTL**: 3600

2. Wait 5-15 minutes for DNS propagation

3. Access site via domain: `http://YOUR_DOMAIN.com`

---

## 🔧 Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Stop containers
docker-compose -f docker-compose.prod.yml down

# Restart
docker-compose -f docker-compose.prod.yml restart

# Update code and redeploy
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📋 Summary

✅ Done via Oracle Console web terminal  
✅ No SSH key issues  
✅ Simple copy-paste commands  
✅ Takes ~15 minutes total  

**Your site will be live at: `http://YOUR_PUBLIC_IP`** 🚀

---

## 🆘 Troubleshooting

### Can't access the site?
```bash
# Check if containers are running
docker ps

# Check backend health
curl http://localhost:3001/health

# Check firewall rules in Oracle Console
# Networking → VCN → Security Lists
```

### Docker won't start?
```bash
# Check Docker service
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Check logs
sudo docker logs taskmaster-backend
```

### Port already in use?
```bash
# Check what's using port 3001
sudo netstat -tlnp | grep 3001

# Or kill the process
sudo kill -9 PID
```

---

**Ready to deploy? Open Oracle Cloud Console and start with Step 1!** ✨
