from fangofmongo.rest.generic import GenericMongoHandler

class MongoDatabaseHandler(GenericMongoHandler):

    def on_read(self, request, **kwargs):
        db, = self.validate_presence_of('db')

        with self.get_mongo(db) as mongo_db:
            collection_names = mongo_db.collection_names()

        result = self.get_serverinfo()
        result['database'] = {
            'name': db,
            'resource': self.get_url('show-database', db=db),
        }
        result['database']['collections'] = [{
            'name': cl,
            'resource': self.get_url('show-collection', db=db, collection=cl)
        } for cl in collection_names]

        return result
