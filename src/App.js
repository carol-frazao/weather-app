import React, { useState, useEffect } from 'react';
import './App.css';
import { AlertCircle, Search } from 'react-feather'
import { BiCurrentLocation } from 'react-icons/bi'
import { RiSunCloudyLine } from 'react-icons/ri'

const api = {
  key: "3ee32176fbc4070662893138e0e9dea6",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [background, setBackground] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(false);

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(`${api.base}weather?lat=${lat}&lon=${lon}&lang=pt_br&units=metric&APPID=${api.key}`);
          const data = await response.json();

          setWeather(data);
          setCurrentLocation(true);
          setBackground(data.main.temp > 15 ? 'warm' : 'cold');
        });
      }
    } catch (error) {
      setBackground('default')
      console.error(error);
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`${api.base}weather?q=${query}&lang=pt_br&units=metric&APPID=${api.key}`);
      const data = await response.json();

      if (query) {
        setWeather(data);
        setQuery('');
        setBackground(data.main.temp > 15 ? 'warm' : 'cold');
        setCurrentLocation(false)
      }
    } catch (error) {
      setNotFound(true)
      setBackground('default')
      console.error(error);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function formatDateToCustomString(date) {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril",
      "Maio", "Junho", "Julho", "Agosto",
      "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} de ${months[monthIndex]} de ${year}`;
  }

  const currentDate = new Date();
  const formattedDate = formatDateToCustomString(currentDate);

  return (
    <div className={`App ${background}`}>
      <main>
        <div className='current-date'>
          <RiSunCloudyLine size={17} style={{marginBottom: '-2px'}}/> Hoje, {formattedDate}
        </div>
        <div className="search-box">
          <button onClick={getCurrentLocationWeather} className='btn-current-location'> <BiCurrentLocation size={20}/></button>
          <div className='search-group'>
            <input
              type="text"
              className="search-bar"
              placeholder="Pesquisar cidade..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              onKeyDown={handleKeyDown}
            />
            <button className='btn-search-weather' onClick={handleSearch}> <Search size={16} /> </button>
          </div>
        </div>
        {weather.main ? (
          <div className="weather-box">
            <div className="weather">
              <div className="weather-icon">
                <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="Ícone do Tempo" />
              </div>
              <div className="weather-info">
                <div>
                  <p style={currentLocation ? {display: 'flex', alignItems: 'center', gap: '3px'} : {}}>
                    {weather.name}, {weather.sys.country} {currentLocation && <BiCurrentLocation size={16} />}
                  </p>
                  <p>{Math.round(weather.main.temp)}°C</p>
                  <p>{weather.weather[0].description}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          notFound && (
            <div className='not-weather-container'>
              <div className='not-weather-msg'> <AlertCircle size={16}/> Localização não encontrada. </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;
