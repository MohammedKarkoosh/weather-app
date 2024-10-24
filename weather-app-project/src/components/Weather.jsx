import { CiSearch } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

export default function Weather() {
  const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
  const [weatherData, setWeatherData] = useState(null);
  const [iconCode, setIconCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const search = async (city) => {
    if (!city) {
      alert("Enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temp: Math.floor(data.main.temp),
        location: data.name,
      });
      setIconCode(data.weather[0].icon);
      inputRef.current.value="";
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search(inputRef.current.value);
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className="font-poppins flex justify-center items-center h-screen flex-col ">
      <div className="flex items-center bg-blue-500 rounded p-4 w-1/2 max-w-md flex-col shadow-lg shadow-black bg-gradient-to-t from-blue-400 to-blue-500">
        <div className="flex w-full mt-2 justify-between">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="flex-grow bg-transparent rounded border-4 outline-none p-2 text-white text-lg font-bold uppercase"
            onKeyDown={handleKeyDown}
          />
          <CiSearch
            className="text-white m-2 cursor-pointer"
            size={24}
            onClick={() => search(inputRef.current.value)}
          />
          
        </div>

        <div className="flex justify-center items-center p-10">
          {iconCode && (
            <img
              src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
              alt="Weather Icon"
              className="w-40 h-40"
            />
          )}
        </div>
        
        {loading && <p className="text-white">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {weatherData && (
          <div className="font-bold text-white p-2 text-2xl flex flex-col items-center m-2">
            <span className="text-6xl">{weatherData.temp} &deg; C</span>
            <span className="text-slate-200">{weatherData.location}</span>
          </div>
        )}

        <div className="flex w-full justify-around text-center m-2 ">
          <div>
            <div className="flex text-2xl text-white gap-2 ">
              <WiHumidity size={30} />
              <span>{weatherData ? `${weatherData.humidity}%` : 'Loading...'}</span>
            </div>
            <p className="text-slate-300">Humidity</p>
          </div>
          <div>
            <div className="flex text-2xl text-white gap-2">
              <FaWind size={30} />
              <span>{weatherData ? `${weatherData.windSpeed} km/h` : 'Loading...'}</span>
            </div>
            <p className="text-slate-300">Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
