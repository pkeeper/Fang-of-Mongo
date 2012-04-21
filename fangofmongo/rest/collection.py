from django.http import HttpRequest
from fangofmongo.rest.generic import GenericMongoHandler
from piston.emitters import Emitter
from piston.utils import json_parse, to_bytes, json_urlencode

class MongoCollectionHandler(GenericMongoHandler):

    def on_read(self, request, **kwargs):
        method = kwargs.pop('method', None)
        if method == 'query':
            return self._query(request, **kwargs)

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
#                    query[key] = coercer(to_bytes(request.GET.get(key)).replace("'", '"'))
                    query[key] = coercer(to_bytes(request.GET.get(key)))
#                    query[key] = coercer(request.GET.get(key).replace("'", '"'))
                else:
                    query[key] = request.GET.get(key)

        return query


    def _query(self, request, **kwargs):
        """
        From GET take:  login, password : database credentials(optional, currently ignored)
             q -  mongo query as JSON dictionary
             sort - sort info (JSON dictionary)
             limit
             skip
             fields

        Return json with requested data or error
        """
        assert isinstance(request, HttpRequest)
        db, collection = self.validate_presence_of('db', 'collection')

        query = self._parse_query(request)

        with self.get_mongo(db, collection) as mongo_collection:
            result = list(mongo_collection.find(**query))

        return self._render_query(db, collection, query, result)

    def _render_query(self, db, collection, query, qry_result):
        emitter_cls, _ = Emitter.get('json')
        emitter = emitter_cls(query, None, None)
        qry = emitter.construct(use_fallback=False)
        qry = to_bytes(qry)
        qry = json_urlencode(qry)

        result = self.get_serverinfo()
        result['database'] = {
            'name': db,
            'resource': self.get_url('show-database', db=db),
            }
        result['database']['collection'] = {
            'name': collection,
            'resource': self.get_url('show-collection', db=db, collection=collection)
        }
        result['query'] = {
            'resource': (self.get_url('show-collection', db=db, collection=collection) + '?' + qry).rstrip('?'),
            'spec': query,
            'result': qry_result
        }



        return result

