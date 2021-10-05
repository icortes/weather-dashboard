$(document).ready(function (){

    var apiKey = "da7f79d7a0a51d7efc2cc54447adc5b9";
    var searchInput = $("#search-input");
    var searchBtn = $("#search-btn");
    var locationArr = [];
    var weatherData;

    function getCityInfo(e){
        e.preventDefault();

        //get input from search bar
        var userInput = searchInput.val().trim();
        console.log(userInput);

        //get geolocation from api
        var searchURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&limit=3&appid=" + apiKey;
        console.log(searchURL);
        fetch(searchURL,{
            cache: "reload",
        })
        .then(function(response){
            console.log(response);
            //if response is other than 'ok'
            if(response.status !== 200){
                console.log("Invalid Input");
            }
            return response.json();
        })
        .then(function(data){
            console.log(data);
            locationArr = [data[0].lat,data[0].lon];
            console.log([locationArr]);
            //get weather data
            getWeather();
        })

    }

    //get weather data from lat and lon
    function getWeather(){
        //create url for weather data
        var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + locationArr[0] + "&lon=" + locationArr[1] + "&units=imperial&appid=" + apiKey;
        console.log(weatherURL);

        //get weather data from api
        fetch(weatherURL, {
            cache: "reload"
        })
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            weatherData = data;
            makeElements();
        })
    }

    function makeElements(){
        //get data from weatherData
        var cityName = searchInput.val().toUpperCase();
        var todayDate = moment().format("MM/DD/YYYY");
        var todayTemp = weatherData.current.temp;
        var todayWindSpeed = weatherData.current.wind_speed;
        var todayHumidity = weatherData.current.humidity;
        var todayUV = weatherData.current.uvi;
        var weatherIcon = "http://openweathermap.org/img/wn/"+ weatherData.current.weather[0].icon +"@2x.png";

        //get card deck from the DOM
        var cardDeck = document.querySelector("#card-deck").children;

        
        //add data to the DOM
        $("#city").text(cityName);
        $("#today-date").text(todayDate);
        $("#today-icon").attr("src", weatherIcon);

        $("#today-temp").text(todayTemp + " °F");
        $("#today-humidity").text(todayHumidity + "%");
        $("#today-wind").text(todayWindSpeed + " MPH");
        $("#today-uvi").text(todayUV);

        //get array of daily forecasts
        var dailyForecastArray = weatherData.daily;
        console.log(dailyForecastArray);
        //for loop to set daily forecasts to each card
        for(var i = 0; i < 5; i++){
            //get date from array[i].dt and convert it from unix to MM/DD/YYYY
            var dailyDate = moment.unix(dailyForecastArray[i].dt).format("MM/DD/YYYY");
            console.log(dailyDate);
            //gets the weather icon
            var dailyIcon = "http://openweathermap.org/img/wn/"+ dailyForecastArray[i].weather[0].icon + "@2x.png";
            //gets the temp and fixes it to 2 decimal points
            var dailyTemp = dailyForecastArray[i].temp.day.toFixed(2);
            console.log(dailyTemp);
            //gets the humidity
            var dailyHumidity = dailyForecastArray[i].humidity;

            //add info to the cards
            

        }
    }

    searchBtn.on("click", getCityInfo);
});