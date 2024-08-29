import { TRoute } from '@/core/models/routes.model';
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
import { PanelModule } from 'primeng/panel';
import { filter, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@/shared/services/notification.service';
import { SkeletonModule } from 'primeng/skeleton';
import { RoutesFacadeService } from '../../services/routes-facade.service';

@Component({
  selector: 'app-route-item',
  standalone: true,
  imports: [PanelModule, TooltipModule, ConfirmDialogModule, SkeletonModule],
  providers: [DestroyService],
  templateUrl: './route-item.component.html',
  styleUrl: './route-item.component.scss',
})
export class RouteItemComponent implements OnInit, OnChanges {
  @Input() route!: TRoute;

  @Output() editRouteClick = new EventEmitter<TRoute>();

  @Output() deleteRoute = new EventEmitter<TRoute>();

  private destroy$ = inject(DestroyService);

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private notificationService = inject(NotificationService);

  private confirmationService = inject(ConfirmationService);

  private routesFacade = inject(RoutesFacadeService);

  private stationsFacade = inject(StationsFacadeService);

  public stations: string | undefined;

  private carriagesFacade = inject(CarriagesFacadeService);

  public carriages: string | undefined;

  id!: string;

  ngOnInit(): void {
    this.id = this.route.id.toString();
    this.loadStationsAndCarriages();
  }

  private loadStationsAndCarriages(): void {
    this.stationsFacade.stationsMap$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (stationsMap) => !!stationsMap && Object.keys(stationsMap).length > 0,
        ),
      )
      .subscribe((stationsMap) => {
        const stationNames = this.route.path.map((id) => stationsMap[id]?.city);
        const filteredNames = stationNames.filter((name) => name !== undefined);
        this.stations = filteredNames.join(' - ');
      });

    this.carriagesFacade.carriageMap$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (carriagesMap) =>
            !!carriagesMap && Object.keys(carriagesMap).length > 0,
        ),
      )
      .subscribe((carriagesMap) => {
        const carriageNames = this.route.carriages.map(
          (code) => carriagesMap[code]?.name,
        );
        const filteredNames = carriageNames.filter(
          (name) => name !== undefined,
        );
        this.carriages = filteredNames.join(' - ');
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['route'].isFirstChange()) {
      this.destroy$.next();
      this.loadStationsAndCarriages();
    }
  }

  public editClick() {
    this.editRouteClick.emit(this.route);
  }

  public assignRideClick() {
    this.router.navigate([this.route.id], {
      relativeTo: this.activatedRoute,
    });
  }

  public deleteClick(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this route?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        const request$ = this.routesFacade.delete(this.route.id);
        request$.subscribe({
          next: ({ status, error }) => {
            if (status === 'success') {
              this.deleteRoute.emit(this.route);
              this.notificationService.messageSuccess('Route deleted');
            } else {
              this.notificationService.messageError(error?.message);
            }
          },
        });
      },
    });
  }
}
