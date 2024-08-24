import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TRoute } from '@/core/models/routes.model';
import { RoutesFacadeService } from '../../services/routes-facade.service';
import { disableControls } from '../../utils';
import { StationsSectionService } from '../../services/stations-section.service';
import { CarriagesSectionService } from '../../services/carriages-section.service';

type DropdownOptions = {
  original: SelectItem[];
  secondLast: SelectItem[];
  last: SelectItem[];
};

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss',
})
export class RouteFormComponent implements OnInit {
  @Input() route: TRoute | undefined;

  private messageService = inject(MessageService);

  private fb = inject(FormBuilder);

  private routesFacade = inject(RoutesFacadeService);

  private stationsService = inject(StationsSectionService);

  private carriagesService = inject(CarriagesSectionService);

  public routeForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
    this.initializeRoute();
  }

  private initializeForm() {
    this.routeForm = this.fb.group({
      stations: this.fb.array([]),
      carriages: this.fb.array([]),
    });
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
    return this.routeForm.get('stations') as FormArray;
  }

  get carriages(): FormArray {
    return this.routeForm.get('carriages') as FormArray;
  }

  public addEmptyStation(index?: number) {
    const { controls } = this.stations;
    const isLast = index === undefined || index === controls.length - 1;
    if (isLast) {
      this.stations.push(this.fb.control(''));
      disableControls(controls, controls.length - 2);
    }
    const selectedOptions = controls.map((ctrl) => ctrl.value);
    this.stationsService.updateStationOptions(selectedOptions);
  }

  public addEmptyCarriage(index?: number) {
    const { controls } = this.carriages;
    const isLast = index === undefined || index === controls.length - 1;
    if (isLast) {
      this.carriages.push(this.fb.control(''));
      disableControls(controls, controls.length - 2);
    }
    const selectedOptions = controls.map((ctrl) => ctrl.value);
    this.carriagesService.updateCarriageOptions(selectedOptions);
  }

  public getStationDropdownOptions(index: number): SelectItem[] {
    const { controls } = this.stations;
    return this.getDropdownOptions(
      index,
      controls,
      this.stationsService.getStationOptions(),
    );
  }

  public getCarriageDropdownOptions(index: number): SelectItem[] {
    const { controls } = this.carriages;
    return this.getDropdownOptions(
      index,
      controls,
      this.carriagesService.getCarriageOptions(),
    );
  }

  private getDropdownOptions(
    index: number,
    controls: AbstractControl[],
    options: DropdownOptions,
  ): SelectItem[] {
    const lastIndex = controls.length - 1;
    const secondLastIndex = lastIndex - 1;
    if (index === lastIndex) return options.last;
    if (index === secondLastIndex) return options.secondLast;
    return options.original;
  }

  public removeStation(index: number) {
    const { controls } = this.stations;
    this.stations.removeAt(index);
    const selectedOptions = controls.map((ctrl) => ctrl.value);
    disableControls(controls, controls.length - 2);
    this.stationsService.updateStationOptions(selectedOptions);
  }

  public removeCarriage(index: number) {
    const { controls } = this.carriages;
    this.carriages.removeAt(index);
    disableControls(controls, controls.length - 2);
    const selectedOptions = controls.map((ctrl) => ctrl.value);
    this.carriagesService.updateCarriageOptions(selectedOptions);
  }

  private messageSuccess(message: string | undefined) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  private messageError(message: string | undefined) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  private resetForm() {
    this.route = undefined;
    this.routeForm.reset();
    this.stations.clear();
    this.carriages.clear();
    this.addEmptyStation();
    this.addEmptyCarriage();
  }

  public onSubmit() {
    const path = this.stations.controls.map((ctrl) => ctrl.value);
    path.pop();
    const carriages = this.carriages.controls.map((ctrl) => ctrl.value);
    carriages.pop();
    try {
      if (path.length < 3) throw Error('Add at least 3 stations');
      if (carriages.length < 3) throw Error('Add at least 3 carriages');
      // If we updating existing or creating new
      const request$ = this.route
        ? this.routesFacade.update({ id: this.route.id, path, carriages })
        : this.routesFacade.create({ path, carriages });

      request$.subscribe({
        next: (state) => {
          if (state.status === 'success') {
            this.messageSuccess(
              this.route
                ? 'Route successfully saved'
                : 'Route successfully created',
            );
            this.resetForm();
          } else {
            this.messageError(state.error?.message);
          }
        },
      });
    } catch (e) {
      const error = e as Error;
      this.messageError(error.message);
    }
  }
}
