var Twitter = require('twitter');
var analyzer = require("./analysis.controller")
 
var client;

var init = function(){
    return new Promise((resolve, reject) => {
        client = new Twitter({
            consumer_key: 'HfGGGDuSHvRhwatvumSchhpQt',
            consumer_secret: 'Tf5r9FEYnCQL5PLZVoVqBVqPwrorf9Bwjw0lgyHjHz0Ur9IOR2',
            access_token_key: '535441417-bLHipwflJlYPUI4lZHCfzLy4vxauQnzB0qnItPHt',
            access_token_secret: 'rY1DslSmwt4I06zgkjnCxadpgB2CSQ1Ms3u97O44PjFdd'
        });
        console.log("new tiwtter client");
        resolve();
    })
    
}

var searchHastag = function(hashtag){

    return new Promise((resolve,reject) => {
        var positives = [];
        var negatives = [];

        if(!hashtag.includes("#")){
            hashtag = "#"+hashtag;
        }

        client.get('search/tweets', {q: hashtag, count: 50, result_type: "polular", lang: "en"}, function(error, data, response) {
            var tweets = data.statuses;
            if(!tweets || error){
                reject(error)
            }
            for(var i in tweets){
                var tweet = tweets[i];
                var score = analyzer.classify(tweet.text);
                if(score>=0){
                    positives.push({score: score, tweet: tweet})
                }else {
                    negatives.push({score: score, tweet: tweet})
                }
            }

            var tweetsResponse = {}
            tweetsResponse.total = tweets.length;
            tweetsResponse.positives = positives;
            tweetsResponse.negatives = negatives;

            resolve(tweetsResponse)

        });
    })
}

var streamHashtag = function(hashtag, callback){

    if(!hashtag.includes("#")){
        hashtag = "#"+hashtag;
    }

    client.stream('statuses/filter', {track: hashtag},  function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            callback(tweet);
        });

        stream.on('error', function(error) {
            console.log(error);
        });
    });

}

module.exports = {
    init,
    searchHastag,
    streamHashtag
}
