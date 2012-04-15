from django.conf.urls.defaults import patterns, url

from piston.resource import Resource
from fangofmongo.rest.handlers import MongoServerHandler, DatabaseHandler

databases_resource = Resource(handler=MongoServerHandler)
collections_resource = Resource(handler=DatabaseHandler)

def eurl(regex, *args, **kwargs):
    if regex.endswith(r'$'):
        regex = regex[:-1] + r'\.(?P<emitter_format>\w+?)$'
    else:
        regex += r'\.(?P<emitter_format>\w+?)'

    return url(regex, *args, **kwargs)

urlpatterns = patterns('',
    eurl(r'^(?P<host>[^/:]+?):(?P<port>\d+)$', databases_resource, name='list-databases'),


    eurl(r'^(?P<host>[^/:]+?):(?P<port>\d+)/(?P<db>[^ .$/\\]{1,64})$', collections_resource, name='show-database'),


    eurl(r'^(?P<host>[^/:]+?):(?P<port>\d+)/(?P<db>[^ .$/\\]{1,64})/(?P<collection>[^$]{1,64}?)$', collections_resource, name='show-collection'),

)

