#==============================================================================
# Calculation of directories relative to the module location
#==============================================================================
import os
import fangofmongo
paths = lambda *p: os.path.join(*p)

PROJECT_DIR, PROJECT_MODULE_NAME = os.path.split(
    os.path.dirname(os.path.realpath(fangofmongo.__file__))
)

#==============================================================================
# Project Version
#==============================================================================

if hasattr(fangofmongo, '__version__'):
    VERSION = fangofmongo.__version__
else:
    VERSION = '0.0.0'

# Django settings for fangofmongo project.

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': paths(PROJECT_DIR, PROJECT_MODULE_NAME, 'db', 'sqlite3.db'),
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = None

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = False

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = USE_I18N

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = USE_L10N

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # TODO: drop this and move the template to a better place
    paths(PROJECT_DIR, PROJECT_MODULE_NAME, 'static'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'rw8^!q$q1nyl+a5hpsar*9@i62%!azrb%m3ad9oj9y=fh63qsu'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
#    'django.middleware.common.CommonMiddleware',
)

ROOT_URLCONF = 'fangofmongo.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'fangofmongo.wsgi.application'

TEMPLATE_DIRS = (
    # TODO: drop this and move the template to a better place
    paths(PROJECT_DIR, PROJECT_MODULE_NAME),
)

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'piston',
    'fangofmongo.fom',
    'fangofmongo.rest',
)


#FOM_PLUGIN_DIR = '%s/plugins/' % ROOT_DIRECTORY
