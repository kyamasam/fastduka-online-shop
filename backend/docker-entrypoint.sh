#!/bin/sh
python manage.py migrate

echo "Starting Gunicorn server"
gunicorn back_end.wsgi:application --bind 0.0.0.0:8000

exec "$@"