const http = require(`http`);
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {exec} = require('child_process');

const clientServerIP = `YOUR-CLIENT-PUBLIC-IP-HERE`;
const webServerIP = `YOUR-PORT-LISTENER-SERVER-IP-HERE`;
const vlcPath = `YOUR-PATH-TO-VLC-HERE`;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const host = `localhost`;
const port = 8000;
var sendingBody = {"host":clientServerIP};

app.post('/', (req, res)=>{
    console.log("\n\n"+JSON.stringify(req.body.url));

    exec(`cd ${vlcPath} && vlc ${req.body.url} --one-instance --playlist-enqueue`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

        res.status(200);
        res.setHeader("Content-Type","text/plain");
        res.send("OK").end();    
})

const server = http.createServer(app);
server.listen(port, host, ()=>{
    console.log(`Server running on http://${host}:${port}`)
    fetch(webServerIP+`newhost`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(sendingBody)
      });
});