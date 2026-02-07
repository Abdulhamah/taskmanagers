#!/bin/bash

# TaskMaster AI - Oracle Cloud Bootstrap Script
# If SSH doesn't work, use the Oracle Cloud Console browser terminal to run this script

set -e

echo "🚀 TaskMaster AI - Oracle Cloud Deployment"
echo "==========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Git
echo "📦 Installing Git..."
sudo apt install -y git curl wget

# Install Docker
echo "📦 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Add ubuntu to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
echo ""
echo "✅ Installation verification:"
docker --version
docker-compose --version
git --version
echo ""

# Create app directory
mkdir -p ~/taskmaster
cd ~/taskmaster

echo "✅ Ready for deployment!"
echo ""
echo "📝 Next steps:"
echo "1. Clone your repository:"
echo "   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ."
echo ""
echo "2. Create backend/.env with your API key:"
echo "   cat > backend/.env << 'EOF'"
echo "   NODE_ENV=production"
echo "   PORT=3001"
echo "   ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE"
echo "   EOF"
echo ""
echo "3. Run deployment:"
echo "   bash deploy-oracle.sh"
echo ""
