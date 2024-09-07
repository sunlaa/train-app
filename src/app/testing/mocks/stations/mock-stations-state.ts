import { StationsState } from '@/redux/reducers';
import MockStationsData from './mock-stations-data';

export default class MockStationsState {
  static successState: StationsState = {
    stations: MockStationsData.listedStations,
    status: 'success',
    error: null,
  };

  static loadingState: StationsState = {
    stations: MockStationsData.listedStations,
    status: 'loading',
    error: null,
  };

  static errorState: StationsState = {
    stations: MockStationsData.listedStations,
    status: 'error',
    error: { message: 'Some error', reason: 'someError' },
  };
}
