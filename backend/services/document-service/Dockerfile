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
# Install system deps
# -----------------------
RUN apt-get update \
    && apt-get install -y curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# -----------------------
# Set work directory
# -----------------------
WORKDIR /app

# -----------------------
# Copy requirements first for better caching
# -----------------------
COPY requirements.txt /app/

# -----------------------
# Install Python dependencies
# -----------------------
RUN pip install --no-cache-dir -r requirements.txt

# -----------------------
# Copy entire project
# -----------------------
COPY . /app

# -----------------------
# Create uploads directory
# -----------------------
RUN mkdir -p /app/uploads

# -----------------------
# Expose port and start server
# -----------------------
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]