console.log("hello the js is initialized");

let currentSong = new Audio();
let songs = [];


function playMusic(track) {
    currentSong.src = track;
    currentSong.play();
    let sname = track.split("/");
    sname = sname[sname.length-1];
    sname = sname.replaceAll("%20", "")
    if (sname.length)
        document.querySelector(".songTitle").innerHTML = sname;
    play.firstElementChild.src = "images/pause.svg"
    // console.log(currentSong.duration)
}


function secondsToMinutesFormat(totalSeconds) {

    if (isNaN(totalSeconds)) {
        return "00:00";
    }

    totalSeconds = Math.floor(totalSeconds); // Convert decimal to integer

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;


    return `${formattedMinutes}:${formattedSeconds}`;
}







async function getSongs(folder) {

    let a = await fetch(folder);
    let b = await a.text();
    let div = document.createElement("div")
    div.innerHTML = b;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }

    }

    let songUL = document.querySelector(".songsList");
    songUL.innerHTML = "";
    for (let i = 0; i < songs.length; i++) {
        const e = songs[i];
        let songName = e.split("/");
        songName = songName[songName.length-1]
        songName = songName.replaceAll("%20", " ")

        songUL.innerHTML += `<li>${i + 1}.
                            <div class="image">
                                <img src="images/music.svg" alt="music">
                            </div>
                            <div class="songName">${songName}</div>
                            <div class="play">
                                <a href="${e}"></a>
                                <img src="images/play.svg" alt="play">
                            </div>
                        </li>`

    }

    // Attach event listener to play button/icon of each song    to play song and show title of song and duration in playbar.

    Array.from(document.querySelectorAll(".play")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.firstElementChild.href);
            // console.log("hello")

            // document.querySelector(".songDuration").innerHTML = "00:25/00:60";

        })
    });



}

async function main() {


    



    // Attach event listener to current song
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songTime").innerHTML = `${secondsToMinutesFormat(currentSong.currentTime)} / ${secondsToMinutesFormat(currentSong.duration)} `;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        if (currentSong.currentTime == currentSong.duration) {
            play.firstElementChild.src = "images/play1.svg"
        }

    })

    //Add event listener to seekbar play button 

    play.addEventListener("click", () => {
        if (currentSong.src == "") {
            if(songs.length!=0){
                playMusic(songs[0])
            }
            

        }
        else if (!currentSong.paused) {
            currentSong.pause();
            play.firstElementChild.src = "images/play1.svg"
        }
        else {
            currentSong.play()
            play.firstElementChild.src = "images/pause.svg";
        }
        if (currentSong.currentTime == currentSong.duration) {
            currentSong.currentTime = 0;
            play.firstElementChild.src = "images/pause.svg";
        }
    })

    // Add listener to seek bar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        if (currentSong.src.endsWith(".mp3")) {
            let seekbarPercent = e.offsetX / e.target.getBoundingClientRect().width * 100;
            currentSong.currentTime = (currentSong.duration * seekbarPercent) / 100;
            // console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        }

    })



    // Add event listener on hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
        document.querySelector(".left").style.width = "80vw";

    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-88%";

    })



    // Add event listener to next and previous

    next.addEventListener("click", () => {
        let sindex = songs.indexOf(currentSong.src);
        if (sindex + 1 < songs.length) {
            currentSong.pause();
            // console.log(songs.indexOf(currentSong.src));
            playMusic(songs[sindex + 1]);
        }
    })

    previous.addEventListener("click", () => {
        let sindex = songs.indexOf(currentSong.src);
        if (sindex - 1 >= 0) {
            currentSong.pause();
            // console.log(songs.indexOf(currentSong.src));
            playMusic(songs[sindex - 1]);
        }
    })




    // Add event listener on volume slide
    document.querySelector(".vol>input").addEventListener("input", (e) => {
        let a = e.target.value;
        currentSong.volume = a / 100;
        document.querySelector(".vol>img").src = "images/volume.svg";
        if (currentSong.volume == 0) {
            document.querySelector(".vol>img").src = "images/mute.svg";
        }
    })


    // Add event listener on volume icon
    document.querySelector(".vol>img").addEventListener("click", () => {
        if (document.querySelector(".vol>img").src.endsWith("volume.svg")) {
            document.querySelector(".vol>img").src = "images/mute.svg";
            document.querySelector(".vol>input").value = 0;
            currentSong.volume = 0;

        }
        else {
            document.querySelector(".vol>img").src = "images/volume.svg";
            document.querySelector(".vol>input").value = 10;
            currentSong.volume = 0.1;


        }
    })



    // Loading folders in the cardsContainer
    let displayFolders = async () => {
        let a = await fetch(`songs/`);
        let b = await a.text();
        let div = document.createElement("div")
        div.innerHTML = b;
        let as = div.getElementsByTagName("a")
        let folders = [];

        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.includes("/songs/")) {
                
                let foldersInfo = await fetch(`${element.href}/info.json`);
                // let foldersPic = await fetch(`${elemen t.href}cover.webp`);
                foldersInfo = await foldersInfo.json();

                document.querySelector(".cardsContainer").innerHTML += `<div data-folder="${element.href}" class="card">
                    <img src="${element.href}/cover.jpeg" alt="songs pic">
                    <h2>${foldersInfo.title}</h2>
                    <div>${foldersInfo.description}</div>
                    <div class="play-btn">
                        <img src="images/play-green.svg" alt="play" width="60">
                    </div>
                </div>`;
            }

        }

        //Add event listener on all the cards

        document.querySelectorAll(".card").forEach(element => {
            element.addEventListener("click", ()=>{
                getSongs(element.dataset.folder);
            })
             
        })
        
    }

    displayFolders()

}


main()

