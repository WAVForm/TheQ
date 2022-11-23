//version 0.24
$(document).ready(()=>{

  $('#mobile-calltoaction').click(()=>{
    $('nav').css("display", "block");
    $('nav').css("animation", "nav-menu-opening 1s cubic-bezier(0.5, 0, 0.25, 1) 1");
    $('nav').css("width", "var(--mobile-menu-size)");
  });

  $('#mobile-exit').click( ()=>{
    $('nav').css("display", "block");
    $('nav').css("animation", "");
    setTimeout(()=>{
    $('nav').delay(1).css("animation", "nav-menu-opening 1s cubic-bezier(0.5, 0, 0.25, 1) 1 reverse");
    setTimeout(() => {
      $('nav').delay(1000).css("display", "none");
    }, "1000");
    },"1")
  });

  $('#song-search-button').click((event)=>{
    let search = $("#song-search").val()
    videoSearch(search);
  }) 

  $("#song-search").keyup((enter)=>{
    if (enter.keyCode === 13) {
        $("#song-search-button").click();
    }
  });

  
  let songSearched = false;
  let songs = new Array(20);
  let titleID = 0;
  let selectedSong;
  let lastSongSelected = 54321;
  const serverIP = `YOUR-SERVER-HERE`;

  function videoSearch(search){
    termBody = {"term":`${search}`};
    fetch(serverIP+`songsearch`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(termBody)
    }).then((response)=>{
      return response.text();
    }).then((string)=>{
      songs = JSON.parse(string);
      titleID=0;
      $(`#videos`).html(``);
      for(i=0; i<songs.length;i++){
      $("#videos").append(`<div id=video`+titleID+` class=video`+titleID+`></div>`);
      $("#video"+titleID).append(`<p id=song-title`+titleID+`>`+songs[i].title+` by `+songs[i].author+`</p>`);
      $("#video"+titleID).append(`<img id=song-image`+titleID+` src="`+songs[i].thumbnail+`"></img>`);
      titleID++;
    }
    }); 
    songSearched = true;
  }

  $("#videos").click((event)=>{
    if(songSearched == true){
      let targetID = event.target.id;
      targetID = targetID.match(/[0-9]+/gm);
      if(targetID != null){
        if(lastSongSelected != targetID){
          $(`#submit-button`).remove();
          $('#video'+lastSongSelected).css("animation" , "last-video 0.1s ease-in-out 1 alternate");
          $('#video'+lastSongSelected).css("border-color" , "var(--accent-color)");
          lastSongSelected = targetID;
          selectedSong = songs[targetID];
          $('#video'+targetID).css("animation" , "selected-video 1s ease-in-out infinite alternate");
          $('#video'+targetID).css("border-color" , "var(--secondary-color)");
          $("#video"+targetID).append(`<a id=submit-button>Submit</a>`);
          $(`#submit-button`).css('animation', `open-submit 1s ease-in-out`)
        }
      }
    }
  })


  $('#videos').on('click','#submit-button',(event)=>{
    fetch(serverIP, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(selectedSong)
    }).then((response)=>{
      if(response.status==503){
        alert(`No reciever connected to send song to...`);
      }else{
        alert(`SONG SUBMITTED!`);
      }
    });
  })
})