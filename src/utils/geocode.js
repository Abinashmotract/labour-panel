// src/utils/googleMaps.js
import axios from "axios";

const GOOGLE_API_KEY = "AIzaSyByeL4973jLw5-DqyPtVl79I3eDN4uAuAQ"; 

// 🔹 Google Geocoding API helper
export const getCoordinatesFromAddress = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_API_KEY}`;

  const response = await axios.get(url);

  if (response.data.status === "OK" && response.data.results.length > 0) {
    const result = response.data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  } else {
    throw new Error("Address not found, please try again");
  }
};


// const GOOGLE_API_KEY = "AIzaSyByeL4973jLw5-DqyPtVl79I3eDN4uAuAQ"; 

// const getCoordinatesFromAddress = async (address) => {
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//     address
//   )}&key=${GOOGLE_API_KEY}`;

//   const response = await axios.get(url);

//   if (response.data.status === "OK" && response.data.results.length > 0) {
//     const result = response.data.results[0];
//     return {
//       latitude: result.geometry.location.lat,
//       longitude: result.geometry.location.lng,
//       formattedAddress: result.formatted_address,
//     };
//   } else {
//     throw new Error("Address not found, please try again");
//   }
// };