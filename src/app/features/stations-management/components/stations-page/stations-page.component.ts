import { Component, inject, OnInit } from '@angular/core';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { filter, takeUntil } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { TStationListed } from '@/core/models/stations.model';
import { PaginatorModule } from 'primeng/paginator';
import { PageEvent } from '@/core/models/shared.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { StationsFacadeService } from '../../services/stations-facade.service';
import { StationItemComponent } from '../station-item/station-item.component';
import { STATIONS_PER_PAGE_OPTIONS } from '../../config/consts';
import { StationFormComponent } from '../station-form/station-form.component';

@Component({
  selector: 'app-stations-page',
  standalone: true,
  imports: [
    ToastModule,
    ConfirmDialogModule,
    StationItemComponent,
    PaginatorModule,
    StationFormComponent,
    SkeletonModule,
  ],
  providers: [DestroyService, ConfirmationService],
  templateUrl: './stations-page.component.html',
  styleUrl: './stations-page.component.scss',
})
export class StationsPageComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private stationsFacade = inject(StationsFacadeService);

  public stationsPerPageOptions = STATIONS_PER_PAGE_OPTIONS;

  public offset: number = 0;

  public stationsPerPage: number = this.stationsPerPageOptions[0];

  public totalStations: number = 0;

  public allStations: TStationListed[] = [];

  public pageStations: TStationListed[] = [];

  ngOnInit(): void {
    this.listenStationsState();
  }

  private listenStationsState() {
    this.stationsFacade.state$
      .pipe(
        takeUntil(this.destroy$),
        filter(({ status }) => status !== 'loading'),
      )
      .subscribe(({ stations }) => {
        this.allStations = stations;
        this.totalStations = stations.length;
        if (this.offset > this.totalStations) {
          this.onPageChange({ first: this.totalStations });
        } else {
          this.updatePageRoutes();
        }
      });
  }

  public onPageChange(event: PageEvent) {
    this.offset = event.first ?? this.offset;
    this.stationsPerPage = event.rows ?? this.stationsPerPage;
    this.updatePageRoutes();
  }

  private updatePageRoutes() {
    this.pageStations = this.allStations.slice(
      this.offset,
      this.stationsPerPage + this.offset,
    );
  }
}
