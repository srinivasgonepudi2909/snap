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
    && apt-get install -y --no-install-recommends curl gcc libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# -----------------------
# Set work directory
# -----------------------
WORKDIR /app

# -----------------------
# Copy requirements file
# -----------------------
COPY requirements.txt /app/

# -----------------------
# Install dependencies
# -----------------------
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# -----------------------
# Copy entire project after dependencies
# -----------------------
COPY . /app

# -----------------------
# Create uploads directory with proper permissions
# -----------------------
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# -----------------------
# Expose port and start server
# -----------------------
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]