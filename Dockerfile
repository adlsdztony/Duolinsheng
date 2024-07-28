FROM python:3.9.18-alpine3.18
COPY . /app/
WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt
    
CMD ["python", "run.py"]