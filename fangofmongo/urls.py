from django.conf.urls.defaults import patterns, include

urlpatterns = patterns('',
    # Example:
    (r'^', include('fangofmongo.fom.urls', namespace='fe')),

)
