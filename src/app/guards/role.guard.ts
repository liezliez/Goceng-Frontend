import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.userService.getUserRole();
    const allowedRoles = route.data['roles'] as string[];

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect unauthorized user to "unauthorized" page or home
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
