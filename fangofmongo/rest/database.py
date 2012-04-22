from fangofmongo.rest.generic import GenericMongoHandler

class MongoDatabaseHandler(GenericMongoHandler):

    def on_read(self, request, **kwargs):
        db, = self.validate_presence_of('db')

        with self.get_mongo(db) as mongo_db:
            collection_names = mongo_db.collection_names()

        return self.render_list_collections(db, collection_names)

    def render_list_collections(self, db, collection_names):
        result = {
            'server': dict(self.get_serverinfo(), **{
                'database': {
                    'name': db,
                    'resource': self.get_url('show-database', db=db),
                },
            })
        }

        result['server']['database']['collections'] = [{
            'name': cl,
            'resource': self.get_url('show-collection', db=db, collection=cl)
        } for cl in collection_names]

        return result
