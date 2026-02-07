#!/bin/bash

# Oracle Cloud Web Console Deployment Guide
# Run this script to get interactive deployment instructions

echo "🚀 TaskMaster AI - Oracle Cloud Deployment"
echo "==========================================="
echo ""
echo "Since SSH key authentication is having issues,"
echo "we'll use the Oracle Cloud web console instead."
echo ""
echo "This method is actually EASIER - no terminal setup needed!"
echo ""

read -p "Press Enter to see the step-by-step instructions..."

clear

echo "📋 STEP-BY-STEP WEB CONSOLE DEPLOYMENT"
echo "======================================"
echo ""

echo "STEP 1: Open Oracle Cloud Console"
echo "  1. Go to: https://www.oracle.com/cloud/sign-in/"
echo "  2. Sign in with your OCI account"
echo "  3. You should see your dashboard"
echo ""
read -p "Done? Press Enter..."

clear

echo "STEP 2: Navigate to Your Instance"
echo "  1. In the Oracle Console, click the menu (☰) icon"
echo "  2. Go to: Compute → Instances"
echo "  3. Make sure region is 'ca-montreal-1' (Canada Montreal)"
echo "  4. Find your instance (should show IP 204.216.111.48)"
echo "  5. Click on the instance name to open it"
echo ""
read -p "Done? Press Enter..."

clear

echo "STEP 3: Access the Web Terminal"
echo "  1. On your instance page, scroll DOWN"
echo "  2. Look for section: 'Console Connections'"
echo "  3. Click blue button: 'Create Console Connection'"
echo "  4. A dialog appears - click the download button for the key"
echo "  5. Save the key file (you can use the one you already have)"
echo "  6. Click 'Create' button"
echo "  7. Wait a few seconds, then click 'Open Cloud Shell Console'"
echo "  8. A new browser tab opens with a terminal 🎉"
echo ""
read -p "Done? Press Enter..."

clear

echo "STEP 4: In the Web Terminal, Run Commands"
echo "  Copy and paste each command below, one at a time"
echo ""
echo "First, update system:"
echo "---"
echo "sudo apt update && sudo apt upgrade -y"
echo "---"
echo ""
read -p "Copy command above and paste in the web terminal. Press Enter when done..."

clear

echo "STEP 5: Install Docker"
echo "---"
echo "curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && rm get-docker.sh"
echo "---"
echo ""
read -p "Copy and paste in web terminal. Press Enter when done..."

clear

echo "STEP 6: Install Docker Compose"
echo "---"
echo "sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose"
echo "---"
echo ""
read -p "Copy and paste in web terminal. Press Enter when done..."

clear

echo "STEP 7: Install Git"
echo "---"
echo "sudo apt install -y git"
echo "---"
echo ""
read -p "Copy and paste in web terminal. Press Enter when done..."

clear

echo "STEP 8: Clone Your Repository"
echo "  Replace YOUR_USERNAME and YOUR_REPO with your actual values"
echo "---"
echo "cd /home/ubuntu"
echo "git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "cd YOUR_REPO"
echo "---"
echo ""
read -p "Copy and paste in web terminal (update URLs!). Press Enter when done..."

clear

echo "STEP 9: Create Environment File"
echo "  Replace sk-ant-YOUR_KEY_HERE with your actual Anthropic API key"
echo "---"
echo "cat > backend/.env << 'EOF'"
echo "NODE_ENV=production"
echo "PORT=3001"
echo "ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE"
echo "EOF"
echo "---"
echo ""
read -p "Copy and paste in web terminal (update API key!). Press Enter when done..."

clear

echo "STEP 10: Check Configuration"
echo "---"
echo "cat backend/.env"
echo "---"
echo ""
echo "Make sure your API key is there!"
echo ""
read -p "Press Enter when confirmed..."

clear

