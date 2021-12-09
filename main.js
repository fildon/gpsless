// https://www.itacanet.org/the-sun-as-a-source-of-energy/part-3-calculating-solar-angles/
const currentTime = new Date();
const currentHour = currentTime.getHours();
const monthOffsets = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const daysSinceNewYear =
  monthOffsets[currentTime.getMonth()] + currentTime.getDate();

// declination angle
const delta =
  23.45 *
  (Math.PI / 180) *
  Math.sin(2 * Math.PI * ((285 + daysSinceNewYear) / 36.25));

// Observer's latitude
const phi = 0.9076; // Delft's latitude in radians

// Solar hour angle in radians NB: sometimes denoted with 'h'
const omega = 0.2618 * (currentHour - 12);

// Altitude angle
// const alpha = Math.asin(
//   // TODO beware the inverse sin has two possible results, only one of which is correct
//   Math.sin(delta) * Math.sin(phi) +
//     Math.cos(delta) * Math.cos(omega) * Math.cos(phi)
// );

// Zenith angle
const theta =
  Math.sin(phi) * Math.sin(delta) +
  Math.cos(phi) * Math.cos(delta) * Math.cos(omega);

// https://en.wikipedia.org/wiki/Solar_azimuth_angle#Conventional_Trigonometric_Formulas
const azimuth = Math.acos(
  (Math.sin(delta) - Math.cos(theta) * Math.sin(phi)) /
    (Math.sin(theta) * Math.cos(phi))
);

console.log({ delta, phi, omega, theta, azimuth });
