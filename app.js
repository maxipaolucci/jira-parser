var express = require('express');
var app = express();
var http = require("http");
var https = require("https");
var htmlparser = require("htmlparser2");

app.use(express.static('public'));

var port = 3000;
app.listen(port, function () {
    console.log('Listening on port %d', port);
});


app.get('/print', function (req, res) {
    if(req.query) {
        if(req.query.url === undefined) {
            res.send({message: "url cannot be undefined"});
        }
        var urlPrefix = req.query.url.match(/.*?:\/\//g);
        req.query.url = req.query.url.replace(/.*?:\/\//g, "");
        var options = {
            hostname: req.query.url
        };
        if(urlPrefix !== undefined && urlPrefix !== null && urlPrefix[0] === "https://") {
            options.port = 443;
            https.get(options, function(result) {
                processResponse(result);
            }).on('error', function(e) {
                res.send({message: e.message});
            });
        } else {
            options.port = 80;
            http.get(options, function(result) {
                processResponse(result);
            }).on('error', function(e) {
                res.send({message: e.message});
            });
        }
        var processResponse = function(result) {
            var data = "";
            result.on("data", function(chunk) {
                data += chunk;
            });
            var tags = [];
            var tagsCount = {};
            var tagsWithCount = [];
            result.on("end", function(chunk) {
                var parser = new htmlparser.Parser({
                    onopentag: function(name, attribs) {
                        if(tags.indexOf(name) === -1) {
                            tags.push(name);
                            tagsCount[name] = 1;
                        } else {
                            tagsCount[name]++;
                        }
                    },
                    onend: function() {
                        for(var i = 0; i < tags.length; i++) {
                            tagsWithCount.push({name: tags[i], count: tagsCount[tags[i]]});
                        }
                    }
                }, {decodeEntities: true});
                parser.write(data);
                parser.end();
                res.send({website: req.query.url, port: options.port, data: data, tags: tagsWithCount});
            });
        }
    }
});

