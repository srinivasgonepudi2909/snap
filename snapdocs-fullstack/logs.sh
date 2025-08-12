#!/bin/bash

echo "📊 SnapDocs Service Logs"
echo "======================="

if [ "$1" = "frontend" ]; then
    docker-compose logs -f frontend
elif [ "$1" = "backend" ]; then
    docker-compose logs -f backend
elif [ "$1" = "postgres" ]; then
    docker-compose logs -f postgres
elif [ "$1" = "nginx" ]; then
    docker-compose logs -f nginx
else
    echo "Usage: ./logs.sh [frontend|backend|postgres|nginx]"
    echo ""
    echo "Or view all logs:"
    docker-compose logs -f
fi