echo "STEP 11: Configure Firewall"
echo ""
echo "  1. In Oracle Console, go to: Networking → Virtual Cloud Networks"
echo "  2. Click your VCN"
echo "  3. Click 'Security Lists' on the left"
echo "  4. Click the security list (default-security-list or similar)"
echo "  5. Click 'Add Ingress Rule' button"
echo "  6. Add these 4 rules (one at a time):"
echo ""
echo "     Rule 1: Port 80 (HTTP)"
echo "       - Protocol: TCP"
echo "       - Source CIDR: 0.0.0.0/0"
echo ""
echo "     Rule 2: Port 443 (HTTPS)"
echo "       - Protocol: TCP"
echo "       - Source CIDR: 0.0.0.0/0"
echo ""
echo "     Rule 3: Port 3001 (Backend API)"
echo "       - Protocol: TCP"
echo "       - Source CIDR: 0.0.0.0/0"
echo ""
echo "     Rule 4: Port 5173 (Frontend Dev)"
echo "       - Protocol: TCP"
echo "       - Source CIDR: 0.0.0.0/0"
echo ""
read -p "Done adding firewall rules? Press Enter..."

clear

echo "STEP 12: Deploy Your Application"
echo "  Back in the web terminal, run:"
echo "---"
echo "docker-compose -f docker-compose.prod.yml build"
echo "---"
echo ""
echo "Wait for build to complete (may take 2-3 minutes)"
echo ""
read -p "Build complete? Press Enter..."

clear

echo "STEP 13: Start Services"
echo "---"
echo "docker-compose -f docker-compose.prod.yml up -d"
echo "---"
echo ""
read -p "Services started? Press Enter..."

clear

echo "STEP 14: Verify Deployment"
echo "---"
echo "docker-compose -f docker-compose.prod.yml ps"
echo "---"
echo ""
echo "You should see:"
echo "  taskmaster-backend    Up X seconds"
echo "  taskmaster-frontend   Up X seconds"
echo ""
read -p "Services running? Press Enter..."

clear

echo "STEP 15: Test Backend"
echo "---"
echo "curl http://localhost:3001/health"
echo "---"
echo ""
echo "Should return: {\"status\":\"ok\"}"
echo ""
read -p "Backend working? Press Enter..."

clear

echo "STEP 16: Get Your Public IP"
echo ""
echo "  Option A: In Oracle Console"
echo "    1. Go to your instance page"
echo "    2. Look for 'Primary VNIC Information' section"
echo "    3. Copy the 'Public IP Address'"
echo ""
echo "  Option B: In web terminal, run:"
echo "---"
echo "curl -s http://169.254.169.254/opc/v2/instance/metadata | grep publicIp | head -1"
echo "---"
echo ""
read -p "Got your public IP? Press Enter..."

clear

echo "🎉 SUCCESS!"
echo "==========="
echo ""
echo "Your application is now LIVE!"
echo ""
echo "Visit in your browser:"
echo "  Frontend: http://YOUR_PUBLIC_IP"
echo "  Backend API: http://YOUR_PUBLIC_IP:3001/health"
echo ""
echo "Or use your domain if you've configured DNS:"
echo "  Frontend: http://YOUR_DOMAIN.com"
echo ""

echo ""
echo "📝 OPTIONAL: Point Your Domain"
echo ""
echo "In your domain registrar (GoDaddy, Namecheap, etc.):"
echo "  1. Add an 'A' Record"
echo "  2. Name: @ (or leave blank)"
echo "  3. Value: YOUR_PUBLIC_IP"
echo "  4. TTL: 3600"
echo "  5. Save"
echo "  6. Wait 5-15 minutes for DNS to propagate"
echo ""

echo ""
echo "🔧 USEFUL COMMANDS (in web terminal)"
echo ""
echo "View logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f backend"
echo ""
echo "Restart:"
echo "  docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "Stop:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
echo "Update code:"
echo "  git pull && docker-compose -f docker-compose.prod.yml up -d --build"
echo ""

echo "✨ Your site is now publicly accessible! 🚀"
echo ""
