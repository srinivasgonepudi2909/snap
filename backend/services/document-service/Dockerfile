# -----------------------
# Base image with Python
# -----------------------
FROM python:3.9-slim

# -----------------------
# Set environment vars
# -----------------------
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.8.2

# -----------------------
# Install system deps
# -----------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl gcc libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# -----------------------
# Install poetry with pip (more reliable)
# -----------------------
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

# -----------------------
# Set work directory
# -----------------------
WORKDIR /app

# -----------------------
# Copy poetry files first for dependency caching
# -----------------------
COPY pyproject.toml poetry.lock* /app/

# -----------------------
# Configure poetry and install dependencies
# -----------------------
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

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