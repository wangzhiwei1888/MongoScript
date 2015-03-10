/**
 * Created by HYFY on 15/3/9.
 */
//检查chapter下面的topics是否是唯一的,根据topic.name
require('./config/dataSchema');
var _  = require('underscore');
var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');
var Chapter = mongoose.model('Chapter');
var Topic = mongoose.model('Topic');
Chapter.find({state: 'published'}, function(err, chapters){
    console.log(chapters.length);
    chapters.forEach(function(chapter){
        var topics = chapter.topics;
        Topic.find({_id: {$in: topics}}, function(err, topics){
            var topicNameArr = _.pluck(topics, 'name');
            var uniqTopicNameTopic = _.uniq(topicNameArr);
            if(topicNameArr.length !== uniqTopicNameTopic.length){
                console.log(chapter.name + '的topics有问题', '有' + topicNameArr.length - uniqTopicNameTopic.length + '个多余');
            } else{
                console.log(chapter.name + '没问题');
            }
        });
    });
})