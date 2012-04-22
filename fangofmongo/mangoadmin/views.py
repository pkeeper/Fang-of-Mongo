# Create your views here.
from django.core.urlresolvers import reverse
from django.views.generic.base import TemplateView

class IndexView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        return {
            'api': reverse('api:list-databases', kwargs={
                       'host': 'host',
                       'port': '0',
                       'emitter_format': 'json'
                   })
        }
