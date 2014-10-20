db.users.find({}).forEach(function (doc) {
    db.tracks.update(
        {
            "data.properties.username": doc.username
        }, {
            $set: {
                "data.properties._id": doc._id.str
            }
        }, {
            multi: true
        });
});