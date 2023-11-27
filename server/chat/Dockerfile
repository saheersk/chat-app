FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y libpq-dev

WORKDIR /chat-backend

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .