const randomNum = Math.ceil(Math.random()*20);
let currentBgNumber = randomNum; //show the current background Image, can be changed by slider
function addingZero(number){
    let res = '';
    if (number.toString().length === 1){
        res=`0${number}`;
    } else {
        res=`${number}`;
    }
    return res;
}

function dayPeriod(){
    const currentHour=new Date().getHours();
    if(currentHour >= 6 && currentHour <12){
        return "morning"
    } else if(currentHour >= 12 && currentHour < 18){
        return "afternoon"
    }else if(currentHour >= 0 && currentHour < 6){
        return "night"
    } else {
        return "evening"
    }
}


function setBG(number) {
    const img = new Image();
    const dp = dayPeriod();
    const cn = addingZero(number);
    img.src=`https://raw.githubusercontent.com/shish-ko/bgimages/assets/images/${dp}/${cn}.jpg`
    img.onload = ()=> {
        document.body.style.backgroundImage= "url('"+`${img.src}`+"')";
    }    
}



const date = document.querySelector('.date')
function showDate() {
    const currentDate= new Date();
    const dateOptions= { weekday: 'long', month:'long', day: 'numeric',  }
    date.textContent = currentDate.toLocaleDateString('be-BY', dateOptions);
}

const greeting=document.querySelector('.greeting')
function showGreeting() {
    const currentHour=new Date().getHours();
    if(currentHour >= 6 && currentHour <12){
        greeting.textContent=`Добрай раніцы,`
    } else if(currentHour >= 12 && currentHour < 18){
    greeting.textContent=`Добры дзень,`
    }else if(currentHour >= 0 && currentHour < 6){
        greeting.textContent =`Дабранач,`
    } else {
        greeting.textContent=`Добры вечар,`
    }
    
}
const name=document.querySelector('.name')

function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
} 
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
        
      }
}
window.addEventListener('load', getLocalStorage);

const time = document.querySelector('.time');


const prevArrow=document.querySelector('.slide-prev');
const nextArrow=document.querySelector('.slide-next');


function getSlideNext(){
    console.log('next');
    if (currentBgNumber === 20){
        currentBgNumber=1        
    } else {
        currentBgNumber += 1;
    }
 
}
function getSlidePrev(){
    console.log('prev');
    if (currentBgNumber === 1){
        currentBgNumber=20        
    } else {
        currentBgNumber -= 1;
    }
 
}
prevArrow.addEventListener('click', getSlidePrev);
nextArrow.addEventListener('click', getSlideNext);

// slides end

// weather start

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
let currentCity = localStorage.getItem('city'); // gets the city name from the localStorage

async function getWeather(cit) {
    console.log(currentCity)
    let url=''
    if (cit === '' || cit === null){
        url = `https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=ru&appid=c0f99e466d41b59f58f45e13801966af&units=metric`
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cit}&lang=ru&appid=c0f99e466d41b59f58f45e13801966af&units=metric` 
    }
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}` + '\u2103';
    weatherDescription.textContent = `${data.weather[0].description}`;
    wind.textContent = `Скорость ветра: ${data.wind.speed}м/с`;
    humidity.textContent = `Относительная влажность: ${data.main.humidity} `;
}
getWeather(currentCity);

 const city = document.querySelector('.city')
 
 city.addEventListener('change', ()=> {
    getWeather(city.value);
 })

// weather end


//quote start

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

let currentQuote=Math.floor(Math.random() * 8);
async function getQuotes(quoteNumber){
    const url="./js/data.json";
    const res = await fetch(url);    
    const data = await res.json();
    
    quote.textContent = data[quoteNumber].text
    author.textContent = data[quoteNumber].author
 }
 getQuotes(currentQuote);

const nextQuoteButton = document.querySelector('.change-quote')
function changeQuote(){
    const newQuote=Math.floor(Math.random() * 8)
    if(newQuote === currentQuote){
      changeQuote();  
    } else {
        currentQuote = newQuote;
        console.log(currentQuote)
    }
    getQuotes(currentQuote);
}
nextQuoteButton.addEventListener('click', changeQuote)

// quote end


// audio player start

const playButton=document.querySelector('.play')
const nextTrack=document.querySelector('.play-next');
const prevTrack=document.querySelector('.play-prev');
import playList from './tracks.js';

const audio = new Audio();
let currentTrack = 0 ;
let isPlay =false;
let timeLinePosition = 0;



audio.addEventListener('ended', ()=>{
    if(currentTrack === playList.length-1){
        currentTrack=0;
        timeLinePosition=0
        playAudio();
        colorCurrentTrack();
        setTimeout(playAudio, 1500)
    }else {
        currentTrack +=1;
        timeLinePosition=0;
        playAudio();
        colorCurrentTrack();
        setTimeout(playAudio, 1500)
    }
})

function playAudio(){
    audio.src = playList[currentTrack].src  

    if(isPlay===false){
        audio.currentTime = timeLinePosition;
        audio.play();
        isPlay=true
    }else {
        audio.pause();
        isPlay=false;
    }
    
}
function toggleBtn() {
    playButton.classList.toggle('pause');
  }
