import express from 'express';
import _JiraApi from 'jira';
import fs from 'fs';
import bodyParser from 'body-parser';

let JiraApi = _JiraApi.JiraApi;
let app = express();
let urlencode = bodyParser.urlencoded({extended: false});

let jiraConnectionsMap = {}; //this map is going to host all the connections request made by every user that login in the server
let useMocks = false; //set this to true to use mocked data instead of real data from jira REST services
let jira = null; //this will contain the jira object capable to access jira services (jiraConfigObj) is used to create this one

//TODO use default parameters in required functions

//METHODS
/**
 * Return a new object capable to store the configuration to establish a connection against jira server
 * @param username
 * @param password
 * @returns boolean. True is the jira connection obj is successfully created, otherwise false.
 */
let createJiraConnection = (username, password) => {

  let jiraConfigObj = {
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
let clearLoginData = (username) => {
  if (username) {
    jiraConnectionsMap[username] = null;
  }
};

/**
 * Get a mocked issue from disk and send is as a parameter of the callback fn
 * @param (string) fileName . The name of the mock to load without the json extension
 * @param callback . The callback fn.
 */
let getMockedData = (fileName, callback) => {
  let url = './mocks/' + fileName + '.json';

  fs.readFile(url, 'utf8', (error, data) => {
    if (error) {
      let errorResponse = {
        status : "error",
        codeno : 400,
        msg : "getMockedData: Error retrieving mocked issue data",
        data : error
      };
      callback(errorResponse);
    } else {
      data = JSON.parse(data);
      callback(data);
    }
  });
};


//MIDLEWARES
app.use(bodyParser.json());
app.use(express.static('public'));

let authMiddleware = (req, res, next) => {
  //authentication middleware
  let username = null;
  if (req.method === 'POST') {
    username = req.body.username;
  } else {
    username = req.params.username;
  }

  if (!username || !jiraConnectionsMap[username]) {
    res.status(400).json({
      status: "error",
      codeno: 666,
      msg: `auth middleware (666): Invalid or empty username or the username has not got a valid jira session. Username: ${username}`
    });
  } else {
    next();
  }
};

//SERVER STARTER
let port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//SERVICES
app.get('/findIssue/:username/:issueNumber', authMiddleware, (req, res) => {
  let issueNumber = req.params.issueNumber;
  let username = req.params.username;

  if (issueNumber) {
    jiraConnectionsMap[username].findIssue(issueNumber, (error, issue) => {
      if (error) {
        if (useMocks) {
          //use mocked data
          getMockedData('ticket', (data) => {
            data.status = "success";
            data.codeno = 200;
            data.msg = "";
            res.json(data);
          });
        } else {
          let errorResponse = {};
          errorResponse.status = "error";
          errorResponse.codeno = 404;
          errorResponse.msg = `findIssue: Issue not found number: ${issueNumber}`;
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
    res.status(400).json({ status : "error", codeno : 400,
        msg : `findIssue: Invalid or empty issueNumber. IssueNumber: ${issueNumber}`});
  }
});

/**
 * login user
 */
app.post('/login', urlencode, (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (createJiraConnection(username, password)) {
      jiraConnectionsMap[username].searchUsers(username, 0, 1, true, false, (error, users) => {
        if (error) {
          if (useMocks) {
            //use mocked data
            getMockedData('user', (users) => {
              res.json(users[0]);
            });
          } else {
            let errorResponse = {
              status : "error",
              codeno : 404,
              msg : `searchUsers: User no found for username: ${username}`,
              data : error
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
            msg: `login: User found but does not match the logedin one. Username: ${username}, found: ${users[0].name}`
          };
          res.status(404).json(data);
        }
      });
    } else {
      let data = {status: "error", codeno: 404, msg: `login: Failed to create jira object with user: ${username}`};
      res.status(404).json(data);
    }
  } else {
    let data = {status: "error", codeno: 404, msg: "login: Username and/or password could not be empty"};
    res.status(404).json(data);
  }
});

/**
 * Logout user
 */
app.get('/logout/:username', authMiddleware, (req, res) => {
    let username = req.params.username;
    clearLoginData(username);
    res.json({ status : "success", codeno : 200, msg : ""});
});