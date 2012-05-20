try:
    from django.conf.urls import patterns, url, include
except ImportError:
    #noinspection PyDeprecation
    from django.conf.urls.defaults import patterns, url, include

from tastypie.api import Api

from mangoadmin.madm.views import IndexView
from mangoadmin.madm.api import MongoDBDatabaseResource, MongoDBCollectionResource, MongoDBQueryResource

index_view = IndexView.as_view()
api = Api()
api.register(MongoDBDatabaseResource())
api.register(MongoDBCollectionResource())
api.register(MongoDBQueryResource())

urlpatterns = patterns('',
    url(r'^api/', include(api.urls, namespace='api')),
    url(r'^$', index_view, name='index'),
)
