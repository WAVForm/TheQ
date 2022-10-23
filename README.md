# A website that queues music to a client.
#### REQUIREMENTS : [Node 19.0.0](https://nodejs.org/en/) or install [node-fetch](https://www.npmjs.com/package/node-fetch), [VLC](https://www.videolan.org/vlc/) on client, [Express](https://www.npmjs.com/package/express) and [Body-Parser](https://www.npmjs.com/package/body-parser) on client and server

I made this website so that people coming over to my house can queue up and listen to whatever music they want over my speakers. 

> "But can't they just like go to your computer and just search the song and play it next"

Yeah okay I guess you've never been in a car with an AUX cord that gets passed around, try it!


If you want to get this up and running, edit the ***serverIP*** constants to whatever yours are inside the **search.js** and **portlistenCLIENT.js**, as well as the ***path to your VLC install*** inside the **portlistenCLIENT.js**. After that, make a server that serves the site data and runs the portlistenSERVER.js as a subdirectory or subdomain to avoid CORS, then from there you should be all good.


###### NOTE: if you are having issues streaming YouTube videos you will need to replace the youtube.luac inside .../VLC/lua/playlist with [this one](https://github.com/videolan/vlc/blob/master/share/lua/playlist/youtube.lua). 

###### NOTE: Raising the Network Caching value inside VLC's preferences might reduce stuttering at the cost of longer waits between each song. 
