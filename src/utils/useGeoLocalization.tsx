import { useState, useEffect } from 'react';

// Coordenadas del lugar específico (por ejemplo, una tienda, oficina, etc.)
const allowedLatitude = -31.427226; // Reemplaza con la latitud del lugar específico
const allowedLongitude = -64.182459; // Reemplaza con la longitud del lugar específico
const allowedRadius = 100; // Radio permitido en metros

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
};

const useGeoLocalization = () => {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('latitude', latitude);
          console.log('longitude', longitude);

          const distance = calculateDistance(
            latitude,
            longitude,
            allowedLatitude,
            allowedLongitude
          );
          setIsAllowed(distance <= allowedRadius);
        },
        (error) => {
          console.error(error);
          setIsAllowed(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsAllowed(false);
    }
  }, []);

  return isAllowed;
};

export default useGeoLocalization;
