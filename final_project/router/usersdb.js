const fs = require('fs');

const usersFile = './usersdb.json';

let users = {};

if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile);
    users = JSON.parse(data);
}

module.exports = users;
