function Bike() {

}

//These are apparently equal:
//1243231200
//05.25.2009

var bikeArray = [];

function searchByLocation(city, page, map, divMaker) {
  $.get("https://bikeindex.org:443/api/v3/search?page=" + page + "&per_page=100&location=" + city + "&distance=10&stolenness=proximity")
  .then(function(response) {
    response.bikes.forEach(function(item) {
      bikeArray.push(item);
      console.log("It's happening!");
      divMaker(item);
    });
    var cities = processUniqueLocations(bikeArray, map);

    console.log(cities);

  })
  .fail(function(error) {
    console.log(error);
  })
}

var processUniqueLocations = function(bikeArray, map) {
  var current = bikeArray;
  var uniqueLocations = [];
  for(var index = 0; index < bikeArray.length; index++) {
    var found = false;
    var city = current[index].stolen_location.split(",")[0];
    for(var jdex = 0; jdex < uniqueLocations.length; jdex++) {
      if(uniqueLocations[jdex][0] === city) {
        uniqueLocations[jdex][3]++;
        found = true;
        break;
      }
    }
    if(!found) {
      var cityDataArray = [city, 0, 0, 1];
      map.getCoordinates(cityDataArray);
      uniqueLocations.push(cityDataArray);
      map.genMarker(cityDataArray);
    }
  }
  return uniqueLocations;
}

exports.bikeModule = Bike;
exports.searchModule = searchByLocation;
