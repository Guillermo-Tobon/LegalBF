import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( 
              private authServ: AuthService,
              private router: Router
              ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      
      return  this.authServ.validaTokenService().pipe(
        tap( isAuth =>{
          if ( !isAuth ) {
            this.router.navigateByUrl('/login');
          }

        })
      )

  }
  
}
