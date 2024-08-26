import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TCarriage } from '@/core/models/carriages.model';
import { SelectItem } from 'primeng/api';
import { formatCarriage } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class CarriagesSectionService {
  private carriagesFacade = inject(CarriagesFacadeService);

  public carriages: TCarriage[] = [];

  public carriageOptions: SelectItem[] = [];

  public loadCarriages(): void {
    this.carriagesFacade.load();
    this.carriagesFacade.state$
      .pipe(map(({ carriages }) => carriages))
      .subscribe((carriages) => {
        this.carriages = carriages;
        this.carriageOptions = carriages.map(formatCarriage);
      });
  }
}
