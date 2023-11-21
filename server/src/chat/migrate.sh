#!/bin/bash

cd /chat-backend/ || exit

# Apply database migrations
python manage.py migrate --noinput
# python manage.py collectstatic --noinput


