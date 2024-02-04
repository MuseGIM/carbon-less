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