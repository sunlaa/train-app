import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteItemComponent } from './route-item.component';

describe('RouteItemComponent', () => {
  let component: RouteItemComponent;
  let fixture: ComponentFixture<RouteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
