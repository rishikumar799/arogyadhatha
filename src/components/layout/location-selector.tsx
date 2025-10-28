
'use client';

import * as React from "react";
import { useLocation } from "@/context/location-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, LocateFixed, MapPin, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { locations } from "@/lib/locations-data";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export function LocationSelector({ inHeader }: { inHeader?: boolean }) {
    const { location, setLocation } = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);

    const [selectedState, setSelectedState] = React.useState<string | null>(location.state);
    const [selectedDistrict, setSelectedDistrict] = React.useState<string | null>(location.district);
    const [selectedMandal, setSelectedMandal] = React.useState<string | null>(location.mandal);
    const [villageSearch, setVillageSearch] = React.useState('');

    const districts = React.useMemo(() => {
        if (!selectedState) return [];
        return locations[selectedState as keyof typeof locations]?.districts || [];
    }, [selectedState]);

    const mandals = React.useMemo(() => {
        if (!selectedState || !selectedDistrict) return [];
        const district = districts.find(d => d.name === selectedDistrict);
        return district?.mandals || [];
    }, [selectedState, selectedDistrict, districts]);

    const villages = React.useMemo(() => {
        if (!selectedState || !selectedDistrict || !selectedMandal) return [];
        const mandal = mandals.find(m => m.name === selectedMandal);
        const filtered = mandal?.villages.filter(v => v.toLowerCase().includes(villageSearch.toLowerCase())) || [];
        return filtered.length > 0 ? filtered : [villageSearch]; // Allow custom entry
    }, [selectedState, selectedDistrict, selectedMandal, villageSearch, mandals]);

    const handleSetLocation = (village: string) => {
        setLocation({
            state: selectedState,
            district: selectedDistrict,
            mandal: selectedMandal,
            village: village
        });
        setIsOpen(false);
    };
    
    React.useEffect(() => {
        if (isOpen) {
            setSelectedState(location.state);
            setSelectedDistrict(location.district);
            setVillageSearch('');
            // Only reset mandal if district changes or is not set
            if(location.district !== selectedDistrict) {
              setSelectedMandal(null);
            } else {
              setSelectedMandal(location.mandal);
            }
        }
    }, [isOpen, location]);

    const displayLocation = [location.village, location.mandal, location.district].filter(Boolean).join(', ');
    const shortDisplayLocation = location.village || location.mandal || location.district || null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {inHeader ? (
                    <button className="flex items-center gap-1 text-xs text-primary-foreground/80">
                        <MapPin className="h-3 w-3"/>
                        <span className="truncate max-w-[150px]">{shortDisplayLocation || 'Select Location'}</span>
                        <ChevronRight className="h-3 w-3"/>
                    </button>
                ) : (
                     <div className="flex items-center gap-2 cursor-pointer text-muted-foreground w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate flex-1 text-left">{shortDisplayLocation || 'Select Location'}</span>
                    </div>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Your Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <Button variant="outline" className="w-full justify-start gap-2">
                        <LocateFixed className="h-4 w-4 text-primary" /> Use my current location
                    </Button>
                    <div className="space-y-2">
                        <Select onValueChange={(val) => {setSelectedState(val); setSelectedDistrict(null); setSelectedMandal(null);}} value={selectedState || ""}>
                            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                            <SelectContent>
                                {Object.keys(locations).map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {selectedState && (
                             <Select onValueChange={(val) => {setSelectedDistrict(val); setSelectedMandal(null);}} value={selectedDistrict || ""}>
                                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                                <SelectContent>
                                    {districts.map(dist => <SelectItem key={dist.name} value={dist.name}>{dist.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                        {selectedDistrict && (
                            <Select onValueChange={(val) => {setSelectedMandal(val);}} value={selectedMandal || ""}>
                                <SelectTrigger><SelectValue placeholder="Select Mandal" /></SelectTrigger>
                                <SelectContent>
                                    {mandals.map(mandal => <SelectItem key={mandal.name} value={mandal.name}>{mandal.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                        {selectedMandal && (
                            <div className='space-y-2'>
                                <div className='relative'>
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder='Search or type Village/Town...' className="pl-8" value={villageSearch} onChange={(e) => setVillageSearch(e.target.value)} />
                                </div>
                                <ScrollArea className="h-40 w-full rounded-md border p-2">
                                     {villages.map(village => (
                                        <Button key={village} variant="ghost" className="w-full justify-start" onClick={() => handleSetLocation(village)}>
                                            {village}
                                        </Button>
                                     ))}
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
