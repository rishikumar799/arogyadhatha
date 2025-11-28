
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Location {
    state: string | null;
    district: string | null;
    mandal: string | null;
    village: string | null;
    city: string | null;
    country: string | null;
}

interface LocationContextType {
    location: Location;
    setLocation: React.Dispatch<React.SetStateAction<Location>>;
    fetchLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<Location>({
        state: null,
        district: null,
        mandal: null,
        village: null,
        city: null,
        country: null,
    });

    const fetchLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await response.json();
                    setLocation({
                        state: data.principalSubdivision,
                        district: data.city || data.principalSubdivision,
                        mandal: data.locality,
                        village: data.village || data.locality,
                        city: data.city,
                        country: data.countryName,
                    });
                } catch (error) {
                    console.error("Error fetching location data:", error);
                }
            }, (error) => {
                console.error("Error getting user location:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    return (
        <LocationContext.Provider value={{ location, setLocation, fetchLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
