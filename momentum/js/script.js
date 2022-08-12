let state = {
    language: 'be',
    photoSource: 'github',
    blocks: ['quote', 'weather', 'player', 'todolist'],
    toDo:[]
}
window.addEventListener('load', getLocalStorage);
window.addEventListener('load', getSettings);
window.addEventListener('beforeunload', ()=> {
    state.toDo=[];
    const input = document.querySelectorAll('.todoInput');
    input.forEach(item =>state.toDo.push(item.value));
})


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
    if(state.photoSource === 'github'){
        const img = new Image();
        const dp = dayPeriod();
        const cn = addingZero(number);
        img.src=`https://raw.githubusercontent.com/shish-ko/bgimages/assets/images/${dp}/${cn}.jpg`
        img.onload = ()=> {
            document.body.style.backgroundImage= "url('"+`${img.src}`+"')";
        }    
    }      
}

async function getLinkToImage(){
    if(state.photoSource === 'unsplash'){
        const img = new Image();
        const dp = dayPeriod();
        let url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${dp}&client_id=8-1C_5rqPu7IAQmtSwDTDNjuId3zb7az5Da9qP00wV4`;
        console.log(url)
        const res = await fetch (url);
        const data= await res.json();    
        img.src = data.urls.regular;
        img.onload = ()=> {
            document.body.style.backgroundImage= "url('"+`${img.src}`+"')";
        }    
    }  else if(state.photoSource==='flickr'){
        const img = new Image();
        const dp = dayPeriod();        
        let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=7f186c5d957a329557c371dc86a52bd1&tags=${dp}&extras=url_l&format=json&nojsoncallback=1`;
        console.log(url)
        const res = await fetch (url);
        const data = await res.json();    
        img.src = data.photos.photo[currentBgNumber].url_l;
        console.log(url)
        img.onload = ()=> {
            document.body.style.backgroundImage= "url('"+`${img.src}`+"')";
        }    
    }     
}
getLinkToImage();


const date = document.querySelector('.date')
function showDate() {
    const currentDate= new Date();
    const dateOptions= { weekday: 'long', month:'long', day: 'numeric',  }
    date.textContent = currentDate.toLocaleString(state.language, dateOptions);
}

const greeting=document.querySelector('.greeting')
function showGreeting(language) {
    const currentHour=new Date().getHours();
    if(currentHour >= 6 && currentHour <12){
        greeting.textContent = greetingTranslation[language].morning;
    } else if(currentHour >= 12 && currentHour < 18){
    greeting.textContent = greetingTranslation[language].day;
    }else if(currentHour >= 0 && currentHour < 6){
        greeting.textContent = greetingTranslation[language].night;
    } else {
        greeting.textContent = greetingTranslation[language].evening;
    }
    
}
const name=document.querySelector('.name');



function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('settings', JSON.stringify(state));
} 
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');        
    }
    if(localStorage.getItem('settings')){
        state=JSON.parse(localStorage.getItem('settings')) ;
    }
}


const time = document.querySelector('.time');


// slides start

const prevArrow=document.querySelector('.slide-prev');
const nextArrow=document.querySelector('.slide-next');


function getSlideNext(){
    getLinkToImage();
    if (currentBgNumber === 20){
        currentBgNumber=1        
    } else {
        currentBgNumber += 1;
    }
 
}
function getSlidePrev(){
    getLinkToImage();
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
console.log(currentCity)
async function getWeather(cit) {
    document.querySelector('.weather-error').textContent=null;


    let url=''
    if (cit === '' || cit === null){
        url = `https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=${state.language}&appid=c0f99e466d41b59f58f45e13801966af&units=metric`
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cit}&lang=${state.language}&appid=c0f99e466d41b59f58f45e13801966af&units=metric` 
    }
    try{ 
        const res = await fetch(url);
        const data = await res.json();
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = Math.round(data.main.temp) + '\u2103';
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${greetingTranslation[state.language].windSpeed}${Math.round(data.wind.speed)}${greetingTranslation[state.language].ms}`;
        humidity.textContent = `${greetingTranslation[state.language].humidity}${data.main.humidity}%`;
    } catch(error){ 
        document.querySelector('.weather-error').textContent = greetingTranslation[state.language].err;        
        temperature.textContent = null;
        weatherDescription.textContent = null;
        wind.textContent = null;
        humidity.textContent =null; 
    }
}



