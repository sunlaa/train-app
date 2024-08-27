import { SearchStation } from '@/core/models/search.model';

export default function uniqueStations(...stations: SearchStation[]) {
  return stations.filter(
    (obj, index, self) => index === self.findIndex((t) => t.city === obj.city),
  );
}
