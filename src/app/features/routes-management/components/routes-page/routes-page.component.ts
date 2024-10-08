import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TRoute } from '@/core/models/routes.model';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { takeUntil } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PageEvent } from '@/core/models/shared.model';
import { RouteItemComponent } from '../route-item/route-item.component';
import { ROUTES_PER_PAGE_OPTIONS } from '../../config/consts';
import { RouteFormComponent } from '../route-form/route-form.component';
import { RoutesFacadeService } from '../../services/routes-facade.service';

@Component({
  selector: 'app-routes-page',
  standalone: true,
  imports: [
    RouteFormComponent,
    PaginatorModule,
    RouteItemComponent,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
  ],
  providers: [DestroyService, ConfirmationService],
  templateUrl: './routes-page.component.html',
  styleUrl: './routes-page.component.scss',
})
export class RoutesPageComponent implements OnInit {
  @ViewChild('pageTop') pageTop!: ElementRef;

  private destroy$ = inject(DestroyService);

  private stationsFacade = inject(StationsFacadeService);

  private carriagesFacade = inject(CarriagesFacadeService);

  private routesFacade = inject(RoutesFacadeService);

  public formToggle = false;

  public formRoute: TRoute | undefined;

  public routesPerPageOptions = ROUTES_PER_PAGE_OPTIONS;

  public offset: number = 0;

  public routesPerPage: number = this.routesPerPageOptions[0];

  public totalRoutes: number = 0;

  private allRoutes: TRoute[] = [];

  public pageRoutes: TRoute[] = [];

  ngOnInit(): void {
    this.stationsFacade.load();
    this.carriagesFacade.load();
    this.routesFacade.load();
    this.routesFacade.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ routes }) => {
        this.allRoutes = routes;
        this.totalRoutes = routes.length;
        if (this.totalRoutes > 0 && this.offset > this.totalRoutes) {
          this.onPageChange({ first: this.totalRoutes });
        }
        this.updatePageRoutes();
      });
  }

  private updatePageRoutes() {
    this.pageRoutes = this.allRoutes.slice(
      this.offset,
      this.routesPerPage + this.offset,
    );
  }

  public onPageChange(event: PageEvent) {
    this.offset = event.first ?? this.offset;
    this.routesPerPage = event.rows ?? this.routesPerPage;
    this.updatePageRoutes();
  }

  public editRouteClick(route: TRoute) {
    this.formToggle = true;
    this.formRoute = route;
    this.scrollToTop();
  }

  public createRouteClick() {
    this.formToggle = true;
    this.formRoute = undefined;
  }

  public deleteRoute(route: TRoute) {
    if (route.id === this.formRoute?.id) {
      this.formToggle = false;
      this.formRoute = undefined;
    }
  }

  public closeForm() {
    this.formToggle = false;
    this.formRoute = undefined;
  }

  private scrollToTop() {
    if (this.pageTop) {
      this.pageTop.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
