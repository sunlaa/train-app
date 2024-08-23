import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  // Temp solution, gotta get this token from elsewhere
  const token =
    '1d927cf5280638f9591ac88d324b553c38aaebfd87186e22d6eecfefbde36a38f1d55009d83aac898c90859fedcaee2f42507585a1e7ab93173f6ac6df32be6a';
  const request = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(request);
}
