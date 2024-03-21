console.log('wellcome to javascripts');
let currentsong = new Audio();
let songs;
let curfolder;

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


async function getsongs(folder) {
    curfolder = folder;
    const respons = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let data = await respons.text()
    // console.log(data)
    let div = document.createElement('div')
    div.innerHTML = data;
    let as = div.getElementsByTagName('a')
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // show all the songs in the playlist 
    let songul = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
        
        
        <img src="img/song.svg" alt="song">
                  </svg>
                  <div class="info">
                      <div>${song.replaceAll("%20", ' ')}</div>
                      <div>Furqan khan</div>
                      </div>
                      
                  <img src="img/play.svg" alt=""></li>`;

                }
                // attch a event listernr to each song 

          
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
                e.addEventListener("click", element => {
                    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}
const playMusic = (track, pause = false) => {
    currentsong.src = `http://127.0.0.1:3000/${curfolder}/` + track;
    if (!pause) {

        currentsong.play();
        play.src = 'img/pause.svg'
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track)
    document.querySelector('.timeduration').innerHTML = '00:00'


}
async function displayAlumbs() {
    const respons = await fetch(`http://127.0.0.1:3000/songs/`)
    let data = await respons.text()
    // console.log(data)
    let div = document.createElement('div')
    div.innerHTML = data;
    let acnhors = div.getElementsByTagName('a')
    let maincontainer = document.querySelector('.maincontainer')
    let array = Array.from(acnhors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

    
    if (e.href.includes('/songs')) {
        let folder = (e.href.split("/").slice(-2)[0])

        // get all the mata data of the folder
        const respons = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
        let data = await respons.json()
        // console.log(data)
        maincontainer.innerHTML = maincontainer.innerHTML + `
        <div  data-folder="${folder}" class="card">
        <img src="http://127.0.0.1:3000/songs/${folder}/cover.jpg" width="100px" height="100px" alt="weak up">
                        <h2>${data.title}</h2>
                        <p>${data.Description}</p>
                        <div class="play-button"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50"
                                height="50">
                                <circle cx="12" cy="12" r="11" fill="green" />
                                <polygon points="10,8 16,12 10,16" fill="white" />
                                </svg>
                                </div>
                                </div>`
    }
    }
    // load the playlist when the card is click 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    })


}


async function main() {
    // get the list of all song 
    await getsongs("songs/ncs")
    playMusic(songs[0], true)
    // the displayalums run here
    displayAlumbs()

    // attach a event listener to play and pouse and next and back
    play.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = 'img/pause.svg'
        } else {
            play.src = 'img/audioplay.svg'
            currentsong.pause()

        }
    })
    // Listen for timeupdate event

    currentsong.addEventListener('timeupdate', function () {
        document.querySelector('.timeduration').innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}:
    ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector('.circal').style.left = (currentsong.currentTime / currentsong.duration) * 100 + '%';


    });
    // Add an event listener to seekbar

    document.querySelector('#songbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circal').style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    // add a event listner for hambar click
    document.querySelector('.hambar').addEventListener('click', () => {
        document.querySelector('.leftFirst').style.left = "0";
    })
    // add a event listenr for close svg
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.leftFirst').style.left = "-130%";
    });

    // make a event listener for left-arrow previse
    document.querySelector('.left-arrow').addEventListener('click', () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    // maeke a event listener for right-arrow next 
    document.querySelector('.right-arrow').addEventListener('click', () => {
        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".picket").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume >0){
            document.querySelector(".vulume>img").src = document.querySelector(".vulume>img").src.replace("mute.svg", "vulume.svg")
        }
    })

  // Add event listener to mute the track
    document.querySelector(".vulume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("vulume.svg")){
            e.target.src = e.target.src.replace("vulume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = .0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "vulume.svg")
            currentsong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = .10;
        }

    })

}


main()






