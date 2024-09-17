import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { RoutesService } from '@/features/routes-management/services/routes.service';
import { MockRoutesData } from '@/testing/mocks/routes';
import { routesActions } from '../actions';
import { RoutesEffects } from './routes.effects';

describe('RoutesEffects', () => {
  let actions$: Actions<Action<string>>;
  let effects: RoutesEffects;
  let routesService: jest.Mocked<RoutesService>;

  const mockRoutes = MockRoutesData.routes;

  beforeEach(() => {
    const routesServiceMock = {
      getRoutes: jest.fn(),
      createRoute: jest.fn(),
      updateRoute: jest.fn(),
      deleteRoute: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RoutesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: RoutesService, useValue: routesServiceMock },
      ],
    });

    effects = TestBed.inject(RoutesEffects);
    routesService = TestBed.inject(RoutesService) as jest.Mocked<RoutesService>;
  });

  it('should dispatch loadSuccess on successful routes load', (done) => {
    routesService.getRoutes.mockReturnValue(of(mockRoutes));
    actions$ = of(routesActions.load());

    effects.loadRoutes$.subscribe((result) => {
      expect(result).toEqual(routesActions.loadSuccess({ routes: mockRoutes }));
      done();
    });
  });

  it('should dispatch loadError on failed routes load', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    routesService.getRoutes.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(routesActions.load());

    effects.loadRoutes$.subscribe((result) => {
      expect(result).toEqual(routesActions.loadError({ error: errorResponse }));
      done();
    });
  });

  it('should dispatch createSuccess on successful route creation', (done) => {
    const route = mockRoutes[0];
    routesService.createRoute.mockReturnValue(of(route));
    actions$ = of(routesActions.create({ route }));

    effects.createRoute$.subscribe((result) => {
      expect(result).toEqual(routesActions.createSuccess({ route }));
      done();
    });
  });

  it('should dispatch createError on failed route creation', (done) => {
    const route = mockRoutes[0];
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    routesService.createRoute.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(
      routesActions.create({
        route,
      }),
    );

    effects.createRoute$.subscribe((result) => {
      expect(result).toEqual(
        routesActions.createError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch updateSuccess on successful route update', (done) => {
    const route = mockRoutes[0];
    routesService.updateRoute.mockReturnValue(of(route));
    actions$ = of(
      routesActions.update({
        route,
      }),
    );

    effects.updateRoute$.subscribe((result) => {
      expect(result).toEqual(routesActions.updateSuccess({ route }));
      done();
    });
  });

  it('should dispatch updateError on failed route update', (done) => {
    const route = mockRoutes[0];
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    routesService.updateRoute.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(
      routesActions.update({
        route,
      }),
    );

    effects.updateRoute$.subscribe((result) => {
      expect(result).toEqual(
        routesActions.updateError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch deleteSuccess on successful route deletion', (done) => {
    routesService.deleteRoute.mockReturnValue(of(undefined));
    actions$ = of(routesActions.delete({ id: 1 }));

    effects.deleteRoute$.subscribe((result) => {
      expect(result).toEqual(routesActions.deleteSuccess({ id: 1 }));
      done();
    });
  });

  it('should dispatch deleteError on failed route deletion', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Delete Error' });
    routesService.deleteRoute.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(routesActions.delete({ id: 1 }));

    effects.deleteRoute$.subscribe((result) => {
      expect(result).toEqual(
        routesActions.deleteError({ error: errorResponse }),
      );
      done();
    });
  });
});
