import { TStationListed } from '@/core/models/stations.model';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { ConfirmationService } from 'primeng/api';
import { RoutesFacadeService } from '@/features/routes-management/services/routes-facade.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@/shared/services/notification.service';
import { TooltipModule } from 'primeng/tooltip';
import { StationsFacadeService } from '../../services/stations-facade.service';

@Component({
  selector: 'app-station-item',
  standalone: true,
  imports: [PanelModule, CommonModule, TooltipModule],
  providers: [DestroyService],
  templateUrl: './station-item.component.html',
  styleUrl: './station-item.component.scss',
})
export class StationItemComponent implements OnInit {
  @Input() station!: TStationListed;

  private destroy$ = inject(DestroyService);

  private stationsFacade = inject(StationsFacadeService);

  private routesFacade = inject(RoutesFacadeService);

  private notificationService = inject(NotificationService);

  private confirmationService = inject(ConfirmationService);

  private connectedToStations: string[] = [];

  ngOnInit(): void {
    this.stationsFacade.stations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((stations) => {
        this.connectedToStations = this.station.connectedTo.map(
          ({ id }) =>
            stations.find((station) => id === station.id)?.city ?? 'Unknown',
        );
      });
  }

  get connectedStations() {
    return this.connectedToStations.join(' ');
  }

  public deleteClick(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this station?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => this.deletionConfirm(),
    });
  }

  private deletionConfirm() {
    const request$ = this.stationsFacade.delete(this.station.id);
    request$.subscribe({
      next: ({ status, error }) => {
        if (status === 'success') {
          this.notificationService.messageConfirm('Station deleted');
        } else {
          this.notificationService.messageError(error?.message);
        }
      },
    });
  }
}
