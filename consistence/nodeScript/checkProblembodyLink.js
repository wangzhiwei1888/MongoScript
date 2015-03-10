/**
 * Created by HYFY on 15/3/9.
 */
require('./config/dataSchema');
var mongoose = require('mongoose');
var _ = require('underscore');
var request = require('request');
var Problem = mongoose.model('Problem');
var linkArr = [];
var wrongNum = 0;
console.log('============================\n');
console.log('检查problem body 中链接的有效性\n');
console.log('============================\n');
Problem.find({}, function(err, problems){
    var problemsLength = problems.length;
    for(var i = 0; i < problemsLength; i++){
        var result = problems[i].body.match(/http:\/\/.+?'/ig);
        _.each(result, function(str){
            var obj = {};
            obj['problem_id'] = problems[i]._id;
            obj['type'] = problems[i].type;
            str = str.substring(0, str.length-1);
            obj['src'] = str;
            linkArr.push(obj);
        });
    }
    var linkLength = linkArr.length;
    console.log('共需检查' + linkLength + '个链接的有效性');
    var position = 0;
    var judgeLink = function(position){
        request.head(linkArr[position].src, function(err, response, body){
            if(!err){
                if(response.statusCode === 200){}
                    //console.log('第' + position + '个连接有效');
                else {
                    ++wrongNum;
                    console.log('含有无效链接的problemId-->' + linkArr[position].problem_id + '\n链接:' + linkArr[position].src + '\n\n');
                }
            } else {
                console.log(err);
            }
            if(++position < linkLength){
                judgeLink(position);
            } else {
                console.log('done');
                console.log('共有' + wrongNum + '个链接有问题');
                process.exit();
            }
        })
    };
    linkLength > 0 ? judgeLink(position) : process.exit();
});