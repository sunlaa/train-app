import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function cityApiInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  if (req.url.startsWith('https://api.api-ninjas.com')) {
    const newReq = req.clone({
      headers: req.headers.set(
        'X-Api-Key',
        'ln8jhzuvHXfI10xojx5oQg==r0WkHuJ8YP34T7Hn',
      ),
    });

    return next(newReq);
  }

  return next(req);
}
