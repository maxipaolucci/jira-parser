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

var useMocks = false;

var jira = null; //will contain the jira object created on login route

var clearLoginData = function () {
    config.user = null;
    config.password = null;
    jira = null;
};

/**
 * Get a mocked issue from disk and send is as a parameter of the callback fn
 * @param (string) fileName . The name of the mock to load without the json extension
 * @param callback . The callback fn.
 */
var getMockedData = function(fileName, callback) {
    var url = './mocks/' + fileName + '.json';
    fs.readFile(url, 'utf8', function (error, data){
        if (error) {
            error.status = "error";
            error.codeno = 404;
            error.msg = "getMockedData: Error retrieving mocked issue data";
            res.status(404).json(error);
        }

        data = JSON.parse(data);
        callback(data);
    });
};


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
            if (useMocks) {
                //use mocked data
                getMockedData('ticket', function (data) {
                    data.status = "success";
                    data.codeno = 200;
                    data.msg = "";
                    res.json(data);
                });
            } else {
                var errorResponse = {};
                errorResponse.status = "error";
                errorResponse.codeno = 404;
                errorResponse.msg = "findIssue: Error retrieving mocked issue data";
                errorResponse.data = error;
                res.status(404).json(error);
            }
        } else {
            issue.status = "success";
            issue.codeno = 200;
            issue.msg = "";
            res.json(issue);
        }
    });
});

/**
 * login user
 */
app.post('/login', urlencode, function (req, res) {

    config.user = req.body.username;
    config.password = req.body.password;

    if (config.user && config.password) {
        jira = new JiraApi(config.protocol, config.host, config.port, config.user, config.password, config.apiVersion);
        
        jira.searchUsers(config.user, 0, 1, true, false, function (error, users) {
            console.log(users);
            if (error) {
                if (useMocks) {
                    //use mocked data
                    getMockedData('user', function (users) {
                        res.json(users[0]);
                    });
                } else {
                    var errorResponse = {};
                    errorResponse.status = "error";
                    errorResponse.codeno = 404;
                    errorResponse.msg = "searchUsers: Service failed";
                    errorResponse.data = {error};
                    clearLoginData();
                    res.status(404).json(errorResponse);
                }
            } else if (users[0].name == config.user && users[0].active) {
                users[0].status = "success";
                users[0].codeno = 200;
                users[0].msg = "";
                res.json(users[0]);
            } else {
                clearLoginData();
                var data = {status: "error", codeno: 404, msg: "login: User not found"};
                res.status(404).json(data);
            }
        });
    } else {
        clearLoginData();
        var data = {status: "error", codeno: 404, msg: "login: Username and/or password could not be empty"};
        res.status(404).json(data);
    }
});

/**
 * Logout user
 */
app.get('/logout', function (req, res) {
    clearLoginData();
    res.json({ status : "success", codeno : 200, msg : ""});
});