$(document).ready(function (){

    var apiKey = "da7f79d7a0a51d7efc2cc54447adc5b9";
    var searchInput = $("#search-input");
    var searchBtn = $("#search-btn");
    var locationArr = [];
    var weatherData = [];

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
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + locationArr[0] + "&lon=" + locationArr[1] + "&units=imperial&appid=" + apiKey;
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
        })
    }

    searchBtn.on("click", getCityInfo);
});