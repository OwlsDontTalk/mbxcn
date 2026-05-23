export type Location = {
  id: number;
  name: string;
  address: string;
  hours: string;
  lng: number;
  lat: number;
};

export const locations: Location[] = [
  {
    id: 1,
    name: "Houndstooth Coffee",
    address: "401 Congress Ave",
    hours: "7:00 AM – 7:00 PM",
    lng: -97.7424,
    lat: 30.268,
  },
  {
    id: 2,
    name: "Jo's Coffee",
    address: "1300 S Congress Ave",
    hours: "7:00 AM – 9:00 PM",
    lng: -97.7508,
    lat: 30.2516,
  },
  {
    id: 3,
    name: "Radio Coffee & Beer",
    address: "4204 Manchaca Rd",
    hours: "7:00 AM – 12:00 AM",
    lng: -97.7937,
    lat: 30.231,
  },
  {
    id: 4,
    name: "Mozart's Coffee Roasters",
    address: "3825 Lake Austin Blvd",
    hours: "7:00 AM – 11:00 PM",
    lng: -97.7905,
    lat: 30.2935,
  },
  {
    id: 5,
    name: "Epoch Coffee",
    address: "221 W North Loop Blvd",
    hours: "Open 24 hours",
    lng: -97.7253,
    lat: 30.3186,
  },
];
