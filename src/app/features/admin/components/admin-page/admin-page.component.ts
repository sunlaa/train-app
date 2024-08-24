import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [MenuModule, SidebarModule, ButtonModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  public mobileSidebarVisible: boolean = false;

  public items!: MenuItem[];

  public routeItems!: MenuItem[];

  public closeMobileSidebar() {
    this.mobileSidebarVisible = false;
  }

  ngOnInit() {
    this.routeItems = [
      {
        label: 'Stations',
        icon: 'pi pi-shop',
        routerLink: '/admin/stations',
        command: () => this.closeMobileSidebar(),
      },
      {
        label: 'Carriages',
        icon: 'pi pi-warehouse',
        routerLink: '/admin/carriages',
        command: () => this.closeMobileSidebar(),
      },
      {
        label: 'Routes',
        icon: 'pi pi-directions',
        routerLink: '/admin/routes',
        command: () => this.closeMobileSidebar(),
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
