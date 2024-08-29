import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);

  rideId: string | null = null;

  fromId: string | null = null;

  toId: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.rideId = params.get('rideId');
    });

    this.route.queryParamMap.subscribe((query) => {
      this.fromId = query.get('from');
      this.toId = query.get('to');
    });
  }
}
