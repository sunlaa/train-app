import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function cityApiInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  if (req.url.startsWith('https://api.api-ninjas.com')) {
    const newReq = req.clone({
      headers: req.headers.set(
        'X-Api-Key',
        '9I9XZsmicuEvV467OPol4g==FpgcMldQvHMBq7DF',
      ),
    });

    return next(newReq);
  }

  return next(req);
}
