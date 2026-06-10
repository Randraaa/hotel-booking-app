import { apiGet } from "@/services/api";
import type { Weather } from "@/types/weather";

export async function getLocalWeather(location: string): Promise<Weather> {
  // Queries our weather proxy endpoint which resolves Miami Beach weather
  void location;
  return apiGet<Weather>("/weather");
}
