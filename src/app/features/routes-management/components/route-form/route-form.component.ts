import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TRoute } from '@/core/models/routes.model';
import { NotificationService } from '@/shared/services/notification.service';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { map, startWith, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RoutesFacadeService } from '../../services/routes-facade.service';
import { StationsSectionService } from '../../services/stations-section.service';
import { CarriagesSectionService } from '../../services/carriages-section.service';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    CommonModule,
  ],
  providers: [DestroyService],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss',
})
export class RouteFormComponent implements OnInit, OnChanges {
  @Input() collapsed: boolean | undefined;

  @Input() route: TRoute | undefined;

  @Output() closeForm = new EventEmitter<void>();

  private destroy$ = inject(DestroyService);

  private notificationService = inject(NotificationService);

  private fb = inject(FormBuilder);

  private routesFacade = inject(RoutesFacadeService);

  private stationsService = inject(StationsSectionService);

  private carriagesService = inject(CarriagesSectionService);

  public routeForm = this.fb.group({
    stations: this.fb.array([]),
    carriages: this.fb.array([]),
  });

  public buttonIsDiabled$ = this.routeForm.valueChanges.pipe(
    startWith(null),
    takeUntil(this.destroy$),
    map(() => !this.formIsValid()),
  );

  ngOnInit(): void {
    this.loadInitialData();
    this.initializeRoute();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { route } = changes;
    if (route && !route.isFirstChange()) {
      this.resetForm();
      this.initializeRoute();
    }
  }

  private loadInitialData() {
    if (this.stationsService.stations.length === 0) {
      this.stationsService.loadStations();
    }
    if (this.carriagesService.carriages.length === 0) {
      this.carriagesService.loadCarriages();
    }
  }

  private initializeRoute() {
    if (!this.route) {
      this.addEmptyStation();
      this.addEmptyCarriage();
    } else {
      this.initializeRouteStations(this.route);
      this.initializeRouteCarriages(this.route);
    }
  }

  private initializeRouteStations(route: TRoute) {
    route.path.forEach((station) => {
      this.stations.push(this.fb.control(station));
    });
    this.addEmptyStation();
  }

  private initializeRouteCarriages(route: TRoute) {
    route.carriages.forEach((carriage) => {
      this.carriages.push(this.fb.control(carriage));
    });
    this.addEmptyCarriage();
  }

  get stations(): FormArray {
    return this.routeForm.controls.stations;
  }

  get carriages(): FormArray {
    return this.routeForm.controls.carriages;
  }

  public addEmptyStation(index?: number) {
    const { controls } = this.stations;
    const isLast = index === undefined || index === controls.length - 1;
    if (isLast) {
      this.stations.push(this.fb.control(''));
    }
    const selectedOptions = controls.map((ctrl) => ctrl.value);
    this.stationsService.updateStationOptions(selectedOptions);
  }

  public addEmptyCarriage(index?: number) {
    const { controls } = this.carriages;
    const isLast = index === undefined || index === controls.length - 1;
    if (isLast) {
      this.carriages.push(this.fb.control(''));
    }
  }

  public getStationDropdownOptions(index: number): SelectItem[] {
    return this.stationsService.stationOptions[index];
  }

  public getCarriageDropdownOptions(): SelectItem[] {
    return this.carriagesService.carriageOptions;
  }

  public removeStation(index: number) {
    const { controls } = this.stations;
    this.stations.removeAt(index);
    const selectedOptions = controls.map((ctrl) => ctrl.value);
    this.stationsService.updateStationOptions(selectedOptions);
  }

  public removeCarriage(index: number) {
    this.carriages.removeAt(index);
  }

  private resetForm() {
    this.routeForm.reset();
    this.stations.clear();
    this.carriages.clear();
  }

  public closeFormClick() {
    this.closeForm.emit();
  }

  private formIsValid() {
    return (
      this.stations.controls.length > 3 && this.carriages.controls.length > 3
    );
  }

  public onSubmit() {
    if (!this.formIsValid()) {
      return;
    }
    const path = this.stations.controls.map((ctrl) => ctrl.value);
    path.pop();
    const carriages = this.carriages.controls.map((ctrl) => ctrl.value);
    carriages.pop();
    // If we updating existing or creating new
    const request$ = this.route
      ? this.routesFacade.update({ id: this.route.id, path, carriages })
      : this.routesFacade.create({ path, carriages });

    request$.subscribe({
      next: (state) => {
        if (state.status === 'success') {
          this.notificationService.messageSuccess(
            this.route
              ? 'Route successfully updated'
              : 'Route successfully created',
          );
          this.resetForm();
          this.closeForm.emit();
        } else {
          this.notificationService.messageError(state.error?.message);
        }
      },
    });
  }
}