const city = document.querySelector('.city')
 
 city.addEventListener('change', ()=> {
    getWeather(city.value);
    currentCity=city.value
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
    
    quote.textContent = data[quoteNumber][state.language].text
    author.textContent = data[quoteNumber][state.language].author
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
const volumeIcon=document.querySelector('.volume-icon');
const volume=document.querySelector('.volume');

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

let currentVolume='';
volumeIcon.addEventListener('click', ()=>{
    if (audio.volume !== 0){
        currentVolume=audio.volume;
        audio.volume=0 ;
    }else {
        audio.volume = currentVolume;
    }
    
})
const orangeVolume= document.querySelector('.volumeOrange');
const volumeCircle=document.querySelector('.volumeCircle');
function colorVolume(){
    const volumeBarWidth=window.getComputedStyle(volumeLine).width;
    const qwe = audio.volume * parseInt(volumeBarWidth);    
    orangeVolume.style.width=`${qwe}px`;    
    volumeCircle.style.marginLeft= `${qwe}px`;    
}
colorVolume();

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
    trackDuration.textContent= `${Math.trunc(Duration / 60)}:${Duration % 60}`
}


// translation 
const belarusian=document.querySelector('.belarusian');
const english=document.querySelector('.english');

belarusian.addEventListener('click', ()=>{
    belarusian.classList.add('activeLang');
    english.classList.remove('activeLang');
    state.language='be';
    getWeather(currentCity);
    getQuotes(currentQuote);
})
english.addEventListener('click', ()=>{
   english.classList.add('activeLang');
   belarusian.classList.remove('activeLang');
    state.language='en';
    getWeather(currentCity);
    getQuotes(currentQuote);
})

// settings

const github= document.querySelector('.github');
const flickr=document.querySelector('.flickr');
const unsplash=document.querySelector('.unsplash');
const playerSettings=document.querySelector('.playerSettings');
const quoteSettings=document.querySelector('.quoteSettings');
const weatherSettings=document.querySelector('.weatherSettings');
const toDoSettings=document.querySelector('.toDoSettings')

github.addEventListener('click', ()=> state.photoSource='github');
flickr.addEventListener('click', ()=> {state.photoSource='flickr'; getLinkToImage();});
unsplash.addEventListener('click', ()=> {state.photoSource='unsplash'; getLinkToImage();});

const player=document.querySelector('.player');
const weather= document.querySelector('.weather');

playerSettings.addEventListener('click', ()=>{
    playerSettings.classList.toggle('redBg');
    player.classList.toggle('hideItem');
    if (state.blocks.includes('player')){
        const i = state.blocks.indexOf('player');
        state.blocks.splice(i, 1);
        console.log(state.blocks)
        console.log(i)
    }else{
        state.blocks.push('player')
    }
})

weatherSettings.addEventListener('click', ()=>{
    weatherSettings.classList.toggle('redBg');
    weather.classList.toggle('hideItem');
    if (state.blocks.includes('weather')){
        const i = state.blocks.indexOf('weather');
        state.blocks.splice(i, 1);             
    }else{
        state.blocks.push('weather')
    }
})

quoteSettings.addEventListener('click', ()=>{
    quoteSettings.classList.toggle('redBg');
    quote.classList.toggle('hideItem');
    author.classList.toggle('hideItem');
    if (state.blocks.includes('quote')){
        const i = state.blocks.indexOf('quote');
        state.blocks.splice(i, 1);
    }else{
        state.blocks.push('quote')
    }
})

toDoSettings.addEventListener('click', ()=>{
    toDoSettings.classList.toggle('redBg');
    todoList.classList.toggle('todoListActive');
    if (state.blocks.includes('todoList')){
        const i = state.blocks.indexOf('todolist');
        state.blocks.splice(i, 1);
        console.log(state.blocks)
        console.log(i)
    }else{
        state.blocks.push('todolist')
    }
})

function getSettings(){
    if(!state.blocks.includes('quote')){
        quoteSettings.classList.toggle('redBg');
        quote.classList.toggle('hideItem');
        author.classList.toggle('hideItem');
    }
    if(!state.blocks.includes('player')){
        playerSettings.classList.toggle('redBg');
        player.classList.toggle('hideItem');      
    }
    if(!state.blocks.includes('weather')){
        weatherSettings.classList.toggle('redBg');
        weather.classList.toggle('hideItem');
    }
    if(state.language==='be'){
        belarusian.classList.toggle('activeLang')
    } else if(state.language==='en'){
        english.classList.toggle('activeLang')
    }
    getWeather(currentCity);
    getQuotes(currentQuote);
}

// todoList

const addNoticeButton=document.querySelector('.addNotice');
const todoList = document.querySelector('.todoList')
addNoticeButton.addEventListener('click', addNotice);

function addNotice(item){
    if (item !==''){
        if (typeof item ==='object'){
                const div = document.createElement('div');
                div.classList.add('todoItem');
                div.innerHTML= `<input type='checkbox' class='todoCheckBox'><input class="todoInput">`;
                todoList.append(div);
            } else {
                const div = document.createElement('div');
                div.classList.add('todoItem');
                div.innerHTML= `<input type='checkbox' class='todoCheckBox'><input class="todoInput" value="${item}">`;
                todoList.append(div);        
            } 
    } else { 
      null
    }  
    const checkButtons=document.querySelectorAll('.todoCheckBox');
    const todoItem=document.querySelectorAll('.todoItem');
    for(let i=0; i < checkButtons.length; i++){
        checkButtons[i].addEventListener('click', ()=>{
            todoItem[i].classList.add('unvisible');
            function deleteTodoItem() {todoItem[i].remove()};            
            setTimeout(deleteTodoItem, 1000);
        })
    }

} 

window.addEventListener('load', ()=>{
    state.toDo.forEach(item => addNotice(item));
})

function showTime() {
    const currentDate= new Date();
    time.textContent = currentDate.toLocaleTimeString();
    setTimeout(showTime, 1000);
    showDate();
    showGreeting(state.language);
    setBG(currentBgNumber);
    if(isPlay === true){
        timeLinePosition += 1;
        countPlayTime();        
    }

    colorTimeLine();  
}
showTime();

import greetingTranslation from './greetingTranslation.js';





