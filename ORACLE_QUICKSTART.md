# Oracle Cloud Deployment - Quick Start

## ⚡ 5-Minute Quick Start

### Step 1: Prepare Your Code
```bash
# On your Mac, make sure everything is committed and pushed to GitHub
git add .
git commit -m "Prepare for Oracle deployment"
git push origin main
```

### Step 2: Create Oracle Instance
1. Go to https://www.oracle.com/cloud
2. **Compute → Instances → Create Instance**
3. Choose **Ubuntu 22.04** (Always Free)
4. Choose **Ampere (A1 Compute)** shape
5. **Download SSH Key** and save it
6. Click **Create**
7. Copy the **Public IP Address**

### Step 3: Connect & Deploy (5 commands)
```bash
# Replace with your actual IP and key path
ssh -i ~/Downloads/oracle-key.key ubuntu@YOUR_PUBLIC_IP

# Once logged in, run:
sudo apt update && sudo apt install -y git
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
EOF

bash deploy-oracle.sh
```

### Step 4: Test It's Working
```bash
curl http://YOUR_PUBLIC_IP/health
```

You should see: `healthy`

### Step 5: Point Your Domain
In your domain registrar:
- **A Record**
- **Name**: @ 
- **Value**: YOUR_PUBLIC_IP

Wait 5-15 minutes for DNS to update.

---

## 📋 Full Checklist

- [ ] OCI account created
- [ ] Compute instance running (Ubuntu 22.04)
- [ ] SSH key downloaded
- [ ] Connected to instance
- [ ] Code deployed with `deploy-oracle.sh`
- [ ] Backend health check passing
- [ ] Domain DNS pointing to Oracle IP
- [ ] Access site via domain

---

## 🌐 Access Your Site

After DNS updates:
- **Website**: http://YOUR_DOMAIN (or use IP directly: http://YOUR_PUBLIC_IP)
- **Backend API**: http://YOUR_DOMAIN/api or http://YOUR_PUBLIC_IP:3001

---

## 🔧 Common Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update code
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## 🆘 Troubleshooting

### Can't connect to instance?
```bash
# Check SSH permissions
chmod 400 ~/Downloads/oracle-key.key

# Verify IP
# Go to Oracle Console → Instances → copy IP again
```

### Port not working?
Check Oracle firewall:
- **Networking → VCN → Security Lists**
- Add Ingress Rule for ports 80, 443, 3001
- Source: 0.0.0.0/0

### Services won't start?
```bash
# Check environment file
cat backend/.env

# Check Docker logs
docker logs taskmaster-backend

# Check space
df -h
```

### Domain not resolving?
- Wait 5-15 minutes for DNS propagation
- Check DNS record is correct: `nslookup YOUR_DOMAIN`
- Try: `curl http://YOUR_PUBLIC_IP` first (should work immediately)

---

## 💾 Backup Your Data

Your database is stored in Docker volume:
```bash
# Backup database
docker cp taskmaster-backend:/app/backend/data ./backup-$(date +%Y%m%d)

# Copy to your Mac
scp -i oracle-key.key -r ubuntu@YOUR_PUBLIC_IP:~/YOUR_REPO/backend/data ./local-backup
```

---

## 🔐 Next Steps (Optional but Recommended)

1. **Enable HTTPS** - See [ORACLE_DEPLOYMENT.md](ORACLE_DEPLOYMENT.md) Step 10
2. **Set up Nginx** - See [ORACLE_DEPLOYMENT.md](ORACLE_DEPLOYMENT.md) Step 9
3. **Enable auto-renewal** for SSL certificates
4. **Set up monitoring** with Oracle Cloud Console

---

## 📞 Need Help?

Check:
1. [ORACLE_DEPLOYMENT.md](ORACLE_DEPLOYMENT.md) - Full detailed guide
2. Docker logs: `docker-compose logs -f`
3. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. System logs: `dmesg | tail -20`

**Your site should be live in ~10 minutes!** 🎉
