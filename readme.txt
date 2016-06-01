FOLLOW THESE STEPS TO INSTALL
-----------------------------

0) run >git clone http://github.com/maxipaolucci/jira-parser.git

1) Install node and npm in your pc (to check if you already have it installed do >npm --version  and  >node --version)

2) run >npm install      (in the root folder of this project to install all the required packages)

3) Go to file ./node_modules/jira/lib/jira.js  edit private method this.makeUri.
    Modify the beginning of the basepath ('rest/api/') to 'jira/rest/api'

4.1) If gulp has not been installed before in this computer (you can check it doing >gulp --version) run >npm install gulp -g  (to install it globally and allow gulp commands in the console). If you already have gulp installed then goto step 4.2

4.2) run >gulp build     (to translate es2015 to common js and compile sass)

5) run >node app         (to start the local server)

6) navigate to this url to access the app: http://localhost:3000  and login using a valid jira user




FOLLOW THESE STEPS TO UPDATE
----------------------------

1) run >git pull       (to update the source code from GIT)

2) run >npm install    (to install new packages if someone new was added)

3) run >guip build     (to regenerate sass and translate es2015 into common js)

4) run >node app       (to start the server on port 3000)

5) navigate to this url to access the app: http://localhost:3000  and login using a valid jira user

