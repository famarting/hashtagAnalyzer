var express     = require('express');  
var bodyParser = require('body-parser');
var twitter = require("./server/twitter.controller");
var analyzer = require("./server/analysis.controller")
var app         = express();  

// Localización de los ficheros estáticos
app.use(express.static(__dirname + '/public'));
// Permite cambiar el HTML con el método POST                   
app.use(bodyParser.json());      

app.get('/', function(req, res) {  
    res.sendfile('./public/index.html');                
});

app.post("/api/search",function(req,res){
    twitter.searchHastag(req.body.text).then((data) => {
        var tweets = data;
        tweets.positives.sort(sortPositiveTweets);
        tweets.negatives.sort(sortNegativeTweets);
        res.json(tweets);
        //startStream(req.body.text,tweets);
    });
})

var startStream = function(hashtag, initialTweets){
    twitter.streamHashtag(hashtag,(tweet) => {
        var score = analyzer.classify(tweet.text);
        if(score>=0){

        }else{
            
        }
    });
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

// Escucha en el puerto 8080 y corre el server
twitter.init().then((data) => {
    var port = process.env.PORT||8080;
    app.listen(port, function() {  
        console.log('App listening on port '+ port);
    });
})
