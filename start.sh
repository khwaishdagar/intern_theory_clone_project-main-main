#!/bin/bash

echo "========================================"
echo "   InternTheory Project Startup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo "Checking MongoDB connection..."
sleep 2

# Start Backend
echo ""
echo "[1/2] Starting Backend Server..."
echo "----------------------------------------"
cd intern_theory_clone_project-main-main/backend
npm start &
BACKEND_PID=$!
echo -e "${GREEN}Backend starting on http://localhost:5000${NC}"
sleep 5

# Start Frontend
echo ""
echo "[2/2] Starting Frontend Server..."
echo "----------------------------------------"
cd ..
npx http-server . -p 3000 -o /intern_theory_clone_project-main-main/index.html &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend starting on http://localhost:3000${NC}"

echo ""
echo "========================================"
echo "   All Services Started!"
echo "========================================"
echo -e "   Backend:  ${BLUE}http://localhost:5000${NC}"
echo -e "   Frontend: ${BLUE}http://localhost:3000${NC}"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID


