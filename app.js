var express = require('express');
var app = express();
var JiraApi = require('jira').JiraApi;
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({extended: false});

var config = {
    protocol: 'https',
    host: 'jira.vodafone.co.nz',
    port: 443,
    user: null,
    password: null,
    apiVersion: '2'
};

var jira = null; //will contain the jira object created on login route

app.use(bodyParser.json());
app.use(express.static('public'));

var port = 3000;
app.listen(port, function () {
    console.log('Listening on port %d', port);
});


app.get('/findIssue/:issueNumber', function (req, res) {
    var issueNumber = req.params.issueNumber;

    jira.findIssue(issueNumber, function(error, issue) {
        if (error) {
            throw error;
            //res.redirect('/mock');
        } else {
            res.json(issue);
        }

    });
});

app.get('/mock', function (req, res) {
    fs.readFile('./mocks/ticket.json', 'utf8', function (error, data){
        data = JSON.parse(data);
        res.json(data);
    });
});

app.post('/login', urlencode, function (req, res) {
    config.user = req.body.username;
    config.password = req.body.password;
    jira = new JiraApi(config.protocol, config.host, config.port, config.user, config.password, config.apiVersion);
    res.sendStatus(200);
});