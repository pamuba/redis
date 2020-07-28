const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')

const PORT = 5000;
const REDIS_PORT = 6379;


//create redis client
const client =  redis.createClient(REDIS_PORT)

//start express web server

const app = express();


//set response
 function setResponse(username, repos){
     return `<h2>${username} has ${repos} Github repos</h2>`
 }


//Make request to github for data
async function getRepos(req, res, next){
    try{
        console.log('Fetching Data...')
        const{ username } = req.params;
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
       

        const repos = data.public_repos;

        //Set data to redis

        client.setex(username, 30, repos);

        res.send(setResponse(username, repos));

    }catch(err){
        console.error(err);
        res.status(500);//server error
    }
}



app.get('/repos/:username', getRepos);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
