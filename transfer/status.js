var coursesC = {chapters:[]};
var tasksC = [], activitiesC = [], usersC = [];
db.users.find().forEach(user){
    usersC.push({username:user.privacy.username,user:user._id,rooms:user.rooms,school:user.school});
};

var find1 = function(key,value,array){
    for(var i in array){
        if(value == array[i][key])
            return array[i];
    }
    print("null");
    return null;
};

db.chapters.find({}).forEach(chapter){
    var chapter = cursor.next();
    var query = chapter.topics.slice(0);
    chapter.topics = [];
    db.topics.find({_id:{$in:query}}).forEach(topic){
        var query = topic.tasks.slice(0);
        topic.tasks = [];
        db.tasks.find({_id:{$in:query}}).forEach(task){
            var query = task.activities.slice(0);
            task.count = task.activities.length;
            task.activities = [];
            db.activities.find({_id:{$in:query}}).forEach(activity){
                if(task.type=="basic" || task.type=="elementary"){
                    activitiesC.push({_id:activity._id, 
                        chapter:chapter._id,topic:topic._id,task:task._id,count:task.count});
                }
                task.activities.push(activity);
            }
            if(task.type=="challenge"){
                tasksC.push({_id:task._id, chapter:chapter._id, topic:topic._id});
            }
            topic.tasks.push(task);
        }
        chapter.topics.push(topic);
    }
    coursesC.chapters.push(chapter);
}

//print(users);
//print(tasks);
//print(activities);
//print(courses);

var status = {};

db.userdatas.find({"data.is_complete":true}).forEach(userdata){
    if(tasks.indexOf(userdata.entityId)>-1){
        var task = find1('_id', ObjectId(userdata.entityId), task);
        var user = find1('username',userdata.userId,users)
        db.taskstatuses.update( {user:user._id,task:task._id},
                                {$set:{
                                    user:user._id, rooms:user.rooms, schools:user.school,
                                    task:task._id, topic:task.topic, chapter:task.chapter,
                                    isPassed:true, star:3,
                                    }
                                },
                                {multi:true,upsert:true});
        task.activities.forEach(function(activity){
            var set = {
                    user:user._id, rooms:user.rooms, schools:user.school,
                    task:task._id, topic:task.topic, chapter:task.chapter,
                    activity:activity._id,
                    isPassed:true
                    }
            if(activity.type == "elementary"){
                set.videos = true;
                set.problems = false;
            }
            db.activitystatuses.update( {user:user._id,activity:activity._id},
                                {$set: set},
                                {multi:true,upsert:true});
        });
    } else if(activities.indexOf(userdata.entityId)>-1){
        var activity = find1('_id', ObjectId(userdata.entityId), activities);
        var user = find1('username',userdata.userId,users);
        var set = {
            user:user._id, rooms:user.rooms, schools:user.school,
            task:activity.task, topic:activity.topic, 
            chapter:activity.chapter, activity:activity._id,
            isPassed:true
            }
        if(activity.type == "elementary"){
                set.videos = true;
                set.problems = false;
            }
        db.activitystatuses.update( {user:user._id,activity:activity._id},
                                    {
                                        $set:set
                                    },
                                    {multi:true,upsert:true});
        status[user._id.str] = status[user._id.str] || {};
        status[user._id.str][activity.task.str] = status[user._id.str][activity.task.str] || {};
        status[user._id.str][activity.task.str].count = 
            status[user._id.str][activity.task.str].count || activity.count;
        if(!status[user._id.str][activity.task.str][activity._id]){
            status[user._id.str][activity.task.str][activity._id] = true;
            status[user._id.str][activity.task.str] = status[user._id.str][activity.task.str].count - 1;
        }
        if(status[user._id.str][activity.task.str].count == 0){
            db.taskstatuses.update( {user:user._id,task:activity.task},
                                    {$set:{
                                        user:user._id, rooms:user.rooms, schools:user.school,
                                        task:activity.task, topic:activity.topic, chapter:activity.chapter,
                                        isPassed:true, star:1,
                                        }
                                    },
                                    {multi:true,upsert:true});
        }
    }
}
db.taskstatuses.dropIndexes();
db.taskstatuses.ensureIndex( { user: 1, task: 1 } );
db.activitystatuses.dropIndexes();
db.activitystatuses.ensureIndex( { user: 1, activity: 1 } );