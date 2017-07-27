var modifiedMovieId;
var modifiedMovieIndex;
var posterUrlBase = "http:\/\/image.tmdb.org/t/p/w780";

//A keresés gombra kattintva megjeleníti a keresési eredményeket.
function displaySearchResults() {
    $("#searchResultsContainer").html(parseMovieResults(searchInDatabaseForTitle($("#searchTextBox").val())));
    var inputVal = $("#searchTextBox").val();
    var result = searchInDatabaseForTitle(inputVal);
    console.log(parseMovieResults(result));
    console.log(searchInDatabaseForTitle($("#searchTextBox").val()));
}

/*A hozzáadás gombra kattintva a megadott adatok alapján meghívja a függvényt, ami generál egy tömböt, amit a MovieJSON-hoz hozzáad. 
Értesítést küld a felhasználónak a művelet sikerességéről.*/
function addNewFilmEventHandler() {
    //TODO Add more secure validation.
    var success = false;
    success = addToDatabase();
    console.log(movieJSON);
    if(success) {
        alert("Film hozzáadva az adatbázishoz.");
    }
    else {
        alert("Hiba történt.");
    }
}

//TODO Leave more space, and align the fields vertically, and relative to the poster.
function updateFilmEventHandler() {
    var success = false;
    success = updateDatabase();
    console.log("updatedJSON: ", movieJSON);
    if(success) {
        alert("Film módosítva.");
    }
    else {
        alert("Hiba történt.");
    }
}

function createElementToBeModifiedEventHandler(id) {
    modifiedMovieId = id;
    $("#updateInfo").hide();
    $("#updateValues").removeClass("hidden");
    var movieToBeModified = searchInDatabaseForId(id);
    createElementToBeModified(movieToBeModified);
    $("#modifyTitle").val(movieToBeModified.title);
    $("#modifyYear").val(parseReleaseDate(movieToBeModified.release_date));
}

function createElementToBeModified(selectedMovie) {
    var fullUrl="";
    if (selectedMovie.poster_path == null || selectedMovie.poster_path == undefined || selectedMovie.poster_path == "default") {
        fullUrl = "./img/default_poster.jpg"
    } else {
        fullUrl = posterUrlBase + selectedMovie.poster_path;
        console.log(fullUrl);
    }
    $("#updateImage").html("<div class=\"col-sm-12 col-md-12 col-lg-12 top-buffer\"><img id=\""+ selectedMovie.id +"\" src=\"" + fullUrl +"\" class=\"image-resize\"></div>");
}

//Paraméterként feldogozza a film dátumát, és visszaadja az évet.
function parseReleaseDate(date) {
    if (date.length > 4) {var splittedArray= date.split("-");
    return parseInt(splittedArray[0]);
    } else {
        return date;
    }
}

// A függvény beolvassa a megadott mezők adatait, és hozzáadja a MovieJSON tömbhöz a tömböt. Visszatérési értéke egy boolean, ami tájékoztat a művelet sikeréről.
function addToDatabase() {
    var addedMovie = [];
    addedTitle =  toTitleCase($("#addedTitle").val());
    addedYear =  $("#addedYear").val();
    if (addedTitle != "" && addedYear != "" && (parseInt(addedYear) <= 2017 && parseInt(addedYear) >= 1880)) {
        addedMovie.title = addedTitle;
        addedMovie.release_date = addedYear;
        addedMovie.poster_path = "default"
        addedMovie.id = getRandomInt(10000, 10000000).toString();
        movieJSON.results.push(addedMovie);
        return true;
    }
    else {
        return false;
    }
} 

// A függvény beolvassa a megadott mezők adatait, és frissíti a MovieJSON tömbhöt az új adatokkal. Visszatérési értéke egy boolean, ami tájékoztat a művelet sikeréről.
function updateDatabase() {
    var modifiedMovie = searchInDatabaseForId(modifiedMovieId);
    console.log("to be modified movie", modifiedMovie);
    modifiedTitle = $("#modifyTitle").val();
    modifiedYear = $("#modifyYear").val();
    
    if (parseInt(modifiedYear) <= 2017 && parseInt(modifiedYear) >= 1880) {
        modifiedMovie.title = modifiedTitle;
        modifiedMovie.release_date = modifiedYear;
        movieJSON.results.splice(modifiedMovieIndex, 1);
        movieJSON.results.push(modifiedMovie);
        console.log(movieJSON);
        return true;
    }
    else {
        return false;
    }
} 

/* Input alapján visszaad egy tömböt, ami a megtalált filmeket tartalmazza
* @param input: A searchTextBox-ba beírt szöveg.
*/
function searchInDatabaseForTitle(input) { 
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

/* Input alapján visszaad egy tömböt, ami a módosítani kívánt filmet tartalmazza
* @param id: A filmhez tartozó id, ami a kattintott képhez van rendelve, ezt olvassa be a függvény.
*/
function searchInDatabaseForId(id) { 
    var movieToBeModified = [];
    //Ha a keresett kifejezés megtalálható bármelyik címben, akkor azt a tömböt berakja a
    for (var i = 0; i < movieJSON.results.length; i++) {
        if (movieJSON.results[i].id == id) {
            movieToBeModified = movieJSON.results[i];
            modifiedMovieIndex = i;
        }
    }
    console.log(movieToBeModified);
    return movieToBeModified;
}

//A keresési lista alapján visszaad egy InnerHTML-t, ami az eredményeket adja ki.
//TODO Szépre formázni a hibaüzeneteket.
function parseMovieResults(movieArray) {
    var fullUrl= ""; 
    var hasPoster = true;
    var fullInnerHTML = "";
    if (movieArray.length == 0) {
        fullInnerHTML = "<div> Nincs találat. </div><br><br><br><br><br><br><br><br>";
    } else if (movieArray.length == movieJSON.results.length){
        fullInnerHTML = "<div> Kérlek adj meg egy keresési kucsszót. </div><br><br><br><br><br><br><br><br>"
    } else {
        for (var i = 0; i < movieArray.length; i++) {
            if (movieArray[i].poster_path == null || movieArray[i].poster_path == undefined) {
                continue;
            } else if (movieArray[i].poster_path == "default") {
                fullUrl = "./img/default_poster.jpg"
            } else {
                fullUrl = posterUrlBase + movieArray[i].poster_path;
                console.log(fullUrl);
            }
            fullInnerHTML += "<div class=\"col-sm-6 col-md-4 col-lg-3 top-buffer\"><a class=\"page-scroll\" href=\"#update\"><img id=\""+ movieArray[i].id +"\" onclick=\"createElementToBeModifiedEventHandler(this.id);\" src=\" " + fullUrl +"\" class=\"img-responsive\"></a></div>";
        }
    }
    return fullInnerHTML;
}
//Átalakítja a stringet, hogy az első betűk nagybetűk legyenek.
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Lehetővé teszi, hogy az enter gomb megnyomására keressünk, nem csak a gombra való klikkeléssel.
$('document').ready(function(){
    $('#searchTextBox').keypress(function(e){
        if(e.which == 13){//Enter key pressed
           displaySearchResults();//Trigger search button click event
        }
    });

});



//Toggle popover at the search section.
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
});

//Returns a random int between the listed arguments.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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