$(document).ready(function () {

    var apiKey = "da7f79d7a0a51d7efc2cc54447adc5b9";
    var searchInput = $("#search-input");
    var searchBtn = $("#search-btn");
    var locationArr = [];
    var weatherData;
    var sideBar = $("#sidebar");
    var searchedArray = [];

    //load local searched cities to buttons when page loads
    $(function loadButtons() {
        var localStorageArr = JSON.parse(localStorage.getItem("searchedCities"));
        console.log(localStorageArr);
        //copy localStorageArr to searchedArray so searched don't get deleted on refresh
        searchedArray = localStorageArr;
        //if local storage is not empty
        if (searchedArray !== null) {
            var city = "";
            //for loop to make button
            for (var i = 0; i < localStorageArr.length; i++) {
                city = localStorageArr[i];
                //make buttons for already searched cities
                var newBtn = $("<button>");
                //insert city name in button
                newBtn.text(city);
                //give it bootstrap classes
                newBtn.addClass("btn btn-dark");
                //append it to the sidebar
                newBtn.appendTo(sideBar);
                console.log(city);
                //add click event listener
                newBtn.on("click", function(e){
                    e.preventDefault();
                    searchCityOf(city);
                });
            }
        }
        else{
            searchedArray = [];
        }
    });

    function getCityInfo(e) {
        e.preventDefault();

        //get input from search bar
        var userInput = searchInput.val().trim().toUpperCase();
        console.log(userInput);

        //if statement that checks if the searched city has been searched before
        //if it hasn't been searched make button for city
        if (!(searchedArray.includes(userInput))) {
            //create a button for the search
            var newBtn = $("<button>");
            newBtn.text(userInput);
            newBtn.addClass("btn btn-dark");
            newBtn.appendTo(sideBar);
            newBtn.on("click", searchCityOf(userInput));

            
            //add city to searched array
            searchedArray.push(userInput);   
        }

        //search the city for the user
        searchCityOf(userInput);    
        //add to local storage
        localStorage.setItem("searchedCities", JSON.stringify(searchedArray));
    }

    function searchCityOf(input) {
        //get geolocation from api
        var searchURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=3&appid=" + apiKey;
        console.log(searchURL);
        fetch(searchURL, {
                cache: "reload",
            })
            .then(function (response) {
                console.log(response);
                //if response is other than 'ok'
                if (response.status !== 200) {
                    console.log("Invalid Input");
                }
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                locationArr = [data[0].lat, data[0].lon];
                console.log([locationArr]);
                //get weather data
                getWeather();
            })
    }

    //get weather data from lat and lon
    function getWeather() {
        //create url for weather data
        var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + locationArr[0] + "&lon=" + locationArr[1] + "&units=imperial&appid=" + apiKey;
        console.log(weatherURL);

        //get weather data from api
        fetch(weatherURL, {
                cache: "reload"
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                weatherData = data;
                makeElements();
            })
    }

    function makeElements() {
        //get data from weatherData
        var cityName = searchInput.val().toUpperCase();
        var todayDate = moment().format("MM/DD/YYYY");
        var todayTemp = weatherData.current.temp;
        var todayWindSpeed = weatherData.current.wind_speed;
        var todayHumidity = weatherData.current.humidity;
        var todayUV = weatherData.current.uvi;
        var weatherIcon = "http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png";

        //get card deck from the DOM
        var cardDeck = document.querySelector("#card-deck").children;
        console.log(cardDeck);

        //add data to the DOM
        $("#city").text(cityName);
        $("#today-date").text(todayDate);
        $("#today-icon").attr("src", weatherIcon);

        $("#today-temp").text(todayTemp + " ??F");
        $("#today-humidity").text(todayHumidity + "%");
        $("#today-wind").text(todayWindSpeed + " MPH");
        $("#today-uvi").text(todayUV);

        //get array of daily forecasts
        var dailyForecastArray = weatherData.daily;
        console.log(dailyForecastArray);
        //for loop to set daily forecasts to each card
        for (var i = 0; i < 5; i++) {
            //get date from array[i].dt and convert it from unix to MM/DD/YYYY
            var dailyDate = moment.unix(dailyForecastArray[i].dt).format("MM/DD/YYYY");
            console.log(dailyDate);
            //gets the weather icon
            var dailyIcon = "http://openweathermap.org/img/wn/" + dailyForecastArray[i].weather[0].icon + "@2x.png";
            //gets the temp and fixes it to 2 decimal points
            var dailyTemp = dailyForecastArray[i].temp.day.toFixed(2);
            console.log(dailyTemp);
            //gets the humidity
            var dailyHumidity = dailyForecastArray[i].humidity;

            //add info to the cards
            cardDeck[i].children[0].children[0].children[0].textContent = dailyDate;
            cardDeck[i].children[0].children[1].children[0].setAttribute("src", dailyIcon);
            cardDeck[i].children[0].children[2].children[0].textContent = dailyTemp + " ??F";
            cardDeck[i].children[0].children[3].children[0].textContent = dailyHumidity + "%"

        }
    }

    searchBtn.on("click", getCityInfo);
});