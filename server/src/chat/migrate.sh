#!/bin/bash

cd /chat-backend/ || exit

# Apply database migrations
python manage.py migrate
python manage.py collectstatic


