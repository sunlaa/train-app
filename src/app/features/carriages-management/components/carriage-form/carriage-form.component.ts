import { TCarriage } from '@/core/models/carriages.model';
import { NotificationService } from '@/shared/services/notification.service';
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
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { map, startWith, takeUntil } from 'rxjs';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { CommonModule } from '@angular/common';
import { CarriagesFacadeService } from '../../services/carriages-facade.service';
import { CarriageComponent } from '../../../../shared/components/carriage/carriage.component';

@Component({
  selector: 'app-carriage-form',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    CarriageComponent,
    CommonModule,
  ],
  providers: [DestroyService],
  templateUrl: './carriage-form.component.html',
  styleUrl: './carriage-form.component.scss',
})
export class CarriageFormComponent implements OnChanges, OnInit {
  @Input() collapsed: boolean | undefined;

  @Input() carriage: TCarriage | undefined;

  @Output() closeForm = new EventEmitter<void>();

  private destroy$ = inject(DestroyService);

  private notificationService = inject(NotificationService);

  private carriagesFacade = inject(CarriagesFacadeService);

  private fb = inject(FormBuilder);

  public carriageForm = this.fb.group({
    name: this.fb.control<string | null>(null, Validators.required),
    rows: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.max(22),
      Validators.min(1),
    ]),
    leftSeats: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.max(4),
      Validators.min(1),
    ]),
    rightSeats: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.max(4),
      Validators.min(1),
    ]),
  });

  public buttonIsDisabled$ = this.carriageForm.valueChanges.pipe(
    startWith(null),
    takeUntil(this.destroy$),
    map(() => this.carriageForm.invalid),
  );

  ngOnInit(): void {
    this.initCarriage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { carriage } = changes;
    if (carriage && !carriage.isFirstChange()) {
      this.carriageForm.reset();
      this.initCarriage();
    }
  }

  private initCarriage() {
    if (this.carriage) {
      const { name, rows, leftSeats, rightSeats } = this.carriage;
      this.carriageForm.controls.name.setValue(name);
      this.rows.setValue(rows);
      this.leftSeats.setValue(leftSeats);
      this.rightSeats.setValue(rightSeats);
    }
  }

  get rows() {
    return this.carriageForm.controls.rows;
  }

  get leftSeats() {
    return this.carriageForm.controls.leftSeats;
  }

  get rightSeats() {
    return this.carriageForm.controls.rightSeats;
  }

  public closeFormClick() {
    this.carriageForm.reset();
    this.closeForm.emit();
  }

  public onSubmit() {
    if (this.carriageForm.invalid) {
      return;
    }
    const { controls } = this.carriageForm;
    const newCarriage: Omit<TCarriage, 'code'> = {
      name: controls.name.value!,
      rows: controls.rows.value!,
      leftSeats: controls.leftSeats.value!,
      rightSeats: controls.rightSeats.value!,
    };
    const request$ = this.carriage
      ? this.carriagesFacade.update({
          ...newCarriage,
          code: this.carriage.code,
        })
      : this.carriagesFacade.create(newCarriage);

    request$.subscribe({
      next: (state) => {
        if (state.status === 'success') {
          this.notificationService.messageSuccess(
            this.carriage
              ? 'Carriage successfully saved'
              : 'Carriage successfully created',
          );
          this.closeForm.emit();
        } else {
          this.notificationService.messageError(state.error?.message);
        }
      },
    });
  }
}
