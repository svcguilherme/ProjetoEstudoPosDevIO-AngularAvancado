import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAutenticado()) return true;

  // Guarda a URL tentada para redirecionar após o login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
