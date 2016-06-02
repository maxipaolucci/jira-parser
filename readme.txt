FOLLOW THESE STEPS TO INSTALL
-----------------------------

1) run >git clone http://github.com/maxipaolucci/jira-parser.git

2) Install node and npm in your pc (to check if you already have it installed do >npm --version  and  >node --version)

3) run >npm install      (in the root folder of this project to install all the required packages)

4.1) If you already have gulp installed then goto step (4.2) If gulp has not been installed before in this computer
    (you can check it doing >gulp --version) run >npm install gulp -g     (to install it globally and allow gulp commands in the console).

4.2) run >gulp build     (to translate es2015 to common js and compile sass)

6) run >node app         (to start the local server)

7) navigate to this url to access the app: http://localhost:3000  and login using a valid jira user




FOLLOW THESE STEPS TO UPDATE
----------------------------

1) run >git pull       (to update the source code from GIT)

2) run >npm install    (to install new packages if someone new was added)

3) run >guip build     (to regenerate sass and translate es2015 into common js)

4) run >node app       (to start the server on port 3000)

5) navigate to this url to access the app: http://localhost:3000  and login using a valid jira user

