import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { MockStationsFacade } from '@/testing/mocks';
import { StationsFacadeService } from '../../services/stations-facade.service';

import { StationsPageComponent } from './stations-page.component';

describe('StationsPageComponent', () => {
  let component: StationsPageComponent;
  let fixture: ComponentFixture<StationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationsPageComponent],
      providers: [
        MessageService,
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
