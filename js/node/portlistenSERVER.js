const http = require(`http`);
const URL = require(`url`).URL

const host = `localhost`;
const port = 8000;
let clientServerIP = "1.1.1.1";

function validateURL(urlString){
    try{
        new URL(urlString)
        return true
    }
    catch{
        return false
    }
}

const listener = function(req, res){
    let data = "";
    req.on('data', (chunk)=>{
        data += chunk;
    });
    req.on('end', ()=>{
        let body = JSON.parse(data);
        console.log(body);
        if(req.method == `POST` && req.url == `/`){

            if(validateURL(clientServerIP)){
                fetch(clientServerIP+"/song", {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify(body)
                }).then((response)=>{
                    console.log(response.status);
                    if(response.status == 200){
                        res.writeHead(200, {'Content-Type':'text/plain'})
                        res.end(`OK`); 
                    }else{
                        res.writeHead(503, {'Content-Type':'text/plain'})
                        res.end(`Not Currently Running a Reciever`); 
                    }            
                });
            }
            else{
                res.writeHead(503, {'Content-Type':'text/plain'})
                res.end(`Not Currently Running a Reciever`);
            }
    
        }else if(req.method == `POST` && req.url == `/songsearch`){
    
            let searchTerm = body.term;
            let songs = new Array(20);
            const searchURL = `https://www.youtube.com/results?search_query=`;
            const IDRegex = /d":"\S\S\S\S\S\S\S\S\S\S\S","t/gm;
            const TitleRegex = /(?<=,"title":{"runs":\[{"text":").*?(?="}],"accessibility)/g;
            const AuthorRegex = /(?<=,"longBylineText":{"runs":\[{"text":").*?(?=","navigationEndpoint":)/g;
            const ViewCountRegex = /(?<=,"viewCountText":{"simpleText":").*?(?= views"},")/gm;
            fetch(searchURL+searchTerm+`%20song`, {
                method: "GET",
            }).then((response)=>{
                return response.text();
            }).then((string)=>{
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
    
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(songs));
            });
    
        }else if(req.method == `POST` && req.url == `/newhost`){
            console.log(`New host connected at: ${body.host}`);
            clientServerIP = body.host;
    
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end('OK');
    
        }
    });
    
}

const serv = http.createServer(listener);
serv.listen(port,host,()=>{
    console.log(`Server running on http://${host}:${port}`)
})