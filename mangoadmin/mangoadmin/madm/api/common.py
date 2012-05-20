from collections import namedtuple
from contextlib import contextmanager

import pymongo
from pymongo.errors import PyMongoError
from tastypie.bundle import Bundle
from tastypie.resources import Resource

from django.http import HttpResponse


__author__ = 'knutwalker@gmail.com (Paul Horn)'


class MongoDBResourceError(Exception):
    """
    Should return something like this:
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
    """

    CODES = dict(ALL_OK = ('OK', 200),
                 CREATED = ('Created', 201),
                 DELETED = ('', 204),
                 BAD_REQUEST = ('Bad Request', 400),
                 FORBIDDEN = ('Forbidden', 403),
                 NOT_FOUND = ('Not Found', 404),
                 DUPLICATE_ENTRY = ('Conflict/Duplicate', 409),
                 NOT_HERE = ('Gone', 410),
                 INTERNAL_ERROR = ('Internal Error', 500),
                 NOT_IMPLEMENTED = ('Not Implemented', 501),
                 THROTTLED = ('Throttled', 503)
    )

    def __init__(self, return_code='INTERNAL_ERROR', *args, **kwargs):
        super(MongoDBResourceError, self).__init__(*args, **kwargs)

        self.__rc = self.CODES.get(
            return_code, self.CODES['INTERNAL_ERROR'])

    def get_response(self):
        r, c = self.__rc
        class HttpResponseWrapper(HttpResponse):
            """
            Wrap HttpResponse and make sure that the internal _is_string
            flag is updated when the _set_content method (via the content
            property) is called
            """
            def _set_content(self, content):
                """
                Set the _container and _is_string properties based on the
                type of the value parameter. This logic is in the construtor
                for HttpResponse, but doesn't get repeated when setting
                HttpResponse.content although this bug report (feature request)
                suggests that it should: http://code.djangoproject.com/ticket/9403
                """
                if not isinstance(content, basestring) and hasattr(content, '__iter__'):
                    self._container = content
                    self._is_string = False
                else:
                    self._container = [content]
                    self._is_string = True

            content = property(HttpResponse._get_content, _set_content)

        return HttpResponseWrapper(r, content_type='text/plain', status=c)



class MongoDBHelper(object):

    class mongoDB:
        host = "localhost"
        port = 27017
        kwargs = {}
        server_info = None

    def get_serverinfo(self, only_conn_params=False):
        if self.mongoDB.server_info is None:
            host = self.mongoDB.kwargs.get('host', self.mongoDB.host)
            port = int(self.mongoDB.kwargs.get('port', self.mongoDB.port))

            try:
                connection = pymongo.Connection(host=host, port=port)
                build_info = connection['admin'].command({"buildinfo": 1})
            except PyMongoError as e:
                print e
                raise MongoDBResourceError()
            connection.close()

            self.mongoDB.server_info = {
                'host': host,
                'port': port,
                'buildinfo': build_info,
            }

        if only_conn_params:
            return {
                'host': self.mongoDB.server_info['host'],
                'port': self.mongoDB.server_info['port'],
            }
        return self.mongoDB.server_info

    @contextmanager
    def get_mongo(self, db=None, collection=None, create_db=False, create_collection=False):

        try:
            connection = pymongo.Connection(**self.get_serverinfo(True))
        except PyMongoError as e:
            print e
            raise MongoDBResourceError()

        try:
            if collection is not None:
                if db is None:
                    raise MongoDBResourceError('BAD_REQUEST')
                if not create_db and db not in connection.database_names():
                    raise MongoDBResourceError('NOT_FOUND')
                mongo_db = connection[db]
                if not create_collection and collection not in mongo_db.collection_names():
                    raise MongoDBResourceError('NOT_FOUND')

                yield mongo_db[collection]

            elif db is not None:
                if not create_db and db not in connection.database_names():
                    raise MongoDBResourceError('NOT_FOUND')

                yield connection[db]

            else:
                yield connection

        finally:
            connection.close()

    def validate_presence_of(self, *args):
        symbols = namedtuple('Arguments', args)
        sybmolstable = []
        for key in args:
            value = self.mongoDB.kwargs.get(key)
            if value is None:
                raise MongoDBResourceError('BAD_REQUEST')
            sybmolstable.append(value)
        return symbols(*sybmolstable)


class MongoDBObject(object):
    def __init__(self, initial=None):
        self.__dict__['_data'] = {}

        if hasattr(initial, 'items'):
            self.__dict__['_data'] = initial

    def __getattr__(self, name):
        return self._data.get(name, None)

    def __setattr__(self, name, value):
        self.__dict__['_data'][name] = value

    def __repr__(self):
        return repr(self.__dict__['_data'])

    def __str__(self):
        return str(self.__dict__['_data'])

    def to_dict(self):
        return self._data


class MongoDBCollection(object):
    def __init__(self, initial=None):
        self.__dict__['_data'] = []

        if hasattr(initial, '__iter__'):
            self.__dict__['_data'] = list(initial)

    def all(self):
        return iter(self.__dict__['_data'])

    def __getitem__(self, item):
        return self.__dict__['_data'][item]

    def __setitem__(self, key, value):
        self.__dict__['_data'][key] = value

    def __repr__(self):
        return repr(self.__dict__['_data'])

    def __str__(self):
        return str(self.__dict__['_data'])

    def to_dict(self):
        return dict(self.__dict__['_data'])


class MongoDBResource(Resource, MongoDBHelper):

    class Meta:
        object_class = MongoDBObject

    def dispatch(self, request_type, request, **kwargs):
        self.mongoDB.kwargs = kwargs
        if hasattr(request, 'format'):
            self.mongoDB.kwargs['format'] = request.format
        return super(MongoDBResource, self).dispatch(request_type,
                                                     request, **kwargs)

    def _get_resource_uri_helper(self, *args, **kwargs):
        kws = dict(self.get_serverinfo(True),
                   format=self.mongoDB.kwargs.get('format', 'json'))

        for arg in args:
            kws.update(arg)
        kws.update(kwargs)

        if self._meta.api_name is not None:
            kws['api_name'] = self._meta.api_name

        return kws

    def determine_format(self, request):
        """
        Used to determine the desired format from the request.format
        attribute.
        """
        if (hasattr(request, 'format') and
            request.format in self._meta.serializer.formats):
            return self._meta.serializer.get_mime_for_format(request.format)
        return super(MongoDBResource, self).determine_format(request)

    def wrap_view(self, view):
        def wrapper(request, *args, **kwargs):
            request.format = kwargs.pop('format', None)
            wrapped_view = super(MongoDBResource, self).wrap_view(view)
            return wrapped_view(request, *args, **kwargs)
        return wrapper

    def alter_list_data_to_serialize(self, request, data):
        if isinstance(data, dict):
            return {
                'server': dict(self.get_serverinfo(), **data),
            }
        return super(MongoDBResource, self).alter_list_data_to_serialize(
            request, data)

    def alter_detail_data_to_serialize(self, request, data):
        if isinstance(data, dict):
            return {
                'server': dict(self.get_serverinfo(), **data),
            }
        return super(MongoDBResource, self).alter_detail_data_to_serialize(
            request, data)


