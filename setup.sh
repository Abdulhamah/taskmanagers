#!/bin/bash

# TaskMaster AI - Setup Script
# This script helps you set up the application for the first time

echo "🚀 TaskMaster AI - Setup Script"
echo "================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup environment variables
echo "🔧 Setting up environment variables..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add your Anthropic API key:"
    echo "   ANTHROPIC_API_KEY=sk-ant-your-key-here"
    echo ""
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 To run the application:"
echo "   npm run dev"
echo ""
echo "🌐 The app will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
