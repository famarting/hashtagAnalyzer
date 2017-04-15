var getEmptyResponseObject = function(){
    var tweets = {}
    tweets.positives = [];
    tweets.negatives = [];
    return tweets;
}

var getSortedTweets = function(tweets){
    tweets.positives.sort(sortPositiveTweets);
    tweets.negatives.sort(sortNegativeTweets);
    tweets.positives = tweets.positives.slice(0, 30);
    tweets.negatives = tweets.negatives.slice(0, 30);
    return tweets;
}

var sortPositiveTweets = function(a,b){
    if(a.score < b.score) return 1;
    if(a.score > b.score) return -1;
    return 0;
}

var sortNegativeTweets = function(a,b){
    if(a.score > b.score) return 1;
    if(a.score < b.score) return -1;
    return 0;
}

module.exports = {
    getEmptyResponseObject,
    getSortedTweets
}