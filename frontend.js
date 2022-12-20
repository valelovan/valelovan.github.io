/**
*   This is the file containing the front-end JavaScript code
*/

let count = 0;

document.querySelector("#searchButton").onclick = function() {
    const location = document.querySelector("#searchForm").value;
    try {
        setWeatherContent(location);
    } catch (any) {
        setErrorContent();
    }
}




// Helper Functions

function setWeatherContent(location) {
    getLocationData(location).then(function (result) {
        getTemperature(result).then(function (result) {document.querySelector("#weather").innerHTML = result});
        getCloudCoverage(result).then(function (result) {document.querySelector("#weather").innerHTML += " " + result});
        getPrecipitationType(result).then(function (result) {document.querySelector("#weather").innerHTML += " " + result});
        getPlanetName(result).then(function (result) {document.querySelector("#planet").innerHTML = result});
    });
}



const Planet = {
    HOTH: "HOTH",
    BESPIN: "BESPIN",
    ENDOR: "ENDOR",
    KAMINO: "KAMINO",
    TATOOINE: "TATOOINE",
    ALDERAAN: "ALDERAAN"
}

async function getPlanetName(json) {
    if (null == json)
        return Planet.ALDERAAN;

    const precType = json.dataseries[0].prec_type;
    const temp = json.dataseries[0].temp2m;
    const cloudcover = json.dataseries[0].cloudcover;

    if ("snow" == precType || "icep" == precType || temp < 8)
        return Planet.HOTH;
    if ("rain" == precType || "frzr" == precType)
        return Planet.KAMINO;
    if (cloudcover > 5)
        return Planet.BESPIN;
    if (temp > 30)
        return Planet.TATOOINE;

    // Default to Endor
    return Planet.ENDOR;
}



function setBackground() {
    //
}



// Error Message Functions

function setErrorContent() {
    //
}


// API Functions

/**
*   Retrieves temperature
*/
async function getTemperature(json) {
    if (null == json) return "";
    const temp = json.dataseries[0].temp2m;
    return `${temp} °C`;
}



/**
*   Retrieves cloudyness
*/
async function getCloudCoverage(json) {
    if (null == json) return "";
    const okta = json.dataseries[0].cloudcover;
    switch (okta) {
        case 1:
            return "CLEAR";
        case 2:
        case 3:
            return "MOSTLY CLEAR";
        case 4:
        case 5:
            return "PARTLY CLEAR";
        case 6:
        case 7:
        case 8:
            return "MOSTLY CLOUDY";
        case 9:
            return "CLOUDY";
        default:
            return "!NO DATA!";
    }
}



/**
*   Retrieve precipitation
*/
async function getPrecipitationType(json) {
    if (null == json) return "";
    const perc = json.dataseries[0].prec_type;
    switch (perc) {
        case "none":
            return "";
        case "frzr":
            return "FREEZING RAIN";
        case "icep":
            return "SLEET";
        default:
            return perc.toUpperCase();
    }
}



async function getWeatherData(lon, lat) {
    return await fetch(`https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=` + Math.random() % 10)
        .then(response => response.json());
}



async function getLocationData(name) {
    let city = getLocationCity(name);
    if (city == "") return null;
    const jsonArray = await fetch(`https://nominatim.openstreetmap.org/search.php?city=${city}&format=jsonv2`)
        .then(response => response.json());
    let weatherJSON = getWeatherJSON(jsonArray);
    return getWeatherData(weatherJSON.lon, weatherJSON.lat);
}



function getWeatherJSON(jsonArray) {
    let size = jsonArray.length;
    if (size >= 1) return jsonArray[0];
    return null;
}



function getLocationCity(name) {
    return name.replace(" ", "_");
}
