import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [MenuModule, RouterLink],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  public items!: MenuItem[];

  public routeItems!: MenuItem[];

  ngOnInit() {
    this.routeItems = [
      {
        label: 'Stations',
        icon: 'pi pi-shop',
        routerLink: '/admin/stations',
      },
      {
        label: 'Carriages',
        icon: 'pi pi-warehouse',
        routerLink: '/admin/carriages',
      },
      {
        label: 'Routes',
        icon: 'pi pi-directions',
        routerLink: '/admin/routes',
      },
    ];
    this.items = [
      {
        label: 'Admin',
        items: this.routeItems,
      },
    ];
  }
}
