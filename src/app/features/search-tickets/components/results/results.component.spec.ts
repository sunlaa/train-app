import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockSearchFacade } from '@/testing/mocks';
import { SearchFacadeService } from '../../services/search-facade/search-facade.service';

import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
      providers: [
        {
          provide: SearchFacadeService,
          useClass: MockSearchFacade,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
