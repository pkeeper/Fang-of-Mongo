from django.conf.urls.defaults import patterns, url

from piston.resource import Resource

from fangofmongo.rest.server import MongoServerHandler
from fangofmongo.rest.database import MongoDatabaseHandler

server_resource = Resource(handler=MongoServerHandler)
database_resource = Resource(handler=MongoDatabaseHandler)

def eurl(regex, *args, **kwargs):
    if regex.endswith(r'$'):
        regex = regex[:-1] + r'\.(?P<emitter_format>\w+?)$'
    else:
        regex += r'\.(?P<emitter_format>\w+?)'

    return url(regex, *args, **kwargs)

urlpatterns = patterns('',
    eurl(r'^(?P<host>[^/:]+?):(?P<port>\d+)$', server_resource, name='list-databases'),


    eurl(r'^(?P<host>[^/:]+?):(?P<port>\d+)/(?P<db>[^ .$/\\]{1,64})$', database_resource, name='show-database'),


    eurl(r'^(?P<host>[^/:]+?):(?P<port>\d+)/(?P<db>[^ .$/\\]{1,64})/(?P<collection>[^$]{1,64}?)$', database_resource, name='show-collection'),

)

