const http = require(`http`);
var express = require('express');
var bodyParser = require('body-parser');
const { response } = require('express');
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const host = `localhost`;
const port = 8000;
let clientServerIP = "1.1.1.1";

app.post('/', (req, res)=>{
    //when receiving the user's choice of song, send it to client if client exists
    //console.log("\n\n"+JSON.stringify(req.body.url));

    if(clientServerIP != "1.1.1.1"){
        fetch(clientServerIP, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(req.body)
        }).then((response)=>{
            console.log(response.status);
            if(response.status == 200){
                res.status(200);
                res.setHeader("Content-Type","text/plain");
                res.send("OK").end();
            }else{
                clientServerIP = "1.1.1.1";
                res.status(503);
                res.setHeader("Content-Type","text/plain");
                res.send("Not Currently Running a Reciever").end();
            }            
        });
    }
    else{
        res.status(503);
        res.setHeader("Content-Type","text/plain");
        res.send("Not Currently Running a Reciever").end();
    } 
})

app.post('/songsearch',(req,res)=>{
    //search youtube for the songs, send back array of songs
    let searchTerm = req.body.term;
    //console.log(searchTerm);
    let songs = new Array(20);
    const searchURL = `https://www.youtube.com/results?search_query=`;
    const IDRegex = /d":"\S\S\S\S\S\S\S\S\S\S\S","t/gm;
    const TitleRegex = /(?<=,"title":{"runs":\[{"text":").*?(?="}],"accessibility)/g;
    const AuthorRegex = /(?<=,"longBylineText":{"runs":\[{"text":").*?(?=","navigationEndpoint":)/g;
    const ViewCountRegex = /(?<=,"viewCountText":{"simpleText":").*?(?= views"},")/gm;
    fetch(searchURL+searchTerm+`%20official%20audio`, {
        method: "GET",
      }).then((response)=>{
        return response.text();
      }).then((string)=>{
        //console.log(string);
        let vidTitle = string.match(TitleRegex);
        let vidAuthor = string.match(AuthorRegex);
        let vidID = string.match(IDRegex);
        for(i = 0; i < vidID.length; i++){
            vidID[i] = vidID[i].substring(vidID[i].indexOf(`d":"`)+4,vidID[i].indexOf(`","t`));
        }
        let viewCount = string.match(ViewCountRegex);
        for(i=0;i<songs.length;i++){
            songs[i] = {title:vidTitle[i],author:vidAuthor[i],id:vidID[i],
            thumbnail:`https://i.ytimg.com/vi/`+vidID[i]+`/hq720.jpg`,url:`https://www.youtube.com/watch?v=`+vidID[i],views:viewCount[i]}
        }
        //console.log("JSON: " + songs + "\n\nStringified: " + JSON.stringify(songs));
        res.status(200);
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify(songs)).end();
      });
})

app.post('/newhost', (req, res)=>{
    //log and set the clientIP
    console.log(`New host connected at: ${req.body.host}`);

    clientServerIP = req.body.host;

    res.status(200);
    res.setHeader("Content-Type","text/plain");
    res.send("OK").end();
})

app.post(`/dc`, (req,res)=>{
    console.log(`Client at ${req.body.host} disconnected.`)
    
    clientServerIP = "1.1.1.1";

    res.status(200);
    res.setHeader("Content-Type", "text/plain");
    res.send("OK").end();
})

const server = http.createServer(app);
server.listen(port, host, ()=>{
    console.log(`Server running on http://${host}:${port}` )
});