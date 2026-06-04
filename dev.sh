#!/bin/bash

# AstroRevise Development Server Launcher

echo "🚀 Lancement d'AstroRevise..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to launch a service
launch_service() {
    local service=$1
    local command=$2
    local port=$3
    
    echo -e "${YELLOW}Lancement de $service sur le port $port...${NC}"
    (cd "$service" && eval "$command") &
    SERVICE_PIDS[$service]=$!
}

# Store PIDs for cleanup
declare -A SERVICE_PIDS

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Arrêt des services...${NC}"
    for service in "${!SERVICE_PIDS[@]}"; do
        kill ${SERVICE_PIDS[$service]} 2>/dev/null
        echo -e "${GREEN}✓${NC} $service arrêté"
    done
    exit 0
}

# Set up trap to cleanup on exit
trap cleanup EXIT INT TERM

# Launch services
launch_service "backend" "npm run dev" "5000"
launch_service "frontend" "npm run dev" "5173"

echo ""
echo -e "${GREEN}✅ Services lancés!${NC}"
echo ""
echo "🌐 Frontend: ${GREEN}http://localhost:5173${NC}"
echo "🔧 Backend:  ${GREEN}http://localhost:5000${NC}"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"

# Keep the script running
wait
