//A keresés gombra kattintva megjeleníti a keresési eredményeket.
function displaySearchResults() {
    $("#searchResultsContainer").html(parseMovieResults(searchInDatabase($("#searchTextBox").val())));
    var inputVal = $("#searchTextBox").val();
    var result = searchInDatabase(inputVal);
    console.log(parseMovieResults(result));
    console.log(movieJSON);
}

//A hozzáadás gombra kattintva a megadott adatok alapján meghívja a függvényt, ami generál egy tömböt, amit a MovieJSON-hoz hozzáad. Értesítést küld a felhasználónak a művelet sikerességéről.
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

// A függvény beolvassa a megadott mezők adatait, és hozzáadja a MovieJSON tömbhöz a tömböt. Visszatérési értéke egy boolean, ami tájékoztat a művelet sikeréről.
function addToDatabase() {
    var addedMovie = [];
    addedTitle =  toTitleCase($("#addedTitle").val());
    addedYear =  $("#addedYear").val();
    if (addedTitle != "" && addedYear != "" && (parseInt(addedYear) <= 2017 && parseInt(addedYear) >= 1900)) {
        addedMovie.title = addedTitle;
        addedMovie.release_date = addedYear;
        addedMovie.poster_path = "default";
        movieJSON.results.push(addedMovie);
        return true;
    }
    else {
        return false;
    }
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

//A keresési lista alapján visszaad egy InnerHTML-t, ami az eredményeket adja ki.
function parseMovieResults(movieArray) {
    var fullInnerHTML = "";
    if (movieArray.length == 0) {
        fullInnerHTML = "<div> Nincs találat. </div>";
    } else if (movieArray.length == movieJSON.results.length){
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