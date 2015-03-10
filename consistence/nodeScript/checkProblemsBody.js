require('./config/dataSchema');
var mongoose = require('mongoose');
var _ = require('underscore');
var request = require('request');
var when = require('when');
var Problem = mongoose.model('Problem');
var Activity = mongoose.model('Activity');
var Chapter = mongoose.model('Chapter');
var Task = mongoose.model('Task');
var Topic = mongoose.model('Topic');
var linkArr = [];
var wrongNum = 0;
console.log('============================\n');
console.log('检查problem body 中链接的有效性\n');
console.log('============================\n');
Chapter.find({}, {name: 1, topics: 1}, function(err, chapters){
    chapters.forEach(function(chapter){
        chapter.populate('topics', 'name tasks', function(err, chapter){
            chapter.topics.forEach(function(topic){
                topic.populate('tasks', 'type activities', function(err, topic){
                    topic.tasks.forEach(function(task){
                        task.populate('activities', 'name problems', function(err, task){
                            task.activities.forEach(function(activity){
                                activity.populate('problems', 'type body disabled', function(err, activity){
                                    var problems = activity.problems;
                                    var problemsLength = problems.length;
                                    for(var i = 0; i < problemsLength; i++){
                                        var result = problems[i].body.match(/http:\/\/.+?'/ig);
                                        _.each(result, function(str){
                                            var problemId = problems[i]._id
                                            //var obj = {};
                                            //obj['problem_id'] = problems[i]._id;
                                            //obj['type'] = problems[i].type;
                                            //obj['disabled'] = problems[i].disabled;
                                            //obj['chapter'] = chapter.name;
                                            //obj['topic'] = topic.name;
                                            //obj['task'] = task.type;
                                            //obj['activity'] = activity.name;
                                            str = str.substring(0, str.length-1);
                                            //console.log(str + '  ' + obj['chapter'] + '  ' + obj['topic'] + '  ' + obj['task'] + '  ' + obj['activity']);
                                            //obj['src'] = str;
                                            //linkArr.push(obj);
                                            request.head(str, function(err, response, body){
                                                if(!err){
                                                    if(response.statusCode === 200){}
                                                    //console.log('第' + position + '个连接有效');
                                                    else {
                                                        //++wrongNum;
                                                        console.log(str + '  章节名称:' + chapter.name + '  知识点名称:' + topic.name + '  任务类型:' + task.type + '  activity名称:' + activity.name + '  problemId:' + problemId + '\n');
                                                    }
                                                } else {
                                                    //console.log(err);
                                                }
                                            });
                                        });
                                    }
                                })
                            })
                        })
                    })
                })
            })
        });
    });
}).exec(function(){
})