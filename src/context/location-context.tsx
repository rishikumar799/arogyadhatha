
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Location {
    state: string | null;
    district: string | null;
    mandal: string | null;
    village: string | null;
}

interface LocationContextType {
    location: Location;
    setLocation: React.Dispatch<React.SetStateAction<Location>>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<Location>({
        state: "Andhra Pradesh",
        district: "Guntur",
        mandal: null,
        village: null
    });

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
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
