import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public items: MenuItem[] | undefined;

  // TODO: Add actual data from the store
  public email = 'email@gmail.com';

  public role: 'guest' | 'user' | 'admin' = 'admin';

  ngOnInit() {
    this.initItems();
  }

  public signOut() {
    // console.log('logout');
  }

  private initItems() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/',
      },
    ];
    if (this.role === 'guest') {
      return;
    }
    this.items = [
      ...this.items,
      {
        label: 'Profile',
        icon: 'pi pi-user',
        route: '/profile',
      },
      {
        label: 'My Orders',
        icon: 'pi pi-ticket',
        route: '/orders',
      },
    ];
    if (this.role === 'admin') {
      this.items = [
        ...this.items,
        {
          label: 'Admin',
          icon: 'pi pi-shield',
          items: [
            {
              label: 'Stations',
              icon: 'pi pi-shop',
              route: '/admin/stations',
            },
            {
              label: 'Carriages',
              icon: 'pi pi-warehouse',
              route: '/admin/carriages',
            },
            {
              label: 'Routes',
              icon: 'pi pi-directions',
              route: '/admin/routes',
            },
          ],
        },
      ];
    }
  }
}
