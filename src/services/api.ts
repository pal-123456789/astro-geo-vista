import axios from 'axios';

// API Configuration based on your provided keys
export const API_CONFIG = {
  NASA_API_KEY: '2eqhKjFk9XDcZyWjQHWoslEpWXMoJNYdgdadSSEB',
  OPENWEATHER_API_KEY: 'db762d54fef72d47495b6b7613e0d1c8',
  VISUAL_CROSSING_API_KEY: 'U8JT4WFESWD89EAD9SNM29E6P',
  OPENCAGE_API_KEY: 'e78b239461174028aa2dfff458e8cabf',
  CESIUM_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0M2E4YzVhZC04N2UxLTRjYzQtYmIyYy01MTFmNWY0OTU3YWUiLCJpZCI6MzM0MTI1LCJpYXQiOjE3NTU3ODQyMDN9.Gno1MSCy-EFLewOtbU_uJ9ZNHKLP3PPi586AGED-cy0'
};

// NASA API Service
export const nasaApi = {
  // Astronomy Picture of the Day
  async getAPOD() {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${API_CONFIG.NASA_API_KEY}`
    );
    return response.data;
  },

  // Near Earth Objects
  async getNearEarthObjects(startDate: string, endDate: string) {
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_CONFIG.NASA_API_KEY}`
    );
    return response.data;
  },

  // Mars Rover Photos
  async getMarsRoverPhotos(sol: number = 1000) {
    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${API_CONFIG.NASA_API_KEY}`
    );
    return response.data;
  },

  // Earth Imagery
  async getEarthImagery(lat: number, lon: number, date?: string) {
    const dateParam = date || new Date().toISOString().split('T')[0];
    const response = await axios.get(
      `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${dateParam}&api_key=${API_CONFIG.NASA_API_KEY}`
    );
    return response.data;
  }
};

// Weather API Service
export const weatherApi = {
  // Current Weather
  async getCurrentWeather(lat: number, lon: number) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  },

  // Weather Forecast
  async getWeatherForecast(lat: number, lon: number) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  },

  // Visual Crossing Weather (Advanced)
  async getAdvancedWeather(location: string) {
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_CONFIG.VISUAL_CROSSING_API_KEY}&contentType=json`
    );
    return response.data;
  }
};

// Geocoding API Service
export const geocodingApi = {
  // Forward Geocoding
  async forwardGeocode(query: string) {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${API_CONFIG.OPENCAGE_API_KEY}`
    );
    return response.data;
  },

  // Reverse Geocoding
  async reverseGeocode(lat: number, lon: number) {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_CONFIG.OPENCAGE_API_KEY}`
    );
    return response.data;
  }
};

// Location Service
export const locationService = {
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
};

// Error Handler
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    throw new Error(error.response.data.message || 'API request failed');
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Network error - please check your connection');
  } else {
    // Something else happened
    throw new Error('An unexpected error occurred');
  }
};