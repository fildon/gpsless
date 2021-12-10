const currentTime = new Date();
const currentHour = currentTime.getHours();
const monthOffsets = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const daysSinceNewYear =
  monthOffsets[currentTime.getMonth()] + currentTime.getDate();

// The total tilt of the Earth
const declinationMax = 0.4091; // Radians
// Current tilt
const declination =
  -declinationMax * Math.cos(((2 * Math.PI) / 365) * (daysSinceNewYear + 10));

// Time before solar noon is negative, noon is zero, afternoon is positive
const solarHour = 0.2618 * (currentHour - 12); // Radians

const latitude = 0.9076; // Delft's latitude in radians

const cosSolarZenithAngle =
  Math.sin(latitude) * Math.sin(declination) +
  Math.cos(latitude) * Math.cos(declination) * Math.cos(solarHour);

const cosAzimuth =
  (Math.sin(declination) - cosSolarZenithAngle * Math.sin(latitude)) /
  (Math.sin(Math.acos(cosSolarZenithAngle)) * Math.cos(latitude));

// Measures starting from North running clockwise for 2PI
const azimuth = Math.acos(cosAzimuth) + (solarHour < 0 ? 0 : Math.PI);
console.log((180 / Math.PI) * azimuth);
