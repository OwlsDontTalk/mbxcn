import { Map } from "@/registry/map";

export function BasicMapExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[-97.7431, 30.2672]} zoom={11} />
    </div>
  );
}
