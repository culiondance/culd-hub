#!/bin/bash
python3 backend/manage.py makemigrations --no-input
python3 backend/manage.py migrate --no-input
#python3 backend/manage.py createsuperuser --noinput --email "drd2145@columbia.edu" --first_name "Amira" --last_name "Dominguez"
python3 backend/manage.py runserver 0.0.0.0:8080
