const API_KEY = "86a913ce4838ad5c69b301e41019da02";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

import { DateTime} from "luxon";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const iconUrlCode = (icon) =>`http://openweathermap.org/img/wn/${icon}@2x.png`
const formatLocationTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs + offset, {zone:'utc'}).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
    
  } = data;

  const { main: details, icon } = weather[0];
  const formattedLocationTime = formatLocationTime(dt, timezone);

  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatLocationTime(sunrise, timezone, "hh:mm a"),
     sunset: formatLocationTime(sunset, timezone, "hh:mm a"),
     speed,
     details,
     icon: iconUrlCode(icon),
     formattedLocationTime,
     dt,
     timezone,
     lat,
    lon
  };
};

const formatForecastWeather = (secs, offset, data)=>{
    const hourly = data.filter((f)=>f.dt > secs)
    .map((f)=>({
        temp: f.main.temp,
        title: formatLocationTime(f.dt,offset,"hh:mm a"),
        icon: iconUrlCode(f.weather[0].icon),
        date: f.dt_txt,
    }))
    .slice(0,5);
    

    const daily = data.filter((f)=>f.dt_txt.slice(-8) === "00:00:00").map(f =>({
        temp: f.main.temp,
        title: formatLocationTime(f.dt,offset,"ccc"),
        icon: iconUrlCode(f.weather[0].icon),
        date: f.dt_txt,
    }));
   return{hourly , daily};
}
const getFormatWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrent);

  const {dt, lat, lon, timezone} = formattedCurrentWeather;
  const formatForWeather = await getWeatherData("forecast",{
    lat,lon,
    units:searchParams.units,
  }).then((d)=> formatForecastWeather(dt,timezone, d.list));
  return { ...formattedCurrentWeather , ...formatForWeather};
};
export default getFormatWeatherData;
