from django.conf.urls.defaults import patterns, include

urlpatterns = patterns('',
    # Example:
    (r'^api/', include('fangofmongo.rest.urls', namespace='api')),
    (r'^', include('fangofmongo.fom.urls', namespace='fe')),

)
