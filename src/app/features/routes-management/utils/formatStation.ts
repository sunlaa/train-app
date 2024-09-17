import { TStationListed } from '@/core/models/stations.model';
import { SelectItem } from 'primeng/api';

const formatStation = (station: TStationListed): SelectItem => {
  return {
    label: station.city,
    value: station.id,
  };
};

export default formatStation;
