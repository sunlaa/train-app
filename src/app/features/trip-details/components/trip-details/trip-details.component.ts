import { DestroyService } from '@/core/services/destroy/destroy.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [],
  providers: [DestroyService],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private route = inject(ActivatedRoute);

  private stationsFacade = inject(StationsFacadeService);

  rideId: string | null = null;

  fromId: number | null = null;

  toId: number | null = null;

  fromCity: string = '';

  toCity: string = '';

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.rideId = params.get('rideId');
    });

    this.route.queryParamMap
      .pipe(
        takeUntil(this.destroy$),
        tap((query) => {
          this.fromId = +query.get('from')!;
          this.toId = +query.get('to')!;
        }),
      )
      .subscribe(() => {
        this.stationsFacade.state$
          .pipe(
            filter((state) => state.status !== 'loading'),
            take(1),
          )
          .subscribe(() => {
            const stationMap = this.stationsFacade.stationMap();
            if (!stationMap) throw Error('No station map in store.');

            this.fromCity = this.fromId
              ? stationMap[this.fromId].city
              : 'Unknown';
            this.toCity = this.toId ? stationMap[this.toId].city : 'Unknown';
          });
      });
  }
}
