
import pymongo

from django.core.urlresolvers import reverse


from piston.handler import AnonymousBaseHandler
from piston.utils import rc

#read ->
#    0 obj - NOT_FOUND
#    1 obj - OK
#   +1 obj - BAD_REQUEST
#
#create ->
#    0 obj - OK
#    1 obj - DUPLICATE_ENTRY
#   +1 obj - DUPLICATE_ENTRY
#
#update ->
#    0 obj - NOT_FOUND
#    1 obj - ALL_OK
#   +1 obj - BAD_REQUEST
#
#delete ->
#    0 obj - NOT_HERE
#    1 obj - DELETED
#    +1 obj - DUPLICATE_ENTRY


class MongoServerHandler(AnonymousBaseHandler):
    allowed_methods = ('GET',)

    def read(self, request, **kwargs):
        host=kwargs.get('host', "localhost")
        port=kwargs.get('port', "27017")

        connection = pymongo.Connection(host=host, port=int(port))
        db_names = connection.database_names()
        connection.close()

        server = {
            'host': host,
            'port': port
        }

        db_url = lambda db: reverse('api:show-database', kwargs=dict(server, db=db, emitter_format=kwargs.get('emitter_format')))

        return {
            'server': dict(server, **{
                'databases': [dict(name=db, resource=db_url(db)) for db in db_names]
            }),
        }

class DatabaseHandler(AnonymousBaseHandler):
    allowed_methods = ('GET',)

    def read(self, request, **kwargs):
        db=kwargs.get('db')
        if db is None:
            return rc.BAD_REQUEST

        host=kwargs.get('host', "localhost")
        port=kwargs.get('port', "27017")

        connection = pymongo.Connection(host=host, port=int(port))

        if db not in connection.database_names():
            return rc.NOT_FOUND

        collection_names = connection[db].collection_names()
        connection.close()

        server = {
             'host': host,
             'port': port,
             'db': db
         }

        result = {
            'host': host,
            'port': port,
            'database': {
                'name': db,
                'resource': reverse('api:show-database', kwargs=dict(server, emitter_format=kwargs.get('emitter_format'))),
            }
        }

        cl_url = lambda cl: reverse('api:show-collection', kwargs=dict(server, collection=cl, emitter_format=kwargs.get('emitter_format')))

        result['database']['collections'] = [dict(name=cl, resource=cl_url(cl)) for cl in collection_names]

        return result

class CollectionHandler(AnonymousBaseHandler):
    allowed_methods = ('GET',)

    def read(self, request, **kwargs):
        db = kwargs.get('db')
        if db is None:
            raise rc.BAD_REQUEST

        collection = kwargs.get('collection')
        if collection is None:
            raise rc.BAD_REQUEST

        host=kwargs.get('host', "localhost")
        port=kwargs.get('port', "27017")

        connection = pymongo.Connection(host=host, port=int(port))

        if db not in connection.database_names():
            return rc.NOT_FOUND

        mongo_db = connection[db]

        if collection not in mongo_db.collection_names():
            return rc.NOT_FOUND

        mongo_collection = mongo_db[collection]
        connection.close()

        server = {
             'host': host,
             'port': port,
             'db': db
         }

        result = {
            'host': host,
            'port': port,
            'database': {
                'name': db,
                'resource': reverse('api:show-database', kwargs=dict(server, emitter_format=kwargs.get('emitter_format'))),
            }
        }

        cl_url = lambda cl: reverse('api:show-collection', kwargs=dict(server, collection=cl, emitter_format=kwargs.get('emitter_format')))

        result['database']['collections'] = [dict(name=cl, resource=cl_url(cl)) for cl in mongo_collection]

        return result
