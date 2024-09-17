import { CarriagesService } from '@/features/carriages-management/services/carriages.service';
import { MockCarriagesData } from '@/testing/mocks/carriages';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { carriagesActions } from '../actions';
import { CarriagesEffects } from './carriages.effects';

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
