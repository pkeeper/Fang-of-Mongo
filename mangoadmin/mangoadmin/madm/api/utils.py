from functools import partial
import urllib
import re
from django.utils import simplejson
from django.utils.encoding import smart_str
from django.core.serializers.json import DjangoJSONEncoder
try:
    from pymongo import json_util
except ImportError:
    from bson import json_util


single2double = partial(re.compile(r'(?<=[ [:,{])\'|\'(?=[\]:,}])').sub, '"')

def json_smart_str(s, encoding='utf-8', strings_only=False, errors='strict'):
    return single2double(smart_str(**locals()))

def json_urlencode(query, doseq=0):
    """
    A version of django's urlencode() function that replaces single quotes
    with double quotes to be JSON conform
    """
    if hasattr(query, 'items'):
        query = query.items()
    to_enc = []
    for k, v in query:
        to_enc.append((json_smart_str(k),
                       [json_smart_str(i) for i in v] if isinstance(v, (list,tuple))
                       else json_smart_str(v)))
    return urllib.urlencode(to_enc, doseq)

def json_prepare(obj):
    def _any(thing):
        if isinstance(thing, (tuple, list, set)):
            ret = _list(thing)
        elif isinstance(thing, dict):
            ret = _dict(thing)
        else:
            ret = json_smart_str(thing)

        return ret

    def _list(data):
        return list( _any(v) for v in data )

    def _dict(data):
        return dict( (json_smart_str(k), _any(v)) for k, v in data.iteritems() )

    return _any(obj)



class PyMongoJSONEncoder(DjangoJSONEncoder):

    def default(self, o):
        try:
            return json_util.default(o)
        except TypeError:
            return super(PyMongoJSONEncoder, self).default(o)

json_parse = partial(simplejson.loads, object_hook=json_util.object_hook)
json_stringify =  partial(simplejson.dumps, cls=PyMongoJSONEncoder, ensure_ascii=False)







