console.log("code is running");

let time = 0;
let timer = null;
let isPause = false;

const displayBtn = document.querySelector("#display");
const startBtn = document.querySelector(".start");
const pauseBtn = document.querySelector('.pauseBtn');
const resetBtn = document.querySelector(".reset");

const hourInput = document.querySelector('#hourInput');
const minInput = document.querySelector('#minInput');
const secInput = document.querySelector('#secInput');

function updateDisplay(){
  let hour = Math.floor(time / 3600).toString().padStart(2, '0')
  let minite = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
  let second = (time % 60).toString().padStart(2, '0');
  displayBtn.textContent = `${hour}:${minite}:${second}`
}

let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active');
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
    console.log('Wake Lock released');
  }
}



function startTimer(){
  

  // if(timeInput.value){
  //   time = parseInt(timeInput.value, 10)
  //   timeInput.value = ''
  // }

  // update it into minute and second input

  const hour = parseInt(hourInput.value, 10) || 0;
  const minute = parseInt(minInput.value, 10) || 0;
  const second = parseInt(secInput.value, 10) || 0;

  if(time === 0){
    time = hour * 3600 + minute * 60 + second;
  }

  if(timer || time <= 0) return;

  hourInput.value = '';
  minInput.value = '';
  secInput.value = '';


  if(time <= 0) return;


  timer = setInterval(()=>{
    requestWakeLock();

    if(time> 0 ){
      time--;
      updateDisplay()
    }else{
      clearInterval(timer);
      timer = null;
      pauseBtn.textContent = "Pause";
      requestWakeLock();

    }
  }, 1000)
}

function pausedOrResume(){
  if(!timer && time > 0 && isPause){
    startTimer();
    isPause = false
    pauseBtn.textContent = "Pause"
  } else if(timer){
    clearInterval(timer);
    timer = null;
    isPause = true;
    pauseBtn.textContent = "Resume"
  }
}


function resetTimer(){
  clearInterval(timer);
  requestWakeLock();

  timer = null
  time = 0
  isPause = false;
  pauseBtn.textContent = "Pause";
  updateDisplay()
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
pauseBtn.addEventListener('click', pausedOrResume);

updateDisplay()
