import { Component, inject, OnInit } from '@angular/core';
import { RoutesFacadeService } from '../../services/routes-facade.service';

@Component({
  selector: 'app-routes-page',
  standalone: true,
  imports: [],
  templateUrl: './routes-page.component.html',
  styleUrl: './routes-page.component.scss',
})
export class RoutesPageComponent implements OnInit {
  private routesFacade = inject(RoutesFacadeService);

  ngOnInit(): void {
    this.routesFacade.load();
  }
}
