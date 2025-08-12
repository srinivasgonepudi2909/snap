#!/bin/bash

echo "🚀 Starting SnapDocs Full-Stack Application"
echo "=========================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start all services
echo "📦 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
echo ""

# Check database
echo -n "📊 Database: "
if docker-compose exec -T postgres pg_isready -U snapdocs_user -d snapdocs_db >/dev/null 2>&1; then
    echo "✅ Healthy"
else
    echo "❌ Not ready"
fi

# Check backend
echo -n "🐍 Backend: "
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ Healthy"
else
    echo "❌ Not ready"
fi

# Check frontend
echo -n "⚛️  Frontend: "
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Healthy"
else
    echo "❌ Not ready"
fi

echo ""
echo "🎉 SnapDocs is ready!"
echo ""
echo "🔗 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Full App: http://localhost (via Nginx)"
echo ""
echo "📊 View logs: docker-compose logs -f"
echo "⏹️  Stop: docker-compose down"
