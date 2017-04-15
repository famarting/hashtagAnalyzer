
var sentiment = require('sentiment');
var mls = require('ml-sentiment')();

var classify = function(tweet){
    var score = sentiment(tweet).score;
    if(score===0){
        score = mls.classify(tweet);
    }
    return score;
}

module.exports = {
    classify
}