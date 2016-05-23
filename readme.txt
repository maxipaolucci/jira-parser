1) install node and npm
2) run npm install in a command line in the root folder of this project
3) in node_modules/jira/lib/jira.js  edit private method this.makeUri.
    Modify the beginning of the basepath ('rest/api/') to 'jira/rest/api'
4) run in command line >node app (to start the local server)
5) navigate to this url: http://localhost:3000
6) login using jira credentials
7) submit one or more jira tickets separated by comma (,).