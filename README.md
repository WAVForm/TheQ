# TheQ
A website that queues music to a client.

I made this website so that people coming over to my house can queue up and listen to whatever music they want over my speakers. "But can't they just like go to your computer and just search the song and play it next," yeah okay I guess you've never been in a car with an AUX cord that gets passed around, try it! 

REQUIREMENTS : VLC (playing the music), Express and Body-Parser (for Node.JS)

If you want to get this up and running, edit the serverIP constants to whatever yours are inside the search.js and portlistenCLIENT.js, as well as the path to your VLC install inside the portlistenCLIENT.js. After that, make a server that serves the site data and runs the portlistenSERVER.js as a subdirectory or subdomain to avoid CORS, then from there you should be all good. 
