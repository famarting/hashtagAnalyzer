
var utils = require("./utils");
var twitter = require("./twitter.controller")
var analyzer = require("./analysis.controller")

var io = require("socket.io");

var init = function(server){

    var ioServer = io(server);

    const maxTweets = 30;

    var streamsCache = new Map();

    ioServer.on("connection",(socket)=>{
        console.log("new websocket "+socket.id)
        socket.on("stream",(data)=>{
            console.log("stream request")
            var stream = streamsCache.get(socket.id); 
            if(stream){
                console.log("stream destroyed")
                stream.destroy();
            }
            startStream(data.hashtag,data.initialTweets,socket).then((stream)=>{
                streamsCache.set(socket.id, stream);
            });
        });
        socket.on('disconnect', function() {
        console.log('Got disconnect!');
        var stream = streamsCache.get(socket.id); 
        if(stream){
            console.log("stream destroyed")
            stream.destroy();
        }
        streamsCache.delete(socket.id);
    });
    });

    var startStream = function(hashtag, initialTweets,socket){

        return new Promise((resolve,reject)=>{
            var tweetsCounter = maxTweets;
            var tweets = initialTweets;
            twitter.streamHashtag(hashtag,(tweet) => {

                if(tweetsCounter===0){
                    tweets = utils.getSortedTweets(tweets);
                    console.log("emit update")
                    socket.emit("update",tweets);
                    tweetsCounter = maxTweets;
                }else{
                    tweetsCounter--;
                    var score = analyzer.classify(tweet.text);
                    if(score>=0){
                        tweets.positives.push({score: score, tweetId: tweet.id_str});
                    }else{
                        tweets.negatives.push({score: score, tweetId: tweet.id_str});
                    }
                }
                
            }).then((stream)=>{
                resolve(stream);
            });
        })

    }
}

module.exports=init;