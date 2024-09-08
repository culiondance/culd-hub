import dj_database_url
import os
import environ
from core.settings.base import (
    INSTALLED_APPS,
    MIDDLEWARE,
    TEMPLATES,
    BASE_DIR,
    DATABASES,
)


env = environ.Env()
environ.Env.read_env()

DEBUG = True

ALLOWED_HOSTS = ["hub.culiondance.org", "culd-hub.fly.dev"]

CSRF_TRUSTED_ORIGINS = [
    "https://hub.culiondance.org",
    "http://hub.culiondance.org",
    "https://culd=hub.fly.dev",
]

INSTALLED_APPS.extend(["whitenoise.runserver_nostatic"])

# Must insert after SecurityMiddleware, which is first in settings/common.py
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

TEMPLATES[0]["DIRS"] = [os.path.join(BASE_DIR, "../", "frontend", "build")]

STATICFILES_DIRS = [os.path.join(BASE_DIR, "../", "frontend", "build", "static")]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATIC_URL = "/static/"
WHITENOISE_ROOT = os.path.join(BASE_DIR, "../", "frontend", "build", "root")

DATABASE_URL = env("DATABASE_URL", default=None)
db_from_env = dj_database_url.config(
    default=DATABASE_URL, conn_max_age=0, ssl_require=False
)
DATABASES["default"].update(db_from_env)

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default=None)
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default=None)
DEFAULT_FROM_EMAIL = "CU Lion Dance"
