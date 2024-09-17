import { TCarriage } from '@/core/models/carriages.model';
import { SelectItem } from 'primeng/api';

export default class MockCarriagesSection {
  carriages: TCarriage[] = [];

  carriageOptions: SelectItem[] = [];

  loadCarriages() {}
}
