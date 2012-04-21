from __future__ import generators

import decimal, inspect
from piston.utils import json_parse, json_stringify

try:
    # yaml isn't standard with python.  It shouldn't be required if it
    # isn't used.
    #noinspection PyUnresolvedReferences
    import yaml
    use_yaml = True
except ImportError:
    use_yaml = False


from django.utils.xmlutils import SimplerXMLGenerator
from django.utils.encoding import smart_unicode
from django.http import HttpResponse

from utils import HttpStatusCode, Mimer
from validate_jsonp import is_valid_jsonp_callback_value

try:
    import cStringIO as StringIO
except ImportError:
    import StringIO


class Emitter(object):
    """
    Super emitter. All other emitters should subclass
    this one. It has the `construct` method which
    conveniently returns a serialized `dict`. This is
    usually the only method you want to use in your
    emitter. See below for examples.

    `RESERVED_FIELDS` was introduced when better resource
    method detection came, and we accidentially caught these
    as the methods on the handler. Issue58 says that's no good.
    """
    EMITTERS = { }
    RESERVED_FIELDS = set([ 'read', 'update', 'create',
                            'delete', 'model', 'anonymous',
                            'allowed_methods', 'fields', 'exclude' ])

    def __init__(self, payload, typemapper, handler, fields=(), anonymous=True):
        self.typemapper = typemapper
        self.data = payload
        self.handler = handler
        self.fields = fields
        self.anonymous = anonymous

        if isinstance(self.data, Exception):
            raise

    def method_fields(self, handler, fields):
        if not handler:
            return { }

        ret = dict()

        for field in fields - Emitter.RESERVED_FIELDS:
            t = getattr(handler, str(field), None)

            if t and callable(t):
                ret[field] = t

        return ret

    def construct(self, use_fallback=True):
        """
        Recursively serialize a lot of types, and
        in cases where it doesn't recognize the type,
        it will fall back to Django's `smart_unicode`.

        Returns `dict`.
        """
        def _any(thing, fields=None):
            """
            Dispatch, all types are routed through here.
            """
            ret = None

            if isinstance(thing, (tuple, list, set)):
                ret = _list(thing, fields)
            elif isinstance(thing, dict):
                ret = _dict(thing, fields)
            elif isinstance(thing, decimal.Decimal):
                ret = str(thing)
            elif isinstance(thing, HttpResponse):
                raise HttpStatusCode(thing)
            elif inspect.isfunction(thing):
                if not inspect.getargspec(thing)[0]:
                    ret = _any(thing())
            elif hasattr(thing, '__emittable__'):
                f = thing.__emittable__
                if inspect.ismethod(f) and len(inspect.getargspec(f)[0]) == 1:
                    ret = _any(f())
            elif use_fallback:
                ret = smart_unicode(thing, strings_only=True)
            else:
                ret = thing

            return ret

        def _list(data, fields=None):
            """
            Lists.
            """
            return [ _any(v, fields) for v in data ]

        def _dict(data, fields=None):
            """
            Dictionaries.
            """
            return dict([ (k, _any(v, fields)) for k, v in data.iteritems() ])

        # Kickstart the seralizin'.
        return _any(self.data, self.fields)

    def in_typemapper(self, model, anonymous):
        for klass, (km, is_anon) in self.typemapper.iteritems():
            if model is km and is_anon is anonymous:
                return klass

    def render(self, request):
        """
        This super emitter does not implement `render`,
        this is a job for the specific emitter below.
        """
        raise NotImplementedError("Please implement render.")

    def stream_render(self, request, stream=True):
        """
        Tells our patched middleware not to look
        at the contents, and returns a generator
        rather than the buffered string. Should be
        more memory friendly for large datasets.
        """
        yield self.render(request)

    @classmethod
    def get(cls, format):
        """
        Gets an emitter, returns the class and a content-type.
        """
        if cls.EMITTERS.has_key(format):
            return cls.EMITTERS.get(format)

        raise ValueError("No emitters found for type %s" % format)

    @classmethod
    def register(cls, name, klass, content_type='text/plain'):
        """
        Register an emitter.

        Parameters::
         - `name`: The name of the emitter ('json', 'xml', 'yaml', ...)
         - `klass`: The emitter class.
         - `content_type`: The content type to serve response as.
        """
        cls.EMITTERS[name] = (klass, content_type)

    @classmethod
    def unregister(cls, name):
        """
        Remove an emitter from the registry. Useful if you don't
        want to provide output in one of the built-in emitters.
        """
        return cls.EMITTERS.pop(name, None)

class XMLEmitter(Emitter):
    def _to_xml(self, xml, data):
        if isinstance(data, (list, tuple)):
            for item in data:
                xml.startElement("resource", {})
                self._to_xml(xml, item)
                xml.endElement("resource")
        elif isinstance(data, dict):
            for key, value in data.iteritems():
                xml.startElement(key, {})
                self._to_xml(xml, value)
                xml.endElement(key)
        else:
            xml.characters(smart_unicode(data))

    def render(self, request):
        stream = StringIO.StringIO()

        xml = SimplerXMLGenerator(stream, "utf-8")
        xml.startDocument()
        xml.startElement("response", {})

        self._to_xml(xml, self.construct())

        xml.endElement("response")
        xml.endDocument()

        return stream.getvalue()

Emitter.register('xml', XMLEmitter, 'text/xml; charset=utf-8')
Mimer.register(lambda *a: None, ('text/xml',))


class JSONEmitter(Emitter):
    """
    JSON emitter, understands timestamps.
    """
    def render(self, request):
        cb = request.GET.get('callback', None)

        try:
            indent = int(request.GET.get('indent'))
        except (ValueError, TypeError):
            indent = None

        serialized = json_stringify(self.construct(use_fallback=False),
                                    indent=indent)

        # Callback
        if cb and is_valid_jsonp_callback_value(cb):
            return '%s(%s)' % (cb, serialized)

        return serialized


Emitter.register('json', JSONEmitter, 'application/json; charset=utf-8')
# curry json loader to accept specific pymongo json commands
Mimer.register(json_parse, ('application/json',))

if use_yaml:  # Only register yaml if it was import successfully.
    class YAMLEmitter(Emitter):
        """
        YAML emitter, uses `safe_dump` to omit the
        specific types when outputting to non-Python.
        """
        def render(self, request):
            return yaml.safe_dump(self.construct())

    Emitter.register('yaml', YAMLEmitter, 'application/x-yaml; charset=utf-8')
    Mimer.register(lambda s: dict(yaml.safe_load(s)), ('application/x-yaml',))
