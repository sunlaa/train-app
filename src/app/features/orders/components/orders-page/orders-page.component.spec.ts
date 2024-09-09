import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import {
  MockCarriagesFacade,
  MockCarriagesState,
  MockOrdersData,
  MockOrdersFacade,
  MockOrdersState,
  MockProfileData,
  MockStationsFacade,
  MockStationsState,
  MockUsersService,
} from '@/testing/mocks';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ProfileModel } from '@/core/models/profile.model';
import { UsersService } from '../../services/users/users.service';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';

import { OrdersPageComponent } from './orders-page.component';

class MockProfileFacade {
  private profileSubject = new Subject<ProfileModel>();

  profile$ = this.profileSubject.asObservable();

  setProfile(profile: ProfileModel) {
    this.profileSubject.next(profile);
  }
}

describe('OrdersPageComponent', () => {
  let component: OrdersPageComponent;
  let fixture: ComponentFixture<OrdersPageComponent>;
  let ordersFacade: MockOrdersFacade;
  let stationsFacade: MockStationsFacade;
  let carriagesFacade: MockCarriagesFacade;
  let profileFacade: MockProfileFacade;

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

    ordersFacade = TestBed.inject(
      OrdersFacadeService,
    ) as unknown as MockOrdersFacade;
    stationsFacade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
    carriagesFacade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
    profileFacade = TestBed.inject(
      ProfileFacadeService,
    ) as unknown as MockProfileFacade;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initOrders on initialization', () => {
    // @ts-expect-error test
    const initOrdersSpy = jest.spyOn(component, 'initOrders');
    component.ngOnInit();
    expect(initOrdersSpy).toHaveBeenCalled();
  });

  it('should set loading state to false after orders are loaded', () => {
    expect(component.isLoading).toBe(true);
    // @ts-expect-error test
    component.initOrders();
    // Mock the facade data streams
    ordersFacade.setState(MockOrdersState.successState);
    stationsFacade.setState(MockStationsState.successState);
    carriagesFacade.setState(MockCarriagesState.successState);
    profileFacade.setProfile(MockProfileData.users['user']);

    expect(component.isLoading).toBe(false);
  });

  it('should display the paginator and list when orders are available', () => {
    ordersFacade.setState(MockOrdersState.successState);
    stationsFacade.setState(MockStationsState.successState);
    carriagesFacade.setState(MockCarriagesState.successState);
    profileFacade.setProfile(MockProfileData.users['user']);
    component.totalOrders = 10;
    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.css('p-paginator'));
    const orderList = fixture.debugElement.query(By.css('.list'));

    expect(paginator).toBeTruthy();
    expect(orderList).toBeTruthy();
  });

  it('should display empty state when no orders are available', () => {
    ordersFacade.setState(MockOrdersState.successState);
    stationsFacade.setState(MockStationsState.successState);
    carriagesFacade.setState(MockCarriagesState.successState);
    profileFacade.setProfile(MockProfileData.users['user']);
    component.totalOrders = 0;
    fixture.detectChanges();

    const emptyMessage = fixture.debugElement.query(By.css('.empty-message'));
    expect(emptyMessage.nativeElement.textContent).toContain('So empty...');
  });

  it('should update pageOrders when onPageChange is called', () => {
    // @ts-expect-error test
    component.allOrders = Array(20)
      .fill({})
      .map((_, i) => ({
        ...MockOrdersData.orders[0],
        orderId: i + 1,
        status: 'active',
      }));
    // @ts-expect-error test
    component.totalOrders = component.allOrders.length;

    component.onPageChange({ first: 10, rows: 5 });
    fixture.detectChanges();

    expect(component.offset).toBe(10);
    expect(component.pageOrders.length).toBe(5);
  });

  it('should switch to admin mode if the user is a manager', () => {
    ordersFacade.setState(MockOrdersState.successState);
    stationsFacade.setState(MockStationsState.successState);
    carriagesFacade.setState(MockCarriagesState.successState);
    profileFacade.setProfile(MockProfileData.users['admin']);

    expect(component.isAdmin).toBe(true);
  });

  it('should call updatePageRoutes when onPageChange is triggered', () => {
    // @ts-expect-error test
    const updatePageRoutesSpy = jest.spyOn(component, 'updatePageRoutes');
    component.onPageChange({ first: 5, rows: 5 });

    expect(updatePageRoutesSpy).toHaveBeenCalled();
  });
});
