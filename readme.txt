FOLLOW THESE STEPS
------------------

1) install node and npm
2) run npm install in a command line in the root folder of this project
3) in node_modules/jira/lib/jira.js  edit private method this.makeUri.
    Modify the beginning of the basepath ('rest/api/') to 'jira/rest/api'
4.1) If gulp was not been installed before in this computer (check it doing in command line >gulp --version) run in command line >npm install gulp -g  (to install it globally and allow gulp commands in the console). If you already have gulp installed then goto step 4.2
4.2) run in command line >gulp build     (to translate es2015 to common js and compile sass)
5) run in command line >node app       (to start the local server)
6) navigate to this url: http://localhost:3000
7) login using jira credentials
8) submit one or more jira tickets separated by comma (,).
