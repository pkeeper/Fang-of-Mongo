from django.views.generic.base import TemplateView
from django.core.urlresolvers import reverse

class IndexView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        return {
            'api': reverse('mango:api:database_list', kwargs={
                       'host': 'host',
                       'port': '0',
                       'api_name': 'v1',
                       'format': 'json'
                   })
        }
