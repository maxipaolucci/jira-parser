var express = require('express');
var app = express();
var JiraApi = require('jira').JiraApi;
var fs = require('fs');


var config = {
    protocol: 'https',
    host: 'jira.vodafone.co.nz',
    port: 443,
    user: 'mpaoluc',
    password: 'Scot1234',
    apiVersion: '2'
};

var jira = new JiraApi(config.protocol, config.host, config.port, config.user, config.password, config.apiVersion);

app.use(express.static('public'));

var port = 3000;
app.listen(port, function () {
    console.log('Listening on port %d', port);
});


app.get('/jira', function (req, res) {
    jira.findIssue('ATG-5980', function(error, issue) {
        if (error) throw error;
        res.json(issue);
    });
});

app.get('/mock', function (req, res) {
    fs.readFile('./mocks/ticket.json', 'utf8', function (error, data){
        data = JSON.parse(data);
        res.json(data);
    });
});