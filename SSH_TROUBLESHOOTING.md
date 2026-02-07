# SSH Connection Troubleshooting for Oracle Cloud

## Issue: Permission Denied (publickey,gssapi-keyex,gssapi-with-mic)

This means the SSH key doesn't match the one authorized on the Oracle instance.

### **Solution 1: Use Oracle Cloud Console (Recommended)**

If SSH key auth isn't working, use the web-based terminal:

1. Go to [Oracle Cloud Console](https://www.oracle.com/cloud)
2. **Compute → Instances**
3. Click your instance
4. Scroll down to **Console Connections**
5. Click **Create Console Connection**
6. Download the SSH private key
7. Click **Open Cloud Shell Console**
8. You'll have a terminal in your browser!

Then run:
```bash
# In the Oracle Cloud Console terminal:
cd ~
bash -c "$(curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/oracle-bootstrap.sh)"
```

### **Solution 2: Generate New SSH Key Pair**

If you created the instance but lost the correct key:

1. **Stop the instance** in Oracle Console
2. **Terminate** it
3. **Create a new instance** and make sure to download the correct SSH key
4. Use that key to connect

### **Solution 3: Verify Key Format**

Check if your key is in the right format:

```bash
# On your Mac
ssh-keygen -l -f /path/to/ssh-key.key
# Should show: RSA ... or ED25519 ...
```

### **Solution 4: Re-upload SSH Public Key**

If instance is already running:

1. Go to Oracle Console → Instances → Your Instance
2. Under **Instance Access**, you can upload SSH public key:
   ```bash
   ssh-keygen -y -f /path/to/ssh-key.key
   ```
   (Copy the output and paste in Oracle Console)

---

## **Quick Fix: Use Browser Console**

### Step 1: Open Cloud Shell Console
- Oracle Console → Instance → Console Connections
- Click "Create Console Connection"
- Select your key, download it
- Click "Open Cloud Shell Console"

### Step 2: Run Bootstrap in Browser Terminal
```bash
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/oracle-bootstrap.sh
bash oracle-bootstrap.sh
```

### Step 3: Clone Your Repo
```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### Step 4: Configure and Deploy
```bash
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
EOF

bash deploy-oracle.sh
```

---

## Verify Deployment

Once deployed, in your browser console:
```bash
# Check if services are running
docker-compose -f docker-compose.prod.yml ps

# Test backend health
curl http://localhost:3001/health
# Should return: {"status":"ok"}

# Test nginx (if configured)
curl http://localhost/health
# Should return: healthy
```

---

## Get Instance IP to Access Website

```bash
# In Oracle console or terminal
hostname -I
# This shows your instance's internal IP

# To access from internet, use the PUBLIC IP from Oracle Console
```

Then visit:
- `http://YOUR_PUBLIC_IP` (frontend)
- `http://YOUR_PUBLIC_IP:3001/health` (backend test)

---

## Still Having Issues?

1. Check firewall rules in Oracle Console
   - **Networking → VCN → Security Lists**
   - Ensure port 80, 443, 3001 have ingress rules

2. Check instance status
   - Instance should be in "RUNNING" state
   - Public IP should be assigned

3. Restart the instance
   - Reboot from Oracle Console

4. Check Docker logs
   ```bash
   docker logs taskmaster-backend
   docker logs taskmaster-frontend
   ```

---

## Need SSH Key Recovery?

If you don't have the SSH key anymore:

1. **Best option**: Terminate and recreate the instance
   - Save the SSH key this time!

2. **Alternative**: Use OCI CLI to manage keys
   ```bash
   oci compute instance-console-connection create --instance-id INSTANCE_ID
   ```

---

**Once you get into the instance, the deployment is smooth!** 🚀
