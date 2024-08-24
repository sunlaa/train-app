import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TCarriage } from '@/core/models/carriages.model';
import { DropdownOptions } from '../types';
import { formatCarriage } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class CarriagesSectionService {
  private carriagesFacade = inject(CarriagesFacadeService);

  public carriages: TCarriage[] = [];

  private carriageOptions: DropdownOptions = {
    original: [],
    secondLast: [],
    last: [],
  };

  public loadCarriages(): void {
    this.carriagesFacade.load();
    this.carriagesFacade.state$
      .pipe(map(({ carriages }) => carriages))
      .subscribe((carriages) => {
        this.carriages = carriages;
        this.updateCarriageOptions([]);
      });
  }

  public getCarriageOptions(): DropdownOptions {
    return this.carriageOptions;
  }

  public updateCarriageOptions(selectedOptions: string[]): void {
    this.carriageOptions.original = this.carriages.map(formatCarriage);
    this.carriageOptions.last = this.carriages
      .map(formatCarriage)
      .filter((opt) => !selectedOptions.includes(opt.value));
    this.carriageOptions.secondLast = this.carriages
      .map(formatCarriage)
      .filter((opt) => !selectedOptions.slice(0, -2).includes(opt.value));
  }
}
