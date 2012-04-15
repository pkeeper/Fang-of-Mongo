from fangofmongo.rest.generic import GenericMongoHandler

class MongoServerHandler(GenericMongoHandler):

    def on_read(self, request, **kwargs):
        with self.get_mongo() as connection:
            db_names = connection.database_names()

        return {
            'server': dict(self.get_serverinfo(), **{
                'databases': [{
                    'name': db,
                    'resource': self.get_url('show-database', {'db':db}, **kwargs)
                } for db in db_names]
            }),
        }
