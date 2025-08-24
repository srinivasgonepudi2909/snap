FROM python:3.9-slim

WORKDIR /app

# Copy both files to see what's available
COPY requirements.txt pyproject.toml ./

# Debug: Show what files we have
RUN ls -la && \
    echo "Requirements file exists:" && \
    if [ -f "requirements.txt" ]; then echo "YES"; else echo "NO"; fi && \
    echo "Pyproject file exists:" && \
    if [ -f "pyproject.toml" ]; then echo "YES"; else echo "NO"; fi

# Try to install from requirements.txt if it exists
RUN if [ -f "requirements.txt" ]; then \
        echo "Installing from requirements.txt" && \
        pip install --no-cache-dir --upgrade pip && \
        pip install --no-cache-dir -r requirements.txt; \
    else \
        echo "No requirements.txt, trying poetry" && \
        pip install --no-cache-dir poetry==1.8.2 && \
        poetry config virtualenvs.create false && \
        poetry install --no-interaction --no-ansi --no-root; \
    fi

COPY app/ ./app/
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]