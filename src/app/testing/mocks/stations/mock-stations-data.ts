import {
  StationMap,
  TStationCreation,
  TStationListed,
} from '@/core/models/stations.model';

export default class MockStationsData {
  static listedStations: TStationListed[] = [
    {
      id: 1,
      city: 'city 1',
      latitude: 34.05,
      longitude: -118.25,
      connectedTo: [
        { id: 2, distance: 5 },
        { id: 3, distance: 10 },
      ],
    },
    {
      id: 2,
      city: 'city 2',
      latitude: 40.71,
      longitude: -74.01,
      connectedTo: [
        { id: 1, distance: 5 },
        { id: 3, distance: 8 },
      ],
    },
    {
      id: 3,
      city: 'city 3',
      latitude: 48.85,
      longitude: 2.35,
      connectedTo: [
        { id: 1, distance: 12 },
        { id: 2, distance: 8 },
      ],
    },
    {
      id: 4,
      city: 'city 4',
      latitude: 51.51,
      longitude: -0.13,
      connectedTo: [
        { id: 3, distance: 7 },
        { id: 2, distance: 9 },
      ],
    },
  ];

  static creationStations: TStationCreation[] = [
    {
      city: 'new city 1',
      latitude: 52.52,
      longitude: 13.405,
      relations: [1, 2],
    },
    {
      city: 'new city 2',
      latitude: 48.85,
      longitude: 2.35,
      relations: [2, 3],
    },
    {
      city: 'new city 3',
      latitude: 40.71,
      longitude: -74.01,
      relations: [1, 4],
    },
    {
      city: 'new city 4',
      latitude: 34.05,
      longitude: -118.25,
      relations: [3, 4],
    },
  ];

  static stationMaps: StationMap[] = [
    {
      1: {
        id: 1,
        city: 'city 1',
        latitude: 34.05,
        longitude: -118.25,
        connectedTo: [
          { id: 2, distance: 5 },
          { id: 3, distance: 10 },
        ],
      },
      2: {
        id: 2,
        city: 'city 2',
        latitude: 40.71,
        longitude: -74.01,
        connectedTo: [
          { id: 1, distance: 5 },
          { id: 3, distance: 8 },
        ],
      },
      3: {
        id: 3,
        city: 'city 3',
        latitude: 48.85,
        longitude: 2.35,
        connectedTo: [
          { id: 1, distance: 12 },
          { id: 2, distance: 8 },
        ],
      },
      4: {
        id: 4,
        city: 'city 4',
        latitude: 51.51,
        longitude: -0.13,
        connectedTo: [
          { id: 3, distance: 7 },
          { id: 2, distance: 9 },
        ],
      },
    },
    {
      1: {
        id: 1,
        city: 'city 1',
        latitude: 34.05,
        longitude: -118.25,
        connectedTo: [
          { id: 2, distance: 5 },
          { id: 3, distance: 10 },
        ],
      },
      2: {
        id: 2,
        city: 'city 2',
        latitude: 40.71,
        longitude: -74.01,
        connectedTo: [
          { id: 1, distance: 5 },
          { id: 3, distance: 8 },
        ],
      },
      3: {
        id: 3,
        city: 'city 3',
        latitude: 48.85,
        longitude: 2.35,
        connectedTo: [
          { id: 1, distance: 12 },
          { id: 2, distance: 8 },
        ],
      },
      4: {
        id: 4,
        city: 'city 4',
        latitude: 51.51,
        longitude: -0.13,
        connectedTo: [
          { id: 3, distance: 7 },
          { id: 2, distance: 9 },
        ],
      },
    },
  ];
}