playButton.addEventListener('click', playAudio);
playButton.addEventListener('click', toggleBtn)

nextTrack.addEventListener('click', () => {
    if (currentTrack===playList.length-1){
        currentTrack=0;
        timeLinePosition = 0;
        colorCurrentTrack();
        countPlayTime();
    } else {
        currentTrack += 1;
        timeLinePosition = 0
        colorCurrentTrack();
        countPlayTime();
    }
    
    if( isPlay === true){
        isPlay = false;
        playAudio();
    }  
});

prevTrack.addEventListener('click', () => {
    if (currentTrack===0){
        currentTrack=playList.length-1;
        timeLinePosition = 0;
        colorCurrentTrack();
        countPlayTime();
    } else{
        currentTrack -= 1;
        timeLinePosition = 0;
        colorCurrentTrack();
        countPlayTime();
    }   
    if( isPlay === true){
        isPlay = false;
        playAudio()
    } 
})
const playListContainer= document.querySelector('.play-list')


for(let item in playList) {
    const li = document.createElement('li');
    li.classList.add('play-item');    
    li.textContent = playList[item].title;
    playListContainer.append(li);
    li.addEventListener('click', ()=> { //play the chousen track
        currentTrack=Number(item);
        timeLinePosition=0;
        if (isPlay===false){
            playAudio();
            toggleBtn();
            colorCurrentTrack();
        } else {
            playAudio();
            playAudio();
            colorCurrentTrack();
        }
        
    })
}

const tracks=document.querySelectorAll('.play-item')

function colorCurrentTrack() {
    tracks.forEach(item => {
        item.classList.remove('item-active');
    })
    tracks[currentTrack].classList.add('item-active')
}
colorCurrentTrack();

const timeLine = document.querySelector('.timeLine')
timeLine.addEventListener('click', e => {
    const timeLineWidth = window.getComputedStyle(timeLine).width;
    const pointedTime = Math.floor(e.offsetX / parseInt(timeLineWidth) * playList[currentTrack].duration);
    
    timeLinePosition = pointedTime;
    if(isPlay === true) {
        playAudio();
        playAudio();
    }
})

const timeLineOrange =document.querySelector('.timeLineOrange');
function colorTimeLine(){
    const timeLineWidth = window.getComputedStyle(timeLine).width;    
    const orangeWidth = timeLinePosition / playList[currentTrack].duration * parseInt(timeLineWidth);
    timeLineOrange.style.width=`${orangeWidth}px` ;
}

// volume
const volumeControls=document.querySelector('.volumeControls');
const volume=document.querySelector('.volume')
volumeControls.addEventListener('mouseenter', ()=>{
    volume.classList.add('visible');
})
volumeControls.addEventListener('mouseleave', ()=>{
    volume.classList.remove('visible');
})
const volumeLine=document.querySelector('.volume')
volumeLine.addEventListener('click', e=>{
    const volumeBarWidth=window.getComputedStyle(volumeLine).width;
    audio.volume = e.offsetX / parseInt(volumeBarWidth);
    colorVolume();   
})
const orangeVolume= document.querySelector('.volumeOrange');
const volumeCircle=document.querySelector('.volumeCircle');
function colorVolume(){
    const volumeBarWidth=window.getComputedStyle(volumeLine).width;
    const qwe = audio.volume * parseInt(volumeBarWidth);    
    orangeVolume.style.width=`${qwe}px`;    
    volumeCircle.style.marginLeft= `${qwe}px`;   
    console.log(volumeBarWidth) 
}
colorVolume()

volumeLine.addEventListener('wheel', e=>{     //volume scroll
    if(e.deltaY > 0){
        if(audio.volume <= e.deltaY*.002){
            audio.volume=0;
            colorVolume()
        } else {
            audio.volume -=e.deltaY*.002; 
            colorVolume() 
        }       
    } else {
        if((1 - audio.volume) <= -e.deltaY*.002){
            audio.volume=1;
            orangeVolume.style.width=`119px`;
            volumeCircle.style.marginLeft= '119px';
        } else {
            audio.volume -=e.deltaY*.002;
            colorVolume()
        }
    }      
})


// duration
const playTime=document.querySelector('.playTime');
const trackDuration=document.querySelector('.trackDuration');
function countPlayTime(){
    const Duration=playList[currentTrack].duration
    playTime.textContent= `${Math.trunc(timeLinePosition / 60)}:${addingZero(timeLinePosition % 60).slice(0, 2)}`
    console.log(timeLinePosition)
    trackDuration.textContent= `${Math.trunc(Duration / 60)}:${Duration % 60}`
}




function showTime() {
    const currentDate= new Date();
    time.textContent = currentDate.toLocaleTimeString();
    setTimeout(showTime, 1000);
    showDate();
    showGreeting();
    setBG(currentBgNumber);
    if(isPlay === true){
        timeLinePosition += 1
        countPlayTime();        
    }

    colorTimeLine()
    
    
}
showTime();









