from fangofmongo.rest.generic import GenericMongoHandler

class MongoCollectionHandler(GenericMongoHandler):

    def on_read(self, request, **kwargs):
        db, collection = self.validate_presence_of('db', 'collection', **kwargs)

        with self.get_mongo(db, collection) as mongo_collection:
            pass


