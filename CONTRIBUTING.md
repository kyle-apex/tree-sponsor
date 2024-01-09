# Online IDE via GitPod

Fork repository and open in https://gitpod.io

# Locahost

Install MYSQL:
https://dev.mysql.com/downloads/mysql/

In Terminal

# Setup mysql command line command on mac (it may ask for computer passowrd)

sudo sh -c 'echo /usr/local/mysql/bin > /etc/paths.d/mysql'

# Close and reopen the terminal, then run this command - it will ask for the password you just setup for your mysql installation

mysql -u root -p

CREATE DATABASE treefolksyp
CREATE USER 'newUser' IDENTIFIED BY 'newUserPassword';
use treefolksyp;
GRANT ALL PRIVILEGES ON treefolksyp.\* TO 'newUser';
GRANT CREATE, ALTER, DROP, REFERENCES, INDEX, SELECT, INSERT, UPDATE ON \*.\* TO 'newUser';

Ensure node 14 or greater

npm install

npx prisma generate

npx primsa migrate deploy

npm run server
