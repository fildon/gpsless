const { acos, asin, cos, PI, sin } = Math;

const degToRad = (degrees) => PI * (degrees / 180);

/**
 * @see http://mypages.iit.edu/~maslanka/SolarGeo.pdf
 */
const getAzimuth = (latitudeRads, currentTime = new Date()) => {
  const omegaRads =
    ((2 * PI) / 24) * (currentTime.getHours() - 12) +
    ((2 * PI) / (24 * 60)) * currentTime.getMinutes() +
    ((2 * PI) / (24 * 60 * 60)) * currentTime.getSeconds();

  const monthOffsets = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const daysSinceNewYear =
    monthOffsets[currentTime.getMonth()] + currentTime.getDate();

  const deltaRads = asin(
    0.39795 * cos(degToRad(0.98563 * (daysSinceNewYear - 173)))
  );

  const alphaRads = asin(
    sin(deltaRads) * sin(latitudeRads) +
      cos(deltaRads) * cos(omegaRads) * cos(latitudeRads)
  );

  const azimuthRads = acos(
    (sin(deltaRads) * cos(latitudeRads) -
      cos(deltaRads) * cos(omegaRads) * sin(latitudeRads)) /
      cos(alphaRads)
  );

  // Astronomic convention: 0 = North, 0.5PI = East, PI = South, 1.5PI = West
  return omegaRads <= 0 ? azimuthRads : 2 * PI - azimuthRads;
};

const getAzimuthLine = () => document.getElementById("solarline");
const getSolarIcon = () => document.getElementById("solaricon");

const resetUi = () => {
  getAzimuthLine().setAttribute("x2", "0");
  getAzimuthLine().setAttribute("y2", "0");
  getSolarIcon().setAttribute("x", "0");
  getSolarIcon().setAttribute("y", "0");
};

// Astronomic convention: 0 = North, 0.5PI = East, PI = South, 1.5PI = West
const updateUi = (azimuth) => {
  const azimuth_x = sin(azimuth);
  // We need to flip since screen y points down rather than up
  const azimuth_y = -cos(azimuth);
  getAzimuthLine().setAttribute("x2", azimuth_x);
  getAzimuthLine().setAttribute("y2", azimuth_y);
  getSolarIcon().setAttribute("x", azimuth_x);
  getSolarIcon().setAttribute("y", azimuth_y);
};

let interval;
document
  .getElementById("location-select")
  .addEventListener("change", (event) => {
    clearInterval(interval);
    const latitude = parseFloat(event.target.value);
    if (Number.isNaN(latitude)) return resetUi();

    interval = setInterval(() => {
      const azimuth = getAzimuth(degToRad(latitude));
      updateUi(azimuth);
    }, 100);
  });
