# -----------------------
# Base image with Python
# -----------------------
FROM python:3.9-slim

# -----------------------
# Set environment vars
# -----------------------
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# -----------------------
# Install system dependencies
# -----------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libpq-dev \
        python3-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# -----------------------
# Set work directory
# -----------------------
WORKDIR /app

# -----------------------
# Copy requirements file
# -----------------------
COPY requirements.txt .

# -----------------------
# Install Python dependencies
# -----------------------
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# -----------------------
# Copy application code
# -----------------------
COPY app/ ./app/

# -----------------------
# Create uploads directory
# -----------------------
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# -----------------------
# Expose port and start server
# -----------------------
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]