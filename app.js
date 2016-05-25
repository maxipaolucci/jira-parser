'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jira = require('jira');

var _jira2 = _interopRequireDefault(_jira);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JiraApi = _jira2.default.JiraApi;
var app = (0, _express2.default)();
var urlencode = _bodyParser2.default.urlencoded({ extended: false });

var jiraConnectionsMap = {}; //this map is going to host all the connections request made by every user that login in the server
var useMocks = true; //set this to true to use mocked data instead of real data from jira REST services
var jira = null; //this will contain the jira object capable to access jira services (jiraConfigObj) is used to create this one

//METHODS
/**
 * Return a new object capable to store the configuration to establish a connection against jira server
 * @param username
 * @param password
 * @returns boolean. True is the jira connection obj is successfully created, otherwise false.
 */
var createJiraConnection = function createJiraConnection(username, password) {

  var jiraConfigObj = {
    protocol: 'https',
    host: 'jira.vodafone.co.nz',
    port: 443,
    user: username,
    password: password,
    apiVersion: '2'
  };

  jira = new JiraApi(jiraConfigObj.protocol, jiraConfigObj.host, jiraConfigObj.port, jiraConfigObj.user, jiraConfigObj.password, jiraConfigObj.apiVersion);

  if (jira) {
    //adds the object to the map under the unique username
    jiraConnectionsMap[username] = jira;
    return true;
  }

  return false;
};

/**
 * this method clears all the connection data against Jira. Used mainly by logout service
 */
var clearLoginData = function clearLoginData(username) {
  if (username) {
    jiraConnectionsMap[username] = null;
  }
};

/**
 * Get a mocked issue from disk and send is as a parameter of the callback fn
 * @param (string) fileName . The name of the mock to load without the json extension
 * @param callback . The callback fn.
 */
var getMockedData = function getMockedData(fileName, callback) {
  var url = './mocks/' + fileName + '.json';

  _fs2.default.readFile(url, 'utf8', function (error, data) {
    if (error) {
      var errorResponse = {
        status: "error",
        codeno: 400,
        msg: "getMockedData: Error retrieving mocked issue data",
        data: error
      };
      callback(errorResponse);
    } else {
      data = JSON.parse(data);
      callback(data);
    }
  });
};

//MIDLEWARES
app.use(_bodyParser2.default.json());
app.use(_express2.default.static('public'));

var authMiddleware = function authMiddleware(req, res, next) {
  //authentication middleware
  var username = null;
  if (req.method === 'POST') {
    username = req.body.username;
  } else {
    username = req.params.username;
  }

  if (!username || !jiraConnectionsMap[username]) {
    res.status(400).json({
      status: "error",
      codeno: 666,
      msg: 'auth middleware (666): Invalid or empty username or the username has not got a valid jira session. Username: ' + username
    });
  } else {
    next();
  }
};

//SERVER STARTER
var port = 3000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
});

//SERVICES
app.get('/findIssue/:username/:issueNumber', authMiddleware, function (req, res) {
  var issueNumber = req.params.issueNumber;
  var username = req.params.username;

  if (issueNumber) {
    jiraConnectionsMap[username].findIssue(issueNumber, function (error, issue) {
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
          errorResponse.msg = 'findIssue: Issue not found number: ' + issueNumber;
          errorResponse.data = error;
          res.status(404).json(errorResponse);
        }
      } else {
        issue.status = "success";
        issue.codeno = 200;
        issue.msg = issueNumber;
        res.json(issue);
      }
    });
  } else {
    res.status(400).json({ status: "error", codeno: 400,
      msg: 'findIssue: Invalid or empty issueNumber. IssueNumber: ' + issueNumber });
  }
});

/**
 * login user
 */
app.post('/login', urlencode, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    if (createJiraConnection(username, password)) {
      jiraConnectionsMap[username].searchUsers(username, 0, 1, true, false, function (error, users) {
        if (error) {
          if (useMocks) {
            //use mocked data
            getMockedData('user', function (users) {
              res.json(users[0]);
            });
          } else {
            var errorResponse = {
              status: "error",
              codeno: 404,
              msg: 'searchUsers: User no found for username: ' + username,
              data: error
            };
            clearLoginData(username);
            res.status(404).json(errorResponse);
          }
        } else if (users[0].name == username && users[0].active) {
          users[0].status = "success";
          users[0].codeno = 200;
          users[0].msg = "";
          res.json(users[0]);
        } else {
          clearLoginData(username);
          var data = {
            status: "error",
            codeno: 404,
            msg: 'login: User found but does not match the logedin one. Username: ' + username + ', found: ' + users[0].name
          };
          res.status(404).json(data);
        }
      });
    } else {
      var data = { status: "error", codeno: 404, msg: 'login: Failed to create jira object with user: ' + username };
      res.status(404).json(data);
    }
  } else {
    var _data = { status: "error", codeno: 404, msg: "login: Username and/or password could not be empty" };
    res.status(404).json(_data);
  }
});

/**
 * Logout user
 */
app.get('/logout/:username', authMiddleware, function (req, res) {
  var username = req.params.username;
  clearLoginData(username);
  res.json({ status: "success", codeno: 200, msg: "" });
});