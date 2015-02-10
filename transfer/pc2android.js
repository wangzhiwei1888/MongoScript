// WARNING!!!
db.mobile_courses.drop();
db.createCollection("mobile_courses");
var chapterSeq = 1;
db.publishers.findOne({}).chapters.forEach(function(chapterId){
    var chapter = db.chapters.findOne({_id:chapterId},{name:1,icon:1,topics:1,guideVideo:1});
    chapter.count = 0;
    if(chapter.guideVideo){
        var video = db.videos.findOne({_id:chapter.guideVideo});
        chapter.video = {
            videoId: video._id,
            name: chapter.name + "的引入",
            url: video.url
        }
        delete chapter.guideVideo; 
        chapter.count = NumberInt(chapter.count + 1)
    }
    var topicIds = chapter.topics;
    chapter.seq = NumberInt(chapterSeq++);
    chapter.topics = [];
    var topicSeq = 1;
    topicIds.forEach(function(topicId){
        var topic = db.topics.findOne({_id:topicId},{name:1,tasks:1});
        var taskIds = topic.tasks;
        topic.seq = NumberInt(topicSeq++);
        topic.tasks = [];
        var seq = 1;
        var activities = [];
        taskIds.forEach(function(taskId){
            var task = db.tasks.findOne({_id:taskId},{name:1,activities:1});
            var actIds = task.activities;
            actIds.forEach(function(actId){
                var act = db.activities.findOne({_id:actId},{name:1,videos:1});
                if(!act.videos || act.videos.length == 0){
                    return;
                }
                act.activityId = act._id;
                act.seq = NumberInt(activities.length + 1);
                
                // video
                var video = db.videos.findOne({_id:act.videos[0]},{url:1});
                act.url = video.url;
                act.videoId = video._id;
                delete act.videos;
                act._id = task._id;
                
                activities.push(act);
                chapter.count = NumberInt(chapter.count + 1);
            });
        });
        topic.tasks = activities;
        chapter.topics.push(topic);
    });
    chapter.url = chapter.icon;
    delete chapter.icon;
    print(chapter);
    db.mobile_courses.update({_id:chapter._id},{$set:chapter},{upsert:true});
});