let video = document.querySelector("video");

let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");

let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let transparentColor = "transparent";

let constraints = {
    audio:true,
    video:true,
};
let chunks = [];
let recorder; // undefined

let recordFlag = false;

// navigator is a global obj where this gives info about the browser
// mediaDevices is an property of navigator which provide the access to connect media input devices like camera and microphone
// getUserMedia() is a function which provides user permission with a prompt, turns on camer and/or a microphone on the system-
// - and provides a media stream containing video track and audio track with input

navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{ // .then() is a method of promise which is used to handle the result of the promise
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", (e)=>{
        chunks = [];
    })

    recorder.addEventListener("dataavailable", (e)=>{
        chunks.push(e.data);
    })

    recorder.addEventListener("stop", (e)=>{
        let blob = new Blob(chunks, { type : "video/mp4" });
        let videoURL = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click()
    });

    recordBtnCont.addEventListener("click", (e)=>{
        if (!recorder) return;

        recordFlag = !recordFlag;

        if (recordFlag){ // strat
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
        }

        else{ // stop
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();
        }
    })

});



// video is actually captured as chunks, but what these chunks will have? 
// each chunk will having a frame, were as image is actually a frame.

// so, when ever we click on capture button. we need one such a frame to be capture and downloaded - this our Agenda.


captureBtnCont.addEventListener("click", (e)=> {
    captureBtn.classList.add("scale-capture");

    // canvas is one such an element were it captures entire screen.

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // converting image in URL format
    let imageURL = canvas.toDataURL();

    
    // converting frame to image

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    // applying filter to capture
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0, canvas.width, canvas.height);

    

    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "Image.Jpeg";
    a.click();

    // remove animation

    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    }, 500);

})


let filter = document.querySelector(".filter-layer");
let allFilter = document.querySelectorAll(".filter");

allFilter.forEach((filterElem) => {
    filterElem.addEventListener("click", (e)=>{
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
})





let timerId;
let counter = 0;
let timer = document.querySelector(".timer");

function startTimer(){
    timer.style.display = "block";
    function displayTimer(){

        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds/3600); // convert seconds to hours 
        totalSeconds = totalSeconds%3600; // get remaining seconds after subtracting hours

        let minutes = Number.parseInt(totalSeconds/60); // convert remaining seconds to minutes
        totalSeconds = totalSeconds%60; // get remaining seconds after subtracting minutes

        let seconds = totalSeconds; // getting remaining seconds after subtracting minutes
        
        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`; // 
        counter ++;
    }
    timerId = setInterval(displayTimer, 1000);
}

function stopTimer(){
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
};






