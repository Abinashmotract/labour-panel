// src/utils/geocode.js
import axios from "axios";

export async function getCoordinatesFromAddress(address, apiKey) {
  try {
    if (!address || !apiKey) {
      throw new Error("Address and API key are required");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    } else if (response.data.status === "ZERO_RESULTS") {
      throw new Error("Address not found. Please enter a more specific address.");
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error(`Failed to get coordinates: ${error.message}`);
  }
}