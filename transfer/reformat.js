db.users.dropIndexes();
db.users.update({},
               {$rename:{
                   name:"profile.name",username:"privacy.username",
                   email:"privacy.useremail",gender:"profile.gender",
                   phone:"privacy.userphone",
                   have_profile:"tempAttribute.haveProfile",
                   is_temp:"tempAttribute.isTemp",
                   registDate:"usefulData.registDate",
                    },
                $unset:{provider:1, usergroup:1,beingwatched:1,apps:1,active:1,
                        survey1:1,loginDate:1},
                $set:{rooms:[]}
               },
               {multi:true});
db.users.find().forEach(function(user){
    if(user.remark == "来源于批量创建"){
        user.usefulData.from = "batch"
    }
    if(user.roles){
        if(user.roles.indexOf("teacher")>-1){
            user.role = "teacher"
        } else {
            user.role = "student"
        }
        delete user.roles;
    } else {
        user.role = "student";
    }
    if(user.grade){
        user.profile = user.profile || {};
        user.profile.grade = ""+user.grade;
        delete user.grade;
    }
    db.users.save(user);
});
db.users.ensureIndex( { "privacy.useremail": 1, "privacy.userphone": 1, "privacy.username": 1 } );

db.schools.update({},{$unset:{official:1}},{multi:true})
db.rooms.update({}, {$rename: {classNumber:"flag", students:"users"}, 
                     $unset:{newStudents:1}},{multi:true})
db.rooms.find().forEach(function(room){
    room.users = room.users || [];
    room.teachers = room.teachers || [];
    room.users = room.users.concat(room.teachers);
    db.users.update({_id:{$in:room.users}},{$addToSet:{rooms:room._id}},{multi:true});
    delete room.teachers;
    if(room.flag && (!room.index || room.index==0)){
        room.index = db.users.find({"privacy.username":{$regex: '^' + room.flag, $options: 'i'}}).count();
    }
    db.rooms.save(room);
});

