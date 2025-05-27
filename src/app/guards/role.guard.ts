import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.userService.getUserRole();
    const allowedRoles = route.data['roles'] as string[]; // roles allowed for this route

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect unauthorized user to "unauthorized" page or home
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
