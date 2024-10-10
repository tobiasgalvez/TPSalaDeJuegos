import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth'; // Asegúrate de importar Auth

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.currentUser; // Obtiene el usuario actual

    if (user) {
      return true; // Permitir el acceso si el usuario está autenticado
    } else {
      this.router.navigate(['/login']); // Redirigir al usuario a la página de login
      return false; // Denegar el acceso
    }
  }
}
