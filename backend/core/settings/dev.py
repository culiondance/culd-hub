import os
from core.settings.base import *


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

DEBUG = True

ALLOWED_HOSTS = ["backend", "localhost", "127.0.0.1", "culd-hub.fly.dev", "media.localhost"]

if os.environ.get("DEVELOPMENT_DATABASE") == "postgres":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "postgres",
            "USER": "postgres",
            "HOST": "db",
            "PORT": 5432,
        }
    }

EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"


