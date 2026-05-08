FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy all scripts
COPY . .

ENV PYTHONPATH=/app

EXPOSE 8000
# Run the entry point
CMD ["python", "backend/main.py"]