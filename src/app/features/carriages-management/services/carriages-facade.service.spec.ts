import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { carriagesFeature } from '@/redux/reducers';
import {
  MockCarriagesData,
  MockCarriagesState,
} from '@/testing/mocks/carriages';
import { carriagesActions } from '@/redux/actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { CarriagesEffects } from '@/redux/effects';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CarriagesService } from './carriages.service';
import { CarriagesFacadeService } from './carriages-facade.service';

jest.mock('@angular/core/rxjs-interop', () => ({
  toSignal: jest.fn(),
}));

describe('CarriagesFacadeService', () => {
  let service: CarriagesFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockCarriagesState = MockCarriagesState.successState;

  const mockCarriageMap = MockCarriagesData.carriageMap;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideMockStore({}) });
    service = TestBed.inject(CarriagesFacadeService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(
      carriagesFeature.selectCarriagesState,
      mockCarriagesState,
    );
    store.overrideSelector(
      carriagesFeature.selectCarriages,
      mockCarriagesState.carriages,
    );
    store.overrideSelector(carriagesFeature.selectCarriageMap, mockCarriageMap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch load action on load()', () => {
    service.load();
    expect(dispatchSpy).toHaveBeenCalledWith(carriagesActions.load());
  });

  it('should dispatch create action on create()', () => {
    const carriage = MockCarriagesData.carriages[0];

    service.create(carriage).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      carriagesActions.create({ carriage }),
    );
  });

  it('should dispatch update action on update()', () => {
    const carriage = MockCarriagesData.carriages[0];

    service.update(carriage).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      carriagesActions.update({ carriage }),
    );
  });

  it('should dispatch delete action on delete()', () => {
    const carriageCode = 'A1';

    service.delete(carriageCode).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      carriagesActions.delete({ code: carriageCode }),
    );
  });

  it('should update stationMap signal on updateMap()', () => {
    (toSignal as jest.Mock).mockReturnValue(() => mockCarriageMap);

    service.updateMap();

    expect(service.carriageMap()).toEqual(mockCarriageMap);
  });

  it('should return state$ observable from store', () => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockCarriagesState);
    });
  });

  it('should return carriages$ observable from store', () => {
    service.carriages$.subscribe((carriages) => {
      expect(carriages).toEqual(mockCarriagesState.carriages);
    });
  });

  it('should return carriageMap$ observable from store', () => {
    service.carriageMap$.subscribe((carriageMap) => {
      expect(carriageMap).toEqual(mockCarriageMap);
    });
  });
});

describe('CarriagesEffects', () => {
  let actions$: Actions<Action<string>>;
  let effects: CarriagesEffects;
  let carriagesService: jest.Mocked<CarriagesService>;

  const mockCarriages = MockCarriagesData.carriages;

  beforeEach(() => {
    const carriagesServiceMock = {
      getCarriages: jest.fn(),
      createCarriage: jest.fn(),
      updateCarriage: jest.fn(),
      deleteCarriage: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CarriagesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: CarriagesService, useValue: carriagesServiceMock },
      ],
    });

    effects = TestBed.inject(CarriagesEffects);
    carriagesService = TestBed.inject(
      CarriagesService,
    ) as jest.Mocked<CarriagesService>;
  });

  it('should dispatch loadSuccess on successful carriages load', (done) => {
    carriagesService.getCarriages.mockReturnValue(of(mockCarriages));
    actions$ = of(carriagesActions.load());

    effects.loadCarriages$.subscribe((result) => {
      expect(result).toEqual(
        carriagesActions.loadSuccess({ carriages: mockCarriages }),
      );
      done();
    });
  });

  it('should dispatch loadError on failed carriages load', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    carriagesService.getCarriages.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(carriagesActions.load());

    effects.loadCarriages$.subscribe((result) => {
      expect(result).toEqual(
        carriagesActions.loadError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch createSuccess on successful carriage creation', (done) => {
    const carriage = mockCarriages[0];
    carriagesService.createCarriage.mockReturnValue(of(carriage));
    actions$ = of(
      carriagesActions.create({
        carriage,
      }),
    );

    effects.createCarriage$.subscribe((result) => {
      expect(result).toEqual(carriagesActions.createSuccess({ carriage }));
      done();
    });
  });

  it('should dispatch createError on failed carriage creation', (done) => {
    const carriage = mockCarriages[0];
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    carriagesService.createCarriage.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(
      carriagesActions.create({
        carriage,
      }),
    );

    effects.createCarriage$.subscribe((result) => {
      expect(result).toEqual(
        carriagesActions.createError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch updateSuccess on successful carriage update', (done) => {
    const carriage = mockCarriages[0];
    carriagesService.updateCarriage.mockReturnValue(of(carriage));
    actions$ = of(
      carriagesActions.update({
        carriage,
      }),
    );

    effects.updateCarriage$.subscribe((result) => {
      expect(result).toEqual(carriagesActions.updateSuccess({ carriage }));
      done();
    });
  });

  it('should dispatch updateError on failed carriage update', (done) => {
    const carriage = mockCarriages[0];
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    carriagesService.updateCarriage.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(
      carriagesActions.update({
        carriage,
      }),
    );

    effects.updateCarriage$.subscribe((result) => {
      expect(result).toEqual(
        carriagesActions.updateError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch deleteSuccess on successful station deletion', (done) => {
    carriagesService.deleteCarriage.mockReturnValue(of(undefined));
    actions$ = of(carriagesActions.delete({ code: 'A' }));

    effects.deleteCarriage$.subscribe((result) => {
      expect(result).toEqual(carriagesActions.deleteSuccess({ code: 'A' }));
      done();
    });
  });

  it('should dispatch deleteError on failed station deletion', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Delete Error' });
    carriagesService.deleteCarriage.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(carriagesActions.delete({ code: 'A' }));

    effects.deleteCarriage$.subscribe((result) => {
      expect(result).toEqual(
        carriagesActions.deleteError({ error: errorResponse }),
      );
      done();
    });
  });
});
