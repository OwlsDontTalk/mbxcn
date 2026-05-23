import { Map } from "@/registry/map";
import { Marker } from "@/registry/marker";

const places = [
  { id: 1, name: "Texas State Capitol", lng: -97.7404, lat: 30.2747 },
  { id: 2, name: "Zilker Park", lng: -97.7713, lat: 30.2669 },
  { id: 3, name: "UT Austin", lng: -97.7394, lat: 30.2862 },
];

export function MarkerExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[-97.7503, 30.2759]} zoom={12}>
        {places.map((place) => (
          <Marker key={place.id} lng={place.lng} lat={place.lat}>
            <div className="bg-primary size-4 rounded-full border-2 border-white shadow-lg" />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
