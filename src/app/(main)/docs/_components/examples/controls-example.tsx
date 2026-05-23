import { Controls } from "@/registry/controls";
import { Map } from "@/registry/map";

export function ControlsExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[-97.7431, 30.2672]} zoom={11}>
        <Controls position="top-right" />
      </Map>
    </div>
  );
}
