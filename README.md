**Running my app**

You will need to login to a MySQL server on your machine.
* Login as root
* go to the mysql folder of the project and execute the sql statements in "mysql-dump-full.sql"
* it will automatically create the database and a user.
* in src/config, I have two files that is configured to run either as local MySQL database or through MAMP.
  MAMP requires a specially configuration for nodejs to use it.
* if you're using MAMP, create an environment variable NODE_ENV=mamp
* if you're using a local MySQL database, the config will default to the local configuration.
* Issue the command: npm install
* After the files have loaded, issue the command: npm start
* There are two users "phuoc" and "phuoc1". The password for both is "mypassword". "phuoc" is admin user.
