db.rooms.find({flag:{$exists:true}}).forEach(function(room){
    var index = 0;
    db.users.find({"privacy.username":{$regex: '^'+room.flag, $options: 'i' }}).forEach(function(user){
        var number = parseFloat(user.privacy.username.toLowerCase().split(room.flag.toLowerCase())[1]);
        /*print(user.privacy.username.split(room.flag)[1])*/
        if(isNaN(number))
            print('number:' + number + ' username:' + user.privacy.username + ' flag:' + room.flag);
        if(number > index) index = number;
    });
    if(index != room.index && index > room.index) {
        print('room index:'+room.index+' shouldbe:' + index);
        room.index = index;
        db.rooms.save(room);
    }
});