var coursesC = {chapters:[]};
var tasksC = {}, activitiesC = {}, idsC = [];

db.chapters.find({}).forEach(function(chapter){
    var query = chapter.topics.slice(0);
    chapter.topics = [];
    db.topics.find({_id:{$in:query}}).forEach(function(topic){
        var query = topic.tasks.slice(0);
        topic.tasks = [];
        db.tasks.find({_id:{$in:query}}).forEach(function(task){
            var query = task.activities.slice(0);
            task.count = task.activities.length;
            task.activities = [];
            db.activities.find({_id:{$in:query}}).forEach(function(activity){
                if(task.type=="advanced" || task.type=="elementary"){
                    activitiesC[activity._id.str] = {_id:activity._id, type:task.type,
                        chapter:chapter._id,topic:topic._id,task:task._id,count:task.count};
                    idsC.push(activity._id.str);
                }
                task.activities.push(activity);
            });
            if(task.type=="challenge"){
                tasksC[task._id.str] = {_id:task._id, chapter:chapter._id, topic:topic._id, 
                                        activities: task.activities};
                idsC.push(task._id.str);
            }
            topic.tasks.push(task);
        });
        chapter.topics.push(topic);
    });
    coursesC.chapters.push(chapter);
});

// print(tasksC);
// print(activitiesC);
// print(coursesC);
// print(idsC);

var status = {};


db.taskstatuses.drop();
db.activitystatuses.drop();
db.userdatas.find({"data.is_complete":true, "entityId":{$in:idsC}}).forEach(function(userdata){
//    print(userdata);
    var task = tasksC[userdata.entityId];
    var activity = activitiesC[userdata.entityId];
    var user = db.users.findOne({"privacy.username": userdata.userId});
    if(task == null && activity == null){
        print("lesson null" + userdata.entityId);
    }
    if(user == null){
        print("user null" + userdata.userId);
    }
    if(task && user){
        db.taskstatuses.update( {user:user._id,task:task._id,isPassed:true  },
                                {$set:{
                                    user:user._id, rooms:user.rooms, schools:user.school,
                                    task:task._id, topic:task.topic, chapter:task.chapter,
                                    isPassed:true, star:parseInt(3)
                                    }
                                },
                                {multi:true,upsert:true});
        task.activities = task.activities || [];
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
    }
    // activity和task可能同时存在！
    if(activity && user){
        var set = {
            user:user._id, rooms:user.rooms, schools:user.school,
            task:activity.task, topic:activity.topic, 
            chapter:activity.chapter, activity:activity._id,
            isPassed:true
            };
        if(activity.type == "elementary"){
                set.videos = true;
                set.problems = false;
            }
        db.activitystatuses.update( {user:user._id,activity:activity._id},
                                    {$set:set},
                                    {multi:true,upsert:true});
        status[user._id.str] = status[user._id.str] || {};
        status[user._id.str][activity.task.str] = status[user._id.str][activity.task.str] || {};
        status[user._id.str][activity.task.str].count = 
            status[user._id.str][activity.task.str].count || activity.count;
        if(!status[user._id.str][activity.task.str][activity._id]){
            status[user._id.str][activity.task.str][activity._id] = true;
            status[user._id.str][activity.task.str].count = status[user._id.str][activity.task.str].count - 1;
        }
        if(status[user._id.str][activity.task.str].count == 0){
            db.taskstatuses.update( {user:user._id,task:activity.task},
                                    {$set:{
                                        user:user._id, rooms:user.rooms, schools:user.school,
                                        task:activity.task, topic:activity.topic, chapter:activity.chapter,
                                        isPassed:true, star:parseInt(1)
                                        }
                                    },
                                    {multi:true,upsert:true});
        }
    }
});


db.taskstatuses.dropIndexes();
db.taskstatuses.ensureIndex( { user: 1, task: 1 }, { background: true });
db.activitystatuses.dropIndexes();
db.activitystatuses.ensureIndex( { user: 1, activity: 1 }, { background: true });