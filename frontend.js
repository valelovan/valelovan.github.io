let count = 0;

document.querySelector("#searchButton").onclick = function() {
    const location = document.querySelector("#searchForm").value;
    getTemperature(location).then(function (result) {
        document.querySelector("#weather").innerHTML = result
    });
    getCloudCoverage(location).then(function (result) {
        document.querySelector("#weather").innerHTML += " " + result
    });
    getPrecipitation(location).then(function (result) {
        document.querySelector("#weather").innerHTML += " " + result
    });
}





// Error message functions



// API Functions



/**
*   Retrieves temperature
*/
async function getTemperature(name) {
    const json = await getLocationData(name);
    return `${json.dataseries[0].temp2m} °F`;
}



/**
*   Retrieves cloudyness
*/
async function getCloudCoverage(name) {
    const json = await getLocationData(name);
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
async function getPrecipitation(name) {
    const json = await getLocationData(name);
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
    return await fetch(`https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`)
        .then(response => response.json());
}



async function getLocationData(name) {
    let city = getLocationCity(name);
    let secondary = getLocationSecondary(name);
    if (city == "") return null;
    const jsonArray = await fetch(`https://nominatim.openstreetmap.org/search.php?city=${city}&format=jsonv2`)
        .then(response => response.json());
    let weatherJSON = getWeatherJSON(jsonArray, secondary);
    return getWeatherData(weatherJSON.lon, weatherJSON.lat);
}



function getWeatherJSON(jsonArray, secondary) {
    let curr = null;
    for (let c in jsonArray) {
        if (curr == null) curr = c;
        else if (c.display_name !== undefined && c.display_name.includes(secondary)) curr = c;
    }
    return curr;
}



function getLocationCity(name) {
    let toks = name.trim().split(" ");
    if (toks.length == 0) return "";
    return toks[0];
}



function getLocationSecondary(name) {
    let toks = name.trim().split(" ");
    if (toks.length <= 1) return "";
    return toks[1];
}