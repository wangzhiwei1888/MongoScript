/**
 * Created by HYFY on 15/3/9.
 */
require('./config/dataSchema');
var mongoose = require('mongoose');
var _ = require('underscore');
var request = require('request');
var Chapter = mongoose.model('Chapter');
var wrongNum = 0;
console.log('==========================\n');
console.log('检查chapter icon链接的有效性\n');
console.log('==========================\n');
Chapter.find({state: 'published'}, function(err, chapters){
    var chaptersLength = chapters.length;
    console.log('共需检查' + chaptersLength + '个chapter icon链接的有效性');
    var position = 0;
    var judgeLink = function(position){
        request.head(chapters[position].icon, function(err, response, body){
            if(!err){
                if(response.statusCode === 200){}
                    //console.log('第' + position + '个chapter icon连接有效');
                else {
                    ++wrongNum;
                    console.log(chapters[position].name + '的icon连接无效' + '\nicon链接:' + chapters[position].icon);
                }
            } else {
                console.log(err);
            }
            if(++position < chaptersLength){
                judgeLink(position);
            } else {
                console.log('done');
                console.log(wrongNum + '个章节的icon链接有问题');
                process.exit();
            }
        })
    };
    chaptersLength > 0 ? judgeLink(position) : process.exit();
});