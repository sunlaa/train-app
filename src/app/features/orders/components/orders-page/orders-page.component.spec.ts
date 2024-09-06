import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import {
  MockCarriagesFacade,
  MockOrdersFacade,
  MockProfileFacade,
  MockStationsFacade,
  MockUsersService,
} from '@/testing/mocks';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { UsersService } from '../../services/users/users.service';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';

import { OrdersPageComponent } from './orders-page.component';

describe('OrdersPageComponent', () => {
  let component: OrdersPageComponent;
  let fixture: ComponentFixture<OrdersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPageComponent],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: OrdersFacadeService, useClass: MockOrdersFacade },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        { provide: ProfileFacadeService, useClass: MockProfileFacade },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
