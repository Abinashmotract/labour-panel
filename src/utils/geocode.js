import axios from "axios";

const GOOGLE_API_KEY = "AIzaSyByeL4973jLw5-DqyPtVl79I3eDN4uAuAQ"; 

/**
 * Convert coordinates → address using Google Geocoding API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} formatted address
 */
export const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.status === "OK" && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      throw new Error("Address not found for coordinates");
    }
  } catch (error) {
    console.error("Reverse Geocoding Error:", error.message);
    return "N/A";
  }
};
