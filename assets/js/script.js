$(document).ready(function (){

    var apiKey = "da7f79d7a0a51d7efc2cc54447adc5b9";
    var searchInput = $("#search-input");
    var searchBtn = $("#search-btn");

    function getCityInfo(e){
        e.preventDefault();

        //get input from search bar
        var userInput = searchInput.val().trim();
        console.log(userInput);

        //get geolocation from api
        var searchURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&limit=3&appid=" + apiKey;
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

        })

    }

    searchBtn.on("click", getCityInfo);
});