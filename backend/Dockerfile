FROM python:3.12-slim

WORKDIR /app
RUN apt-get update \
    && apt-get -y install libpq-dev gcc
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--app-dir", "."]