import warnings

from utils import rc
from django.conf import settings

typemapper = { }
handler_tracker = [ ]

class HandlerMetaClass(type):
    """
    Metaclass that keeps a registry of class -> handler
    mappings.
    """
    def __new__(mcs, name, bases, attrs):
        new_cls = type.__new__(mcs, name, bases, attrs)

        def already_registered(model, anon):
            for k, (m, a) in typemapper.iteritems():
                if model == m and anon == a:
                    return k

        if hasattr(new_cls, 'model'):
            if already_registered(new_cls.model, new_cls.is_anonymous):
                if not getattr(settings, 'PISTON_IGNORE_DUPE_MODELS', False):
                    warnings.warn("Handler already registered for model %s, "
                        "you may experience inconsistent results." % new_cls.model.__name__)

            typemapper[new_cls] = (new_cls.model, new_cls.is_anonymous)
        else:
            typemapper[new_cls] = (None, new_cls.is_anonymous)

        if name not in ('BaseHandler', 'AnonymousBaseHandler'):
            handler_tracker.append(new_cls)

        return new_cls

class BaseHandler(object):
    """
    Basehandler that gives you CRUD for free.
    You are supposed to subclass this for specific
    functionality.

    All CRUD methods (`read`/`update`/`create`/`delete`)
    receive a request as the first argument from the
    resource. Use this for checking `request.user`, etc.
    """
    __metaclass__ = HandlerMetaClass

    allowed_methods = ('GET', 'POST', 'PUT', 'DELETE')
    anonymous = is_anonymous = False
    exclude = ( 'id', )
    fields =  ( )

    def flatten_dict(self, dct):
        return dict([ (str(k), dct.get(k)) for k in dct.keys() ])

    def has_model(self):
        return False

    def value_from_tuple(self, tu, name):
        for int_, n in tu:
            if n == name:
                return int_
        return None

    def exists(self, **kwargs):
        raise NotImplementedError

    def read(self, request, *args, **kwargs):
        return rc.NOT_IMPLEMENTED

    def create(self, request, *args, **kwargs):
        return rc.NOT_IMPLEMENTED

    def update(self, request, *args, **kwargs):
        return rc.NOT_IMPLEMENTED

    def delete(self, request, *args, **kwargs):
        raise NotImplementedError

class AnonymousBaseHandler(BaseHandler):
    """
    Anonymous handler.
    """
    is_anonymous = True
    allowed_methods = ('GET',)
