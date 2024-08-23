export type TStationBasic = {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
};

export type TStationConnection = {
  id: number;
  distance: number;
};

export type TStationListed = TStationBasic & {
  connectedTo: TStationConnection[];
};

export type TStationCreation = Omit<TStationBasic, 'id'> & {
  relations: number[];
};
