from collections import namedtuple
from contextlib import contextmanager
import pymongo
from pymongo.errors import PyMongoError

from django.core.urlresolvers import reverse


from piston.handler import AnonymousBaseHandler
from piston.utils import rc

class MongoHandlerError(Exception): pass

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


class GenericMongoHandler(AnonymousBaseHandler):
    allowed_methods = ('GET',)

    ALL_OK = rc.ALL_OK
    CREATED = rc.CREATED
    DELETED = rc.DELETED
    BAD_REQUEST = rc.BAD_REQUEST
    FORBIDDEN = rc.FORBIDDEN
    NOT_FOUND = rc.NOT_FOUND
    DUPLICATE_ENTRY = rc.DUPLICATE_ENTRY
    NOT_HERE = rc.NOT_HERE
    INTERNAL_ERROR = rc.INTERNAL_ERROR
    NOT_IMPLEMENTED = rc.NOT_IMPLEMENTED
    THROTTLED = rc.THROTTLED

    def __init__(self):
        self.host = "localhost"
        self.port = 27017

        self.kwargs = {}

        self.__server_info = None

    def get_serverinfo(self, only_conn_params=False):
        if self.__server_info is None:
            host = self.kwargs.get('host', self.host)
            port = int(self.kwargs.get('port', self.port))

            try:
                connection = pymongo.Connection(host=host, port=port)
                build_info = connection['admin'].command({"buildinfo": 1})
            except PyMongoError:
                raise MongoHandlerError(self.INTERNAL_ERROR)
            connection.close()

            self.__server_info = {
                'host': host,
                'port': port,
                'buildinfo': build_info,
            }

        if only_conn_params:
            return {
                'host': self.__server_info['host'],
                'port': self.__server_info['port'],
            }
        return self.__server_info

    def get_url(self, name, *args, **kwargs):
        kws = dict(self.get_serverinfo(True),
                   emitter_format=self.kwargs.get('emitter_format'))

        for arg in args:
            kws.update(arg)

        kws.update(kwargs)

        return reverse('api:' + name, kwargs=kws)


    @contextmanager
    def get_mongo(self, db=None, collection=None, create_db=False, create_collection=False):

        try:
            connection = pymongo.Connection(**self.get_serverinfo(True))
        except PyMongoError:
            raise MongoHandlerError(self.INTERNAL_ERROR)

        try:
            if collection is not None:
                if db is None:
                    raise MongoHandlerError(self.BAD_REQUEST)
                if not create_db and db not in connection.database_names():
                    raise MongoHandlerError(self.NOT_FOUND)
                mongo_db = connection[db]
                if not create_collection and collection not in mongo_db.collection_names():
                    raise MongoHandlerError(self.NOT_FOUND)

                yield mongo_db[collection]

            elif db is not None:
                if not create_db and db not in connection.database_names():
                    raise MongoHandlerError(self.NOT_FOUND)

                yield connection[db]

            else:
                yield connection

        finally:
            connection.close()


    def validate_presence_of(self, *args):
        symbols = namedtuple('Arguments', args)
        sybmolstable = []
        for key in args:
            value = self.kwargs.get(key)
            if value is None:
                raise MongoHandlerError(self.BAD_REQUEST)
            sybmolstable.append(value)
        return symbols(*sybmolstable)

    def read(self, request, *args, **kwargs):
        self.kwargs = kwargs
        try:
            return self.on_read(request, *args, **kwargs)
        except MongoHandlerError as e:
            return e.message


    def on_read(self, request, *args, **kwargs):
        raise NotImplementedError
