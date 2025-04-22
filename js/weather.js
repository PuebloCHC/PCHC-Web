async function getWeather() {
    const apiKey = "dab06b665fa116acd91338d9bcfc1965"; // Replace with your actual key
    const city = "Pueblo";
    const state = "CO";
    const country = "US";
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=imperial&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const temp = data.main.temp;
      const description = data.weather[0].description;
  
      document.getElementById("weather").innerHTML = `
        <strong>${temp}°F</strong><br>
        ${description.charAt(0).toUpperCase() + description.slice(1)}
      `;
    } catch (error) {
      document.getElementById("weather").innerText = "Weather info unavailable.";
      console.error("Weather fetch failed:", error);
    }
  }