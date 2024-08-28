import { TCarriage } from '@/core/models/carriages.model';
import { SelectItem } from 'primeng/api';

const formatCarriage = (station: TCarriage): SelectItem => {
  return {
    label: station.name,
    value: station.code,
  };
};

export default formatCarriage;
