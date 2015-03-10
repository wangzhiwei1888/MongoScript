/**
 * Created by HYFY on 15/3/9.
 */
require('./config/dataSchema');
var mongoose = require('mongoose');
var _ = require('underscore');
var request = require('request');
var Activity = mongoose.model('Activity');
var wrongNum = 0;
console.log('========================\n');
console.log('检查video 缩略图链接的有效性\n');
console.log('========================\n');
Activity.find({thumbnail: {$exists: true}}, function(err, activities){
    var activitiesLength = activities.length;
    console.log('共需检查' + activitiesLength + '张图片链接的有效性');
    var position = 0;
    var judgeLink = function(position){
        request.head(activities[position].thumbnail, function(err, response, body){
            if(!err){
                if(response.statusCode === 200){}
                    //console.log('第' + position + '个图片连接有效');
                else {
                    +wrongNum;
                    console.log(activities[position].name + '中的视频缩略图链接有问题' + '\n图片链接:' + activities[position].thumbnail);
                }
            } else {
                //console.log(err);
            }
            if(++position < activitiesLength){
                judgeLink(position);
            } else {
                console.log('done');
                console.log('共有' + wrongNum + '个视频缩略图链接有问题');
                process.exit();
            }
        })
    };
    activitiesLength > 0 ? judgeLink(position) : process.exit();
});