// const moment = require("./moment.js");
const APP_ID  =  'bec57f24f7635ddc5921432d5f8f4090';
const DEFAULT_VALUE ='--';

const searchInput= document.querySelector('#search-input');
const cityname = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');




searchInput.addEventListener('change', (e) =>{
    console.log('[searchinput]',e);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res =>{  //chay khi co data tu openweathermap tra ve
            const data = await res.json();
            console.log('[Search input]',data);
            cityname.innerHTML =data.name ||DEFAULT_VALUE;
            weatherState.innerHTML =data.weather[0].description||DEFAULT_VALUE;
            weatherIcon.setAttribute('src',`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`) ||DEFAULT_VALUE;
            temperature.innerHTML = Math.round(data.main.temp) ||DEFAULT_VALUE;
            sunrise.innerHTML =moment.unix(data.sys.sunrise).format('H:mm') ||DEFAULT_VALUE;
            sunset.innerHTML =moment.unix(data.sys.sunset).format('H:mm') ||DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity ||DEFAULT_VALUE;
            windSpeed.innerHTML = (data.wind.speed *3.6).toFixed(2)||DEFAULT_VALUE;// m/s->km/h

        })
});

//Home assist

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = 'vi-VI';
recognition.continuous = false;

const microphone = document.querySelector('.microphone');

const synth = window.speechSynthesis;
const speak = (text) => {
    if(synth.speaking) {
        console.error('Busy ....')
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.oned = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utter.onerror = () =>{
        console.error('SpeechSynthesisUtterance.onerror',err);
    }

    synth.speak(utter); 
}

const handleVoice = (text) => {
    console.log('text:',text);

    const handledText = text.toLowerCase();

    if (handledText.includes('thời tiết tại')) {
        const location = handledText.split('tại')[1].trim();

        console.log('location', location);
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;
    }
    
    const container = document.querySelector('.container');
    if(handledText.includes('thay đổi màu nền')) {
        const bgcolor = handledText.split('màu nền')[1].trim();
        console.log('bgcolor', bgcolor);
        container.style.background = bgcolor;
        return;
    }

    if(handledText.includes('màu nền mặc định')) {
        container.style.background = '';
        return;
    }

    if(handledText.includes('mấy giờ')) {
        const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
        speak(textToSpeech);
        return;
    }

    else{
        speak('Try again');
    }
}

microphone.addEventListener('click', (e) => {
    e.preventDefault();

    recognition.start();
    microphone.classList.add('recording');
});

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerror = (err) => {
    // console.log("Err");
    console.error(err);
    microphone.classList.remove('recording');
}

recognition.onresult = (e) => {
    console.log('onresult', e);
    // console.log(typeof e.results);
    const text = e.results[0][0].transcript;
    handleVoice(text);
}