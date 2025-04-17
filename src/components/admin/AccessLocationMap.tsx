
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Sample data - in a real application, this would come from your backend
const sampleLocations = [
  { id: 1, lat: 27.7172, lng: 85.3240, count: 156, location: "Kathmandu, Nepal" },
  { id: 2, lat: 28.2096, lng: 83.9856, count: 89, location: "Pokhara, Nepal" },
  { id: 3, lat: 26.4280, lng: 87.2780, count: 67, location: "Biratnagar, Nepal" },
  { id: 4, lat: 28.9985, lng: 80.1674, count: 45, location: "Dhangadhi, Nepal" },
  { id: 5, lat: 28.6542, lng: 80.8986, count: 34, location: "Mahendranagar, Nepal" },
  { id: 6, lat: 27.0380, lng: 85.0406, count: 29, location: "Birgunj, Nepal" },
];

interface AccessLocationMapProps {
  className?: string;
}

const AccessLocationMap = ({ className }: AccessLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  
  useEffect(() => {
    // Check if we already have a token in localStorage
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;
    
    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [84.1240, 28.3949], // Center on Nepal
      zoom: 5.5,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add locations after map loads
      if (map.current) {
        sampleLocations.forEach(location => {
          // Create a marker element
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundColor = '#10b981'; // Green color
          el.style.width = '16px';
          el.style.height = '16px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
          
          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([location.lng, location.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3 class="font-bold">${location.location}</h3><p>${location.count} visits</p>`))
            .addTo(map.current);
        });
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  const handleSaveToken = () => {
    if (tokenInput) {
      localStorage.setItem('mapbox-token', tokenInput);
      setMapboxToken(tokenInput);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Access Locations</CardTitle>
        <CardDescription>Geographic distribution of website visitors</CardDescription>
      </CardHeader>
      <CardContent>
        {!mapboxToken ? (
          <div className="p-4 text-center">
            <p className="mb-4 text-sm text-muted-foreground">Please enter your Mapbox token to display the map</p>
            <div className="flex gap-2 mb-2 justify-center">
              <input 
                type="text" 
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter Mapbox token"
                className="flex h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <button 
                onClick={handleSaveToken}
                className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md text-sm"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Get a token at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
            </p>
          </div>
        ) : (
          <>
            <div className="h-[300px] relative rounded-md overflow-hidden">
              <div ref={mapContainer} className="w-full h-full" />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium">Total locations:</span> {sampleLocations.length} • 
              <span className="font-medium ml-2">Total visits:</span> {sampleLocations.reduce((acc, loc) => acc + loc.count, 0)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessLocationMap;
