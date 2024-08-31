import { DestroyService } from '@/core/services/destroy/destroy.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { takeUntil } from 'rxjs';
import { PageEvent } from '@/core/models/shared.model';
import { TCarriage } from '@/core/models/carriages.model';
import { CarriagesFacadeService } from '../../services/carriages-facade.service';
import { CarriageItemComponent } from '../carriage-item/carriage-item.component';
import { CarriageFormComponent } from '../carriage-form/carriage-form.component';
import { CARRIAGES_PER_PAGE_OPTIONS } from '../../config/consts';

@Component({
  selector: 'app-carriages-page',
  standalone: true,
  imports: [
    PaginatorModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    CarriageItemComponent,
    CarriageFormComponent,
  ],
  providers: [DestroyService, ConfirmationService],
  templateUrl: './carriages-page.component.html',
  styleUrl: './carriages-page.component.scss',
})
export class CarriagesPageComponent implements OnInit {
  @ViewChild('pageTop') pageTop!: ElementRef;

  private destroy$ = inject(DestroyService);

  private carriagesFacade = inject(CarriagesFacadeService);

  public formToggle = false;

  public formCarriage: TCarriage | undefined;

  public carriagesPerPageOptions = CARRIAGES_PER_PAGE_OPTIONS;

  public offset: number = 0;

  public carriagesPerPage: number = this.carriagesPerPageOptions[0];

  public totalCarriages: number = 0;

  private allCarriages: TCarriage[] = [];

  public pageCarriages: TCarriage[] = [];

  ngOnInit(): void {
    this.listenCarriagesState();
  }

  private listenCarriagesState() {
    this.carriagesFacade.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ carriages }) => {
        this.allCarriages = carriages;
        this.totalCarriages = carriages.length;
        if (this.totalCarriages > 0 && this.offset > this.totalCarriages) {
          this.onPageChange({ first: this.totalCarriages });
        }
        this.updatePageCarriages();
      });
  }

  private updatePageCarriages() {
    this.pageCarriages = this.allCarriages.slice(
      this.offset,
      this.carriagesPerPage + this.offset,
    );
  }

  public onPageChange(event: PageEvent) {
    this.offset = event.first ?? this.offset;
    this.carriagesPerPage = event.rows ?? this.carriagesPerPage;
    this.updatePageCarriages();
  }

  public editCarriageClick(carriage: TCarriage) {
    this.formToggle = true;
    this.formCarriage = carriage;
    this.scrollToTop();
  }

  public createCarriageClick() {
    this.formToggle = true;
    this.formCarriage = undefined;
  }

  public deleteCarriage(carriage: TCarriage) {
    if (carriage.code === this.formCarriage?.code) {
      this.formToggle = false;
      this.formCarriage = undefined;
    }
  }

  public closeForm() {
    this.formToggle = false;
    this.formCarriage = undefined;
  }

  private scrollToTop() {
    if (this.pageTop) {
      this.pageTop.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
