import { Map } from "@/registry/map";
import { Marker } from "@/registry/marker";
import { Popup } from "@/registry/popup";

export function PopupExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[-97.7404, 30.2747]} zoom={14}>
        <Marker lng={-97.7404} lat={30.2747}>
          <Popup>
            <div className="bg-popover text-popover-foreground w-48 rounded-lg border p-3 shadow-md">
              <p className="font-medium">Texas State Capitol</p>
              <p className="text-muted-foreground text-xs">Austin, Texas</p>
            </div>
          </Popup>
        </Marker>
      </Map>
    </div>
  );
}
