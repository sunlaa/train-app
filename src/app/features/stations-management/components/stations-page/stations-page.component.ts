import { Component, inject, OnInit } from '@angular/core';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { filter, take, takeUntil } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { TStationListed } from '@/core/models/stations.model';
import { PaginatorModule } from 'primeng/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageEvent } from '@/core/models/shared.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
  ],
  providers: [DestroyService, ConfirmationService],
  templateUrl: './stations-page.component.html',
  styleUrl: './stations-page.component.scss',
})
export class StationsPageComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private stationsFacade = inject(StationsFacadeService);

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  public stationsPerPageOptions = STATIONS_PER_PAGE_OPTIONS;

  public offset: number = 0;

  public stationsPerPage: number = this.stationsPerPageOptions[0];

  public totalStations: number = 0;

  public allStations: TStationListed[] = [];

  public pageStations: TStationListed[] = [];

  ngOnInit(): void {
    this.getQueryParams();
    this.initializeStations();
  }

  private initializeStations() {
    this.stationsFacade.load();
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
    const page = Math.floor(this.offset / this.stationsPerPage) + 1;
    this.setQueryParams({ page, stationsPerPage: this.stationsPerPage });
    this.updatePageRoutes();
  }

  private updatePageRoutes() {
    this.pageStations = this.allStations.slice(
      this.offset,
      this.stationsPerPage + this.offset,
    );
  }

  private getQueryParams() {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe((params) => {
      const pageStr = params.get('page');
      let page = pageStr ? parseInt(pageStr, 10) : 1;
      if (Number.isNaN(page) || page < 1) {
        page = 1;
      }
      const stationsPerPageStr = params.get('stationsPerPage');
      let stationsPerPage = stationsPerPageStr
        ? parseInt(stationsPerPageStr, 10)
        : STATIONS_PER_PAGE_OPTIONS[0];
      if (!STATIONS_PER_PAGE_OPTIONS.includes(stationsPerPage)) {
        [stationsPerPage] = STATIONS_PER_PAGE_OPTIONS;
      }
      this.onPageChange({
        first: (page - 1) * stationsPerPage,
        rows: stationsPerPage,
      });
    });
  }

  private setQueryParams(params: Params) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
