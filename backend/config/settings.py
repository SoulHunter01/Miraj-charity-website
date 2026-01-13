import os
from pathlib import Path

import dj_database_url
import cloudinary

BASE_DIR = Path(__file__).resolve().parent.parent


# ----------------------------
# Core
# ----------------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-secret-key")
DEBUG = os.environ.get("DEBUG", "True") == "True"

# For quick deploy you can keep "*". Later set it to your domains.
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")


# ----------------------------
# Apps
# ----------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",

    # Cloudinary storage (for ImageField/FileField)
    "cloudinary",
    "cloudinary_storage",

    "accounts",
]


# ----------------------------
# Middleware
# ----------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # serve static
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ----------------------------
# Database
# ----------------------------
# Render provides DATABASE_URL. Locally it falls back to your local Postgres.
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get(
            "DATABASE_URL",
            "postgres://postgres:zaid123@localhost:5432/miraj_db"
        ),
        conn_max_age=600,
    )
}


# ----------------------------
# Auth / DRF
# ----------------------------
AUTH_USER_MODEL = "accounts.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}


# ----------------------------
# CORS / CSRF
# ----------------------------
# Quick start (works): allow all
# For production, set CORS_ALLOWED_ORIGINS instead (see note below).
CORS_ALLOW_ALL_ORIGINS = os.environ.get("CORS_ALLOW_ALL_ORIGINS", "True") == "True"

# If you want to lock it down later, set:
# CORS_ALLOW_ALL_ORIGINS=False
# CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app,https://your-domain.com"
# and use this:
cors_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "").strip()
if cors_origins:
    CORS_ALLOWED_ORIGINS = [x.strip() for x in cors_origins.split(",") if x.strip()]

# CSRF trusted origins (useful if you ever enable Session auth / admin forms via domain)
csrf_trusted = os.environ.get("CSRF_TRUSTED_ORIGINS", "").strip()
if csrf_trusted:
    CSRF_TRUSTED_ORIGINS = [x.strip() for x in csrf_trusted.split(",") if x.strip()]


# ----------------------------
# Static files (WhiteNoise)
# ----------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# ----------------------------
# Media (Cloudinary)
# ----------------------------
# Cloudinary config from environment variables
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.environ.get("CLOUDINARY_API_KEY", ""),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET", ""),
)

# Store all uploaded media (ImageField/FileField) on Cloudinary
DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# Keep these (not used much with Cloudinary, but harmless)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# ----------------------------
# Internationalization
# ----------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# ----------------------------
# Password validation
# ----------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ----------------------------
# Default primary key
# ----------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
