import { useState } from "react";
import sctImg from './img/scattered.png'
import clearImg from './img/clear.png'
import thunderImg from './img/storm.png'
import snowImg from './img/snow.jpg'
import rainImg from './img/rain.jpg'
import loadGif from './img/loading.gif'


function App() {

  const API_KEY = '2f58bb45c4ef38a5bf897e0dcf90d63c';

  const [ city, setCity ] = useState('')
  const [ weather, setWeather ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(false)

  const getWeatherFunc = async () => {
    try {
      setIsLoading(true)
      const coordinate = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
      const coordinateData = await coordinate.json()
      
      if(coordinateData.length > 0) {
        const { lat, lon } = coordinateData[0]
        const weatherApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        const weatherApiData = await weatherApi.json()
        setWeather(weatherApiData)
      } else {
        console.error('data could not be get')
      }
    } catch(err) {
      console.log(`Error: ${err.message}`);
    } finally {
      setIsLoading(false)
    }
  }
  

  let img_png
  if(weather) {
    img_png = 
      weather.weather[0].description === 'scattered clouds' || 
      weather.weather[0].description === 'broken clouds' || 
      weather.weather[0].description === 'few clouds' 
      ? sctImg
      : weather.weather[0].description === 'clear sky' 
      ? clearImg 
      : weather.weather[0].description === 'thunderstorm'
      ? thunderImg 
      : weather.weather[0].description === 'snow'
      ? snowImg
      : weather.weather[0].description === 'shower rain' ||
        weather.weather[0].description === 'rain'
      ? rainImg 
      : null
  }
    

  return (
    <section className="App">
      <form className="inputForm" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="inputCity">Enter a city:</label>
        <input 
          type="text" 
          id="inputCity"
          placeholder="Enter a city..."
          value={city}
          onChange={(e)=> setCity(e.target.value)}
        />
        <button
        type="submit"
        onClick={getWeatherFunc}
        className="inputBtn"
        >Submit</button>
      </form>

      <section className="weatherReport">
        { isLoading && !weather && 
          <img src={loadGif} alt="loading image" />
        }
        
        { !isLoading && weather && !city &&
          <p>Please enter a city name, where you want to know the temperature</p>
        }

        { !isLoading && !weather && city && 
          <p>Please enter valid city name.</p>
        }

        { !isLoading && weather && city &&
          <div className="showValue">
            <img src={img_png} alt="climate image" className="image"/>
              <div>
                <p>Today</p>
                <h2>{city}</h2>
                <p>Temperature: {Math.trunc(weather.main.temp)}°C</p>
                <p>{weather.weather[0].description}</p>
              </div>
          </div>
        }
      </section>
    </section>
  );
}

export default App;


