import { useEffect, useState } from 'react'
import './App.css'

import searchIcon from "./assets/search.png";
import clearIcon from "./assets/sun.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/raining.png";
import windIcon from "./assets/wind.png";
import snowIcon from "./assets/snowy.png";
import humidityIcon from "./assets/humidity.png";

const WeatherDeatails=({icon,temp,city,country,lat,long,humidity,wind})=>{
  return(
    <>
    <div className='image'>
      <img className='icon' src={icon} alt="clear" />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className='lat'>latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='long'>longitude</span>
        <span>{long}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="humidity"
        className='icon1'  />
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="tex">Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="wind"
        className='icon1'  />
        <div className="data">
          <div className="wind-percent">{wind}km/h</div>
          <div className="tex">Wind Speed</div>
        </div>
      </div>
    </div>
    </>
  )
};

function App() {
  let API_Key="4d45b558874c9bcc49ccd261c86f6425";
  const[text,setText]=useState("nagercoil");
  const [icon, setIcon] = useState(snowIcon)
  const [temp, setTemp] = useState(0)
  const[city,setCity]=useState("Nagercoil")
  const[country,setCountry]=useState("IND")
  const[lat,setLat]=useState(0)
  const[long,setLong]=useState(0)
  const[humidity,setHumidity]=useState(0)
  const[wind,setWind]=useState(0)
  const[cityNotFound,setCityNotFound]=useState(false)
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState(null)

  const weatherIconMap={
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };

  const search=async()=>{
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${API_Key}`;

    try{
      let res=await fetch(url);
      let data=await res.json();
      // console.log(data);
      if(data.cod === "404"){
        console.error("city not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp -273.15 ));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);
      const weatherIconCode=data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);

    }catch(error){
      console.log("Place not found"+ error.message);
    }finally{
    setLoading(false);
    }
  }

  const handleCity=(e)=>{
    setText(e.target.value);
  };
  const handleKeyDown=(e)=>{
    if(e.key === "Enter"){
      search();
    }
  };
  useEffect(function(){
    search();
  },[]);
  

  return (
    <>
      <div className='container'>
        <div className="inputContainer">
          <input type="text"
          className='cityInput'
          onChange={handleCity}
          value={text} onKeyDown={handleKeyDown}
          placeholder='Search City' />
          <div className="search-icon" onClick={()=>search()}>
            <img className='search' src={searchIcon} alt="search" />
          </div>
        </div>

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        {!loading && !cityNotFound && <WeatherDeatails icon={icon} temp={temp} city={city} country={country}
        lat={lat} long={long} humidity={humidity} wind={wind}/>}
        <p className="copyright">Designed by <span>Prabin</span></p>
      </div>
    </>
  )
}

export default App
