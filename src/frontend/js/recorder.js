const startBtn = document.getElementById("startBtn");
const preview = document.getElementById("#preview");

let stream;
let recorder;
let videoFile;


const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();
};

const handleStop = () => {
    startBtn.innerText = "Download Recoding";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
};


//녹화진행
const handleStart = () => {
    startBtn.innerText = "Stop Recoding";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    //실제 녹화기능
    recorder = new MediaRecorder(stream , { mimeType : "video/mp4 "});
    recorder.ondataavailable = (event) => {
        console.log("recoding");
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };

    recorder.start();
};



const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {width:300, height: 300},
    });
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart);