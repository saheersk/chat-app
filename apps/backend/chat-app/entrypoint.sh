#!/bin/bash

cd /chat-backend/ || exit

# Start the Django application
gunicorn -c chat/gunicorn_config.py chat.asgi:application