
require('dotenv').config();

var twitter = require("./server/twitter.controller");
var analyzer = require("./server/analysis.controller");
var utils = require("./server/utils")

var express     = require('express');  
var bodyParser = require('body-parser');

var app = express();  
var server = require('http').Server(app);
require("./server/streams.controller")(server);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());      

twitter.init();
var port = process.env.PORT||8080;

app.get('/', function(req, res) {  
    res.sendfile(_dirname+'/public/index.html');                
});

app.post("/api/search",function(req,res){
    twitter.searchHastag(req.body.text).then((tweets) => {
        tweets = utils.getSortedTweets(tweets);
        res.json(tweets);
    });
})

server.listen(port, function() {  
    console.log('App listening on port '+ port);
});



