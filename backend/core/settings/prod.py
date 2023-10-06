import dj_database_url

from core.settings.base import *

DEBUG = True

ALLOWED_HOSTS = ["hub.culiondance.org","culd-hub.fly.dev"]

CSRF_TRUSTED_ORIGINS = ["https://hub.culiondance.org", "http://hub.culiondance.org","https://culd=hub.fly.dev"]

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
    default=DATABASE_URL, conn_max_age=0, ssl_require=True
)
DATABASES["default"].update(db_from_env)
