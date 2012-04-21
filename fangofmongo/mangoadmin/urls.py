from django.conf.urls.defaults import patterns, url
from fangofmongo.mangoadmin.views import IndexView

urlpatterns = patterns('',
    url(r'^$', IndexView.as_view(), name="index"),
)

