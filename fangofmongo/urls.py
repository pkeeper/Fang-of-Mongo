# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, include

urlpatterns = patterns('',
    (r'^$', 'fangofmongo.views.start_page'),
    (r'ui/mongo/(?P<host>.+)/(?P<port>\d+)/$', 'fangofmongo.views.ui_page'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/cmd/$', 'fangofmongo.views.cmd'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/databases/$', 'fangofmongo.views.list_databases'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/database/(?P<dbname>.+)/stats/$', 'fangofmongo.views.db_stats'),

    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/database/(?P<dbname>.+)/cmd/$', 'fangofmongo.views.db_run_command'),

    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collections/(?P<dbname>.+)/$', 'fangofmongo.views.list_collections'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/stats/$', 'fangofmongo.views.coll_stats'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/indexes/$', 'fangofmongo.views.coll_indexes'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/save_document/$', 'fangofmongo.views.save_document'),

    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/query/$', 'fangofmongo.views.coll_query'),

    (r'rest/mongo/cmd/$', 'fangofmongo.views.exec_cmd'),
)
