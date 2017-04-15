var Twitter = require('twitter');
var analyzer = require("./analysis.controller")
 
var client;

var init = function(){
    return new Promise((resolve, reject) => {
        client = new Twitter({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token_key: process.env.ACCESS_TOKEN_KEY,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET
        });
        console.log("new tiwtter client");
        resolve();
    })
    
}

var searchHastag = function(hashtag){

    return new Promise((resolve,reject) => {
        var tweetsResponse = {}
        tweetsResponse.positives = [];
        tweetsResponse.negatives = [];

        if(!hashtag.includes("#")){
            hashtag = "#"+hashtag;
        }

        client.get('search/tweets', {q: hashtag, count: 100, result_type: "polular", lang: "en"}, function(error, data, response) {
            var tweets = data.statuses;
            if(!tweets || error){
                reject(error)
            }
            for(var i in tweets){
                var tweet = tweets[i];
                var score = analyzer.classify(tweet.text);
                if(score>=0){
                    tweetsResponse.positives.push({score: score, tweetId: tweet.id_str})
                }else {
                    tweetsResponse.negatives.push({score: score, tweetId: tweet.id_str})
                }
            }

            tweetsResponse.total = tweets.length;

            resolve(tweetsResponse)

        });
    })
}

var streamHashtag = function(hashtag, callback){

    return new Promise((resolve,reject)=>{
        if(!hashtag.includes("#")){
            hashtag = "#"+hashtag;
        }

        client.stream('statuses/filter',{track: hashtag, language: "en"},  function(stream) {
            stream.on('data', function(tweet) {
                callback(tweet);
            });

            stream.on('error', function(error) {
                console.log(error);
            });
            resolve(stream);
        });
    });

    
}

module.exports = {
    init,
    searchHastag,
    streamHashtag
}
