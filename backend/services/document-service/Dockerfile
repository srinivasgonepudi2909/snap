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
# Install system dependencies for Python packages
# -----------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libpq-dev \
        python3-dev \
    && rm -rf /var/lib/apt/lists/*

# -----------------------
# Set work directory
# -----------------------
WORKDIR /app

# -----------------------
# Copy requirements file (if exists) or use poetry
# -----------------------
COPY requirements.txt pyproject.toml ./

# -----------------------
# Install dependencies based on what's available
# -----------------------
RUN if [ -f "requirements.txt" ]; then \
        pip install --no-cache-dir --upgrade pip \
        && pip install --no-cache-dir -r requirements.txt; \
    else \
        pip install --no-cache-dir poetry==1.8.2 \
        && poetry config virtualenvs.create false \
        && poetry install --no-interaction --no-ansi --no-root; \
    fi

# -----------------------
# Copy application code
# -----------------------
COPY app/ ./app/
COPY uploads/ ./uploads/

# -----------------------
# Create uploads directory if it doesn't exist
# -----------------------
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# -----------------------
# Expose port and start server
# -----------------------
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]