#!/bin/bash

# Oracle Cloud Deployment Script
# Run this on your Oracle instance to deploy the application

set -e  # Exit on error

echo "🚀 Starting TaskMaster AI Deployment on Oracle Cloud..."
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f backend/.env ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "Please create backend/.env with your configuration."
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "✅ Build complete"
echo ""

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Services started"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to become healthy..."
sleep 10

# Check health
echo "🏥 Checking service health..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "📝 Logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20
echo ""
echo "💡 Commands:"
echo "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop: docker-compose -f docker-compose.prod.yml down"
echo "   Restart: docker-compose -f docker-compose.prod.yml restart"
echo "   Update code: git pull && docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
