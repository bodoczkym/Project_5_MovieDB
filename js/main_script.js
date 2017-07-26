
function saveEventHandler() {
    console.log("movieJSON: ", movieJSON);
}

function displaySearchResults() {
    $("#searchResultsContainer").html(parseMovieResults(searchInDatabase($("#searchTextBox").val())));
    var inputVal = $("#searchTextBox").val();
    var result = searchInDatabase(inputVal);
    console.log(parseMovieResults(result));
}

/* Input alapján visszaad egy tömböt, ami a megtalált filmeket tartalmazza
* @param input: A searchTextBox-ba beírt szöveg.
*/
function searchInDatabase(input) { 

    var foundMovie = [];
    //Ha a keresett kifejezés megtalálható bármelyik címben, akkor azt a tömböt berakja a
    for (var i = 0; i < movieJSON.results.length; i++) {
        if (~movieJSON.results[i].title.toLowerCase().indexOf(input.toLowerCase().trim())) {
            foundMovie.push(movieJSON.results[i]);
        }
    }
    console.log(foundMovie);
    return foundMovie;
}

function parseMovieResults(movieArray) {
    var fullInnerHTML = "";
    if (movieArray.length == 0) {
        fullInnerHTML = "<div> Nincs találat. </div>";
    } else if (movieArray.length == 10000){
        fullInnerHTML = "<div> Kérlek adj meg egy keresési kucsszót. </div>"
    } else {
        for (var i = 0; i < movieArray.length; i++) {
            fullInnerHTML += "<div> <p> Title: </p>";   
            fullInnerHTML += movieArray[i].title;
            fullInnerHTML += "</div><br>";
        }
    }
    return fullInnerHTML;
}
/* Az adatázis letöltésére szolgáló függvények.

function parseApiResponse(response) {
    var itemsToBePushed;
    for (var i = 0; i < response.results.length; i++) {
        movieJSON.push(response.results[i]);
    }
}

function nextApiRequestEventHandler() {
    var arrayToBeAdded = {};
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "",
        "method": "GET",
        "headers": {},
        "data": "{}"
    }
    settings.url = "https://api.themoviedb.org/3/discover/movie?page="+pageCounter+"&include_video=false&include_adult=true&sort_by=popularity.desc&language=en-US&api_key=<<insert api key here>>"
    $.ajax(settings).done(function (response) {
    console.log(response);
    parseApiResponse(response);
    console.log("movieJSON: ", movieJSON);
    });
    pageCounter++;
}

function saveJSON(JSONtoBeSaved) {
    var textToSave = "{\"page\": 1,\"total_results\": 19765,\"total_pages\": 989, \"results\"\:" + JSON.stringify(JSONtoBeSaved) + "}" ;
    var hiddenElement = document.createElement('a');
    console.log("textToSave: ", JSON.parse(textToSave));
    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'JSONDownloaded.txt';
    hiddenElement.click();
}

*/