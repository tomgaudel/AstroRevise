#!/bin/bash

# AstroRevise Development Environment Checker

echo "🔍 AstroRevise Environment Check"
echo "================================="
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not installed"
    exit 1
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version)
    echo "✅ PostgreSQL: $PG_VERSION"
else
    echo "⚠️  PostgreSQL not in PATH"
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git: $GIT_VERSION"
else
    echo "❌ Git not installed"
fi

# Check if ports are available
echo ""
echo "🔌 Checking ports..."

# Port 5000
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 5000 is already in use"
else
    echo "✅ Port 5000 is available"
fi

# Port 5173
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 5173 is already in use"
else
    echo "✅ Port 5173 is available"
fi

# Port 8765 (Anki)
if lsof -Pi :8765 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ AnkiConnect is running on port 8765"
else
    echo "⚠️  AnkiConnect not detected (optional)"
fi

echo ""
echo "✅ Environment check complete!"
