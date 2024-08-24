import { RouteDetails } from '@/core/models/search.model';
import { Component, Input } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [TimelineModule, DurationPipe],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.scss',
})
export class ModalContentComponent {
  @Input({ required: true }) details!: RouteDetails;

  public isString = (val: unknown) => typeof val === 'string';
}
