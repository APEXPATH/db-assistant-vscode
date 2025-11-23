FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt flask

COPY . .

EXPOSE 5000

CMD ["python", "web_app.py"]