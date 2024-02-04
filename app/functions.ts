const GRAMS_CO2_PER_GALLON = 8887;

export function measure(lat1: number, lon1: number, lat2: number, lon2: number){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

export function getMPG(speed: number){
  // -1.004359267664*10^{-9}x^{6}+3.5676720830782*10^{-7}x^{5}-0.0000483156x^{4}+0.00321712x^{3}-0.11989x^{2}+2.68692x
  const x = speed;
  return -1.004359267664*(10^(-9))*(x^6) + 3.5676720830782*(10^(-7))*x^5 - (0.0000483156*x^4) + (0.00321712*x^3) - (0.11989*x^2) + (2.68692*x)
}

export interface CoordData{
  latitude: number;
  longitude: number;
  altitude: number | null;
  timestamp: number;
  speed: number | null;
}

export interface CalculateResults{
  emissions: number;
  speed: number;
  distance_traveled: number;
}

export function getAvgCoord(locations: Array<any>, start_idx: number, end_idx: number){
  var timestamps = locations.slice(start_idx, end_idx).map( v => v.timestamp);
  var latitudes = locations.slice(start_idx, end_idx).map( v => v.coords.latitude);
  var longitudes = locations.slice(start_idx, end_idx).map( v => v.coords.longitude);
  var altitudes = locations.slice(start_idx, end_idx).map( v => v.coords.altitude);
  var speeds = locations.slice(start_idx, end_idx).map( v => v.coords.speed);
  
  var length = end_idx - start_idx;
  var first_3_time = timestamps.reduce( (a,b) => a + b) / length;
  var first_3_latitude = latitudes.reduce( (a,b) => a + b) / length;
  var first_3_longitude = longitudes.reduce( (a,b) => a + b) / length;
  var first_3_altitude = null;
  var sum = altitudes.reduce( function (a,b) { 
    return (a==null ? 0 : a) + (b == null ? 0 : b);
  });
  if (sum != null){
    first_3_altitude =  sum / length;
  }
  var first_3_speed = null;
  sum = speeds.reduce( function (a,b) { 
    return (a==null ? 0 : a) + (b == null ? 0 : b);
  });
  if (sum != null){
    first_3_speed =  sum / length;
  }
  var first_half: CoordData = {
    timestamp: first_3_time, 
    latitude: first_3_latitude, 
    longitude: first_3_longitude, 
    altitude: first_3_altitude,
    speed: first_3_speed
  };

  return first_half;
}

export function calcResults(first:CoordData, next:CoordData){
  var time_delta = (next.timestamp - first.timestamp)/(1000);
  var altitude_delta = 0;
  if(next.altitude != null && first.altitude != null)
  altitude_delta = next.altitude - first.altitude;
    
  var dm = measure(first.latitude, first.longitude, next.latitude, next.longitude);
  
  var final_distance = Math.sqrt((dm**2) + (altitude_delta**2));
  final_distance = Math.max(final_distance, 0); 
  
  var speed = next.speed;
  if(speed == null){
    speed = final_distance / time_delta; 
  } else {
    Math.min(speed, final_distance / time_delta);
  }
  // var speed = final_distance / time_delta; 
  // meters per second -> miles per gallon
  speed *= 2.23694;
  var GPM = 1/getMPG(speed);
  if (speed < 5 || speed > 130){
    GPM = 0.05;
  }
  var dist_in_miles = final_distance * 0.000621371; // converts meters to miles
  var GPM = 1/getMPG(speed);
  if (speed < 5 || speed > 130){
    GPM = 0.05;
  }
  var gallons_wasted = GPM * dist_in_miles;

  var results: CalculateResults = {
    emissions: gallons_wasted * GRAMS_CO2_PER_GALLON,
    speed: speed,
    distance_traveled: dist_in_miles
  }
  return results;
}