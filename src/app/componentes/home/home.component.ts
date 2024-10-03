import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User | null = null;  // Guardar el usuario logueado

  constructor(private router: Router, private auth: Auth) { }

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user; // Actualizar la información del usuario
    });
  }

  IrAOtraRuta(path: string) {
    this.router.navigate([path]);
  }

  CerrarSesion() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']); // Redirigir al home al cerrar sesión
    });
  }
}