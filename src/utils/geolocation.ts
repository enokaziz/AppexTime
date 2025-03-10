type GeolocationPosition = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

type GeolocationPositionError = {
  code: number;
  message: string;
};

declare global {
  interface Navigator {
    readonly geolocation: Geolocation;
  }

  interface Geolocation {
    getCurrentPosition: (successCallback: PositionCallback, errorCallback?: PositionErrorCallback | null | undefined, options?: PositionOptions) => void;
    watchPosition: (successCallback: PositionCallback, errorCallback?: PositionErrorCallback | null | undefined, options?: PositionOptions) => number;
    clearWatch: (watchId: number) => void;
  }

  interface PositionOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  }
}

export const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => resolve(position),
        (error: GeolocationPositionError) => reject(error)
      );
    } else {
      reject(new Error('Geolocation is not supported in this environment'));
    }
  });
};

export const watchPosition = (onUpdate: (position: GeolocationPosition) => void, onError: (error: GeolocationPositionError) => void): number => {
  if (navigator.geolocation) {
    return navigator.geolocation.watchPosition(onUpdate, onError);
  } else {
    throw new Error('Geolocation is not supported in this environment');
  }
};

export const clearWatch = (watchId: number): void => {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  } else {
    throw new Error('Geolocation is not supported in this environment');
  }
};

export {};
