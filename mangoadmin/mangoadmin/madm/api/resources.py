from tastypie import fields
from mangoadmin.madm.api.utils import json_parse, json_prepare, json_urlencode

try:
    from django.conf.urls import url
except ImportError:
    #noinspection PyDeprecation
    from django.conf.urls.defaults import url

from mangoadmin.madm.api.common import (
    MongoDBObject, MongoDBResource, MongoDBCollection,
    MongoDBResourceError)

__author__ = 'knutwalker@gmail.com (Paul Horn)'


class MongoDBDatabaseResource(MongoDBResource):
    name = fields.CharField(readonly=True, attribute='pk')
    collections = fields.ToManyField('mangoadmin.madm.api.MongoDBCollectionResource', 'cl', null=True, full=True)

    class Meta:
        resource_name = ''

    def override_urls(self):
        return [
            url(r"^(?P<host>[^/:]+?):(?P<port>\d+)\.(?P<format>\w+)$", self.wrap_view('dispatch_list'), name="database_list"),
            url(r"^(?P<host>[^/:]+?):(?P<port>\d+)/(?P<db>[^ .$/\\]{1,64})\.(?P<format>\w+)$", self.wrap_view('dispatch_detail'), name="database_detail"),
        ]

    def obj_get_list(self, request=None, **kwargs):
        with self.get_mongo() as connection:
            db_names = connection.database_names()

        return [MongoDBObject({
            'pk': db,
        }) for db in db_names]

    def obj_get(self, request=None, **kwargs):
        db, = self.validate_presence_of('db')
        with self.get_mongo(db) as mongo_db:
            collection_names = mongo_db.collection_names()

        return MongoDBObject({
            'pk': db,
            'cl': MongoDBCollection(MongoDBObject({
                'pk': cl,
            }) for cl in collection_names)
        })


    def alter_list_data_to_serialize(self, request, data):
        try:
            has_objects = 'objects' in data
        except TypeError:
            has_objects = False

        data = {
            'databases': data['objects'] if has_objects else data
        }
        return super(MongoDBDatabaseResource, self).alter_list_data_to_serialize(
            request, data)

    def alter_detail_data_to_serialize(self, request, data):
        try:
            has_objects = 'objects' in data
        except TypeError:
            has_objects = False

        data = {
            'database': data['objects'] if has_objects else data
        }
        return super(MongoDBDatabaseResource,
                     self).alter_detail_data_to_serialize(request, data)


    def get_resource_uri(self, bundle_or_obj):
        obj = bundle_or_obj.obj if hasattr(bundle_or_obj, 'obj') else bundle_or_obj
        kws = self._get_resource_uri_helper(**dict(db=obj.pk))

        print kws

        return self._build_reverse_url('mango:api:database_detail', kwargs=kws)



class MongoDBCollectionResource(MongoDBResource):
    name = fields.CharField(readonly=True, attribute='pk', null=True)

    class Meta:
        resource_name = ''

    def override_urls(self):
        return [
            url(r'^(?P<host>[^/:]+?):(?P<port>\d+)/(?P<db>[^ .$/\\]{1,64})/(?P<collection>[^/$]{1,64}?)\.(?P<format>\w+)$', self.wrap_view('dispatch_detail'), name='collection_detail'),
        ]

    def obj_get(self, request=None, **kwargs):
        _, collection = self.validate_presence_of('db', 'collection')
        return MongoDBObject({
            'pk': collection,
        })

    def alter_detail_data_to_serialize(self, request, data):
        db, collection = self.validate_presence_of('db', 'collection')
        try:
            has_objects = 'objects' in data
        except TypeError:
            has_objects = False

        data = {
            'TODO': 'gather stuff about collection and add resource uri for query',
            'database': {
                'name': db,
                'collection': data['objects'] if has_objects else data
            },
        }

        return super(MongoDBCollectionResource, self).alter_list_data_to_serialize(
            request, data)

    def get_resource_uri(self, bundle_or_obj):
        obj = bundle_or_obj.obj if hasattr(bundle_or_obj, 'obj') else bundle_or_obj
        db, = self.validate_presence_of('db')
        collection = obj.pk

        kws = self._get_resource_uri_helper(**dict(
            db=db, collection=collection, method='query'
        ))

        return self._build_reverse_url('mango:api:collection_query', kwargs=kws)



class MongoDBQueryResource(MongoDBResource):
    spec = fields.DictField(readonly=True, attribute='spec')
    result = fields.ListField(readonly=True, attribute='result')

    class Meta:
        resource_name = ''

    def _parse_query(self, request):
        params = dict([
            ('spec', json_parse),
            ('fields', json_parse),
            ('skip', int),
            ('limit', int),
            ('timeout', bool),
            ('snapshot', bool),
            ('tailable', bool),
            ('sort', json_parse),
            ('max_scan', int),
            ('slave_ok', bool),
            ('await_data', bool),
            ('partial', bool),
            ('manipulate', bool),
            ('read_preference', int),
            ('network_timeout', int),
        ])

        query = {}

        for key in request.GET:
            if key in params:
                coercer = params[key]
                if coercer is not None:
                    query[key] = coercer(json_prepare(request.GET.get(key)))
                else:
                    query[key] = request.GET.get(key)

        if 'limit' not in query:
            query['limit'] = 10

        return query

    def override_urls(self):
        return [
            url(r'^(?P<host>[^/:]+?):(?P<port>\d+)/(?P<db>[^ .$/\\]{1,64})/(?P<collection>[^/$]{1,64}?)/(?P<method>\w+)\.(?P<format>\w+)$', self.wrap_view('dispatch_detail'), name='collection_query'),
        ]

    def obj_get(self, request=None, **kwargs):
        method = kwargs.pop('method', None)
        if method == 'query':
            return self._query(request, **kwargs)

    def _query(self, request, **kwargs):
        db, collection = self.validate_presence_of('db', 'collection')
        query = self._parse_query(request)

        with self.get_mongo(db, collection) as mongo_collection:
            result = list(mongo_collection.find(**query))

        result = MongoDBObject({
            'spec': query,
            'result': result
        })

        return result


    def alter_detail_data_to_serialize(self, request, data):
        db, collection = self.validate_presence_of('db', 'collection')
        try:
            has_objects = 'objects' in data
        except TypeError:
            has_objects = False

        data = {
            'query': data['objects'] if has_objects else data,
            'database': {
                'name': db,
                'collection': {
                    'name': collection,
                },
            },
        }

        return super(MongoDBQueryResource, self).alter_list_data_to_serialize(
            request, data)

    def get_resource_uri(self, bundle_or_obj):
        obj = bundle_or_obj.obj if hasattr(bundle_or_obj, 'obj') else bundle_or_obj
        db, collection = self.validate_presence_of('db', 'collection')

        kws = self._get_resource_uri_helper(**dict(
            db=db, collection=collection, method='query'
        ))
        qry = json_urlencode(json_prepare(obj.spec))

        url = self._build_reverse_url('mango:api:collection_query', kwargs=kws)
        return (url + '?' + qry).rstrip('?')

