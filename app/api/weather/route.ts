import { NextResponse } from "next/server";
import axios from "axios";

function mapWmoCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Sunny", icon: "☀️" };
  if ([1, 2, 3].includes(code)) return { condition: "Partly Cloudy", icon: "⛅" };
  if ([45, 48].includes(code)) return { condition: "Foggy", icon: "🌫️" };
  if ([51, 53, 55].includes(code)) return { condition: "Drizzle", icon: "🌧️" };
  if ([61, 63, 65].includes(code)) return { condition: "Rainy", icon: "🌧️" };
  if ([71, 73, 75].includes(code)) return { condition: "Snowy", icon: "❄️" };
  if ([80, 81, 82].includes(code)) return { condition: "Showers", icon: "🌦️" };
  if ([95, 96, 99].includes(code)) return { condition: "Thunderstorm", icon: "⛈️" };
  return { condition: "Sunny", icon: "☀️" };
}

export async function GET() {
  try {
    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=25.7906&longitude=-80.1300&current_weather=true",
      { timeout: 3000 } // Fail fast to avoid blocking pages
    );

    const current = response.data?.current_weather;
    if (!current) {
      throw new Error("Invalid response structure from weather provider");
    }

    const tempCelsius = current.temperature;
    const tempFahrenheit = Math.round((tempCelsius * 9) / 5 + 32);
    const { condition, icon } = mapWmoCode(current.weathercode);

    return NextResponse.json({
      location: "Miami Beach, FL",
      temperature: tempFahrenheit,
      condition,
      icon,
    });
  } catch (error) {
    console.error("Weather API proxy error:", error);
    
    // Return graceful fallback state
    return NextResponse.json({
      location: "Miami Beach, FL",
      temperature: 78,
      condition: "Sunny",
      icon: "☀️",
    });
  }
}
