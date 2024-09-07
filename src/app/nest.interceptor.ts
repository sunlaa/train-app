import { HttpInterceptorFn } from '@angular/common/http';

export const nestInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
