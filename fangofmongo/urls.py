from django.conf.urls.defaults import patterns, include

urlpatterns = patterns('',
    # Example:
    (r'^api/', include('fangofmongo.rest.urls', namespace='api')),
    (r'^fangofmongo/', include('fangofmongo.fom.urls', namespace='fe')),
    (r'^$', include('fangofmongo.mangoadmin.urls', namespace='mango')),

)
