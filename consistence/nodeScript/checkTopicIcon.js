/**
 * Created by HYFY on 15/3/9.
 */
require('./config/dataSchema');
var mongoose = require('mongoose');
var request = require('request');
var Topic = mongoose.model('Topic');
var wrongNum = 0;
console.log('==========================\n');
console.log('检查topic icon链接的有效性\n');
console.log('==========================\n');
Topic.find({icon: {$exists: true}}, function(err, topics){
    var topicsLength = topics.length;
    console.log('共需检查' + topicsLength + '个topic icon链接的有效性');
    var position = 0;
    var judgeLink = function(position){
        request.head(topics[position].icon, function(err, response, body){
            if(!err){
                if(response.statusCode === 200){}
                    //console.log('第' + position + 'topic icon连接有效');
                else {
                    ++wrongNum;
                    console.log(topics[position].name + '的icon连接无效' + '\nicon链接:' + topics[position].icon);
                }
            } else {
                console.log(err);
            }
            if(++position < topicsLength){
                judgeLink(position);
            } else {
                console.log('done');
                console.log('共有' + wrongNum + '个topic icon 有问题');
                process.exit();
            }
        });
    };
    if(topicsLength > 0){
        judgeLink(position);
    } else{
        process.exit();
    }
});