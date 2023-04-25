//run 'node server.js' to run

const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 1999;//port for the server

async function notfoundpage(response, url) {//404 page goes here
    response.writeHead(404);
    response.write('404 page not , code: ', url);
    console.error('File not found: ', url)
}

app.get('/', (request, response) => { startingpoint(response) });//starting point request
app.get('/index.html', (request, response) => { startingpoint(response) });//starting point request

async function startingpoint(response) {//serve index.html
    response.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files
    try {
        response.writeHead(200, { 'Content-type': 'text/html' });//200 ok
        fs.readFile('www/index.html', function (err, databuffer) {
            if (err) {
                console.log(err);
            } else {
                response.write(databuffer);
            }
            response.end();//end response
        })
    } catch (err) {
        console.log('Catastrophy on index: ', err);
    }
}

//A test get
app.get('/get/test', (req, res) => {
    // Receive a small amount of test data and send back a response
    try {
        console.log('test get server');
        //test later
        req.on('data', function (data) {
            console.log('get raw payload: ', data, ' Parsed: ', JSON.parse(data));
            res.end(JSON.stringify({ test: "test get received" }));
        });
        //*** */
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.send(JSON.stringify({ test: 'test get is okay' }));
    } catch (error) {
        console.log('Catastrophy on test get: ', err);
    }
});

//a test post
app.post('/post/test', (req, res) => {
    //receive more data than a get
    console.log('test post to server');
    req.on('data', function (data) {
        console.log('Posted raw: ', data, ' Parsed: ', JSON.parse(data));
        res.end(JSON.stringify({ test: "test post received" }));
    });
});
app.get('/*', (request, responce) => {// 'catch all' equivalent
    console.log('requested Url: ', request.url);

    responce.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files

    //These need to be handled manually, with a bit of stringery
    if (request.url.indexOf('.css') != -1) {//requestuested url is a css file
        responce.setHeader('Content-type', 'text/css');//Set the header to css, so the client will expects a css document
    } else if (request.url.indexOf('.js') != -1) { //requestuested url is a js file
        responce.setHeader('Content-type', 'application/javascript');//Set the header to javascript, so the client will expects a javascript document
    } else if (request.url.indexOf('.html') != -1) {//requestuested url is a html file
        responce.setHeader('Content-type', 'text/html');//Set the header to html, so the client will expects a html document
    } else {
        //media handled automatically for now

    }
    if (request.url.indexOf('.') == -1) {//has no file type
        //console.log('404, redirect to starting point');
        //startingpoint(res)
    } else {
        writeresponce(responce, request.url.replace('/', 'www/'));//point to the folder with our web files
    }
});

app.listen(port, () => { console.log('Running on port ', port) })//Listen for requests, this starts the server


async function writeresponce(res, filepath) {
    //write files in responses, for static files in the /www folder

    try {
        fs.readFile(filepath, function (err, databuffer) {
            if (err) {
                res.writeHead(404);//not okay
                console.error(err);
            } else {
                res.writeHead(200);//200 ok
                res.write(databuffer);
            }
            res.end();//end response
        })
    } catch (error) {
        console.log(error);
    }
}

// prototype json database, just wanted to see if i could do it
const database = {
    initalize: function () {
        console.log('Initalize database');
        try {
            if (!fs.existsSync(path.join(__dirname, './database/'))) {
                console.log("Database does not exist");
                fs.mkdirSync(path.join(__dirname, './database/'));
            }

            if (!fs.existsSync(path.join(__dirname, './database/users.json'))) {
                console.log('Creating users record');
                fs.writeFileSync(path.join(__dirname, './database/users.json'), JSON.stringify({
                    db_version: 0,
                    users: [{ uname: "Anthonym", password: "0000" }]//favourite test user
                }));
            }
            
            if (!fs.existsSync(path.join(__dirname, './database/userdata/'))) {
                console.log('Creating user data directory')
                fs.mkdirSync(path.join(__dirname, './database/userdata/'));
            }
            console.log("Database is Go!!");
        } catch (error) {
            console.log('Startup error, check if node runtime has write permission in ', __dirname);
            console.warn(error);
        }
    },
    cleanup: async function () {
        console.log('CLean up database')
    },
    Create_user: async function (userdetails) {
        console.log('Add new user entry to database :', userdetails);
        /* 
            request Expects format: 
            userdetails = {
                uname:"",
                password:"",
                data:{}//initial data for user
            }
        */

        //!! Need to forbid unwritable characters or convert username with another primary key
        try {
            //check if this user already exists
            let userdata = JSON.parse(fs.readFile(path.join(__dirname, '/database/users.json'), { encoding: 'utf-8' }));

            //!! Improve matching later
            let user_is_found = false;
            for (let iterate in userdata.users) {
                if (userdata.users[iterate].uname == userdetails["uname"]) {
                    user_is_found = true;
                    console.log('Found user at: ', iterate);
                    break;
                }
            }
            if (user_is_found) {
                return false;//user will not be overwritten
            } else {
                //update users record
                userdata.users.push({
                    uname: userdetails.uname,
                    password: userdetails.password,
                });

                userdata.db_version = Number(userdata.db_version) + 1;
                fs.writeFileSync(path.join(__dirname, '/database/users.json'), JSON.stringify(userdata), { encoding: 'utf-8' });

                //create this specific users file
                fs.writeFileSync(path.join(__dirname, './database/userdata/' + userdetails["uname"] + '.json'), JSON.stringify({
                    version: 0,
                    lastupdate: new Date().getTime(),
                    data: userdetails.data || {},//initial data if any
                }));
                return true;//user should now be in database

            }



        } catch (error) {
            console.log('error ', error)
            return false;//handle later
        }


    },
    does_user_exist: async function (username) {
        console.log('Check database for user: ', username);
        let userdata = JSON.parse(fs.readFile(path.join(__dirname, '/database/users.json'), { encoding: 'utf-8' }));
        //check if this user already exists

        //!! Improve matching later
        let found = false;
        for (let iterate in userdata.users) {
            if (userdata.users[iterate].uname == username) {
                found = true;
                console.log('Found user at: ', iterate);
                break;
            }
        }
        return found;
    }
}

database.initalize();