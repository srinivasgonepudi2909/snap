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
    && curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# -----------------------
# Set work directory
# -----------------------
WORKDIR /app

# -----------------------
# Copy entire project
# -----------------------
COPY . /app

# -----------------------
# Install dependencies
# -----------------------
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# -----------------------
# Expose port and start server
# -----------------------
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
