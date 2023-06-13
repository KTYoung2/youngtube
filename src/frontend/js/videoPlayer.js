const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControll = document.getElementById("videoControll");


let controllTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;


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
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => { 
    const {
        target: {value},
    } = event;
    if(video.muted){
       video.muted = false;
       muteBtn.innerText = "MUTE";
    }
    volumeValue = value;
    video.volume = value;
};


const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);


//비디오 총시간 구하기
const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
  };
  
  //현재 플레이되고 있는 비디오의 시간
  const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
  };
  
  const handleTimeLineChange = (event) => {
    const {
      target: { value },
    } = event;
    video.currentTime = value;
  };

 
  const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreen.innerText = "Enter Full Screen";
    } else {
        videoContainer.requestFullscreen();
        fullScreen.innerText = "Exit Full Screen";
    }
  };




const hideControls = () =>  videoControll.classList.remove("showing");

const handelMouseMove = () => {
    if(controllTimeout){
        clearTimeout(controllTimeout);
        controllTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControll.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handelMouseLeave = () => {
    controllTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
      method: "POST",
    });
  };

  playBtn.addEventListener("click", handelPlayClick);
  muteBtn.addEventListener("click", handleMute);
  volumeRange.addEventListener("input", handleVolumeChange);
  video.addEventListener("loadedmetadata", handleLoadedMetadata);
  video.addEventListener("timeupdate", handleTimeUpdate);
  video.addEventListener("ended", handleEnded);
  timeline.addEventListener("input", handleTimeLineChange);
  fullScreen.addEventListener("click", handleFullscreen);
  video.addEventListener("mousemove", handelMouseMove);
  video.addEventListener("mouseleave", handelMouseLeave);