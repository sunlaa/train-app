import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { takeUntil } from 'rxjs';
import { Role } from '@/core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, CommonModule, ButtonModule, ChipModule],
  providers: [DestroyService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private profileFacade = inject(ProfileFacadeService);

  public items: MenuItem[] | undefined;

  public role: Role = 'guest';

  public name = '';

  public profile$ = this.profileFacade.profile$;

  ngOnInit() {
    this.initItems();
    this.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ name, email, role }) => {
        this.role = role;
        if (name) {
          this.name = name;
        } else {
          this.name = email;
        }
        this.initItems();
      });
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
    if (this.role === 'manager') {
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
