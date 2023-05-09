const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

const handelPlayClick = (e) => {
    if(video.paused){
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "PLAY" : "STOP";
};


const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "UNMUTE" : "MUTE";
    volumeRange.value = video.muted ? 0 : 0.5;
};

playBtn.addEventListener("click",handelPlayClick);
muteBtn.addEventListener("click",handleMute);



