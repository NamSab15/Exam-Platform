# ==========================================
# Stage 1: Build dependencies in a virtual env
# ==========================================
FROM python:3.11-slim AS builder

WORKDIR /build

# Install system compilation dependencies if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create and isolate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# ==========================================
# Stage 2: Runtime image containing application code
# ==========================================
FROM python:3.11-slim AS runner

WORKDIR /app

# Enable bytecode suppression and output flushing
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# Copy virtual environment package binaries from builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy application source code
COPY app/ ./app/

# Create a non-root system user and group for security
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -d /app -s /sbin/nologin appuser && \
    chown -R appuser:appgroup /app

# Expose port and run as non-root user
EXPOSE 8000
USER appuser

# Healthcheck configuration (optional but recommended for production orchestrators)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
