"use client"

import { useState, useCallback } from "react"

interface GeolocationState {
  loading: boolean
  error: string | null
  lat: number | null
  lon: number | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    lat: null,
    lon: null,
  })

  const getCurrentPosition = useCallback((): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      setState((prev) => ({ ...prev, loading: true, error: null }))

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setState({
            loading: false,
            error: null,
            lat: latitude,
            lon: longitude,
          })
          resolve({ lat: latitude, lon: longitude })
        },
        (error) => {
          let errorMessage = "Failed to get your location"
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please search manually."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out"
              break
          }

          setState({
            loading: false,
            error: errorMessage,
            lat: null,
            lon: null,
          })
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      lat: null,
      lon: null,
    })
  }, [])

  return {
    ...state,
    getCurrentPosition,
    reset,
  }
}

