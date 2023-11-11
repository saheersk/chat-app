FROM python:3.8-slim

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y libpq-dev

WORKDIR /chat

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .