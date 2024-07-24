console.log("lets write some javascript")
let currentSong = new Audio()
let songs;
let currfolder;




function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}




async function getsongs(folder){
    currfolder = folder;
    
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    console.log("response")
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> 
                             <div class="info">
                                <div> ${song.replaceAll("%20"," ")}</div>
                                </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="playmusic.svg" alt="" srcset="">
                            </div>
                            
                           </li>`;
        
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
        
    })
    
}

    const playmusic = (track)=>{
        //let audio = new Audio("/songs/" + track)
        //audio.play()
        currentSong.src = `/${currfolder}/` + track
        currentSong.play()
        play.src = "pause.svg"
        document.querySelector(".songinfo").innerHTML = track
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


    }
        
        


async function main(){
    

     songs = getsongs("songs/punjabi")  //get the list of all songs
     console.log(songs)
    
     // Show all the songs in the playlist
   
    //add eventlistener to each song
   
    // Attach an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-130%"
    })
    //add an event listener to previous
    previous.addEventListener("click", () => {
        //currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    //add an event listener to next
    next.addEventListener("click", () => {
        //currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    //add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("click",(e)=>{
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value)/100

    })

    //load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",  async item=>{
            songs =  await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            item.dataset.folder
        })
        
    });

    
//return songs
}

//const playMusic = (track, pause = false) => {
  //  currentSong.src = `/${currFolder}/` + track
    //if (!pause) {
      //  currentSong.play()
        //play.src = "pause.svg"
    //}}
main()