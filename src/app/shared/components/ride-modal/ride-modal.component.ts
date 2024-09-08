import { StopInfo } from '@/core/models/search.model';
import { Component, Input } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-ride-modal',
  standalone: true,
  imports: [TimelineModule, DurationPipe],
  templateUrl: './ride-modal.component.html',
  styleUrl: './ride-modal.component.scss',
})
export class RideModalComponent {
  @Input({ required: true }) details!: StopInfo[];

  public isString = (val: unknown) => typeof val === 'string';
}
