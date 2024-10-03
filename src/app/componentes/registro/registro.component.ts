import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  nuevoMail: string = "";
  nuevoPassword: string = "";

  loggedUser: string = "";
  flagError: boolean = false;
  msjError: string = "";

  constructor(public auth: Auth, private router: Router) {
  }

  Register() {
    createUserWithEmailAndPassword(this.auth, this.nuevoMail, this.nuevoPassword).then((res) => {
      if (res.user.email !== null) this.loggedUser = res.user.email;

      this.flagError = false;
      this.router.navigate(['/']); // Redirigir al home

    }).catch((e) => {
      this.flagError = true;

      switch (e.code) {
        case "auth/invalid-email":
          this.msjError = "Email invalido";
          break;
        case "auth/email-already-in-use":
          this.msjError = "Email ya en uso. Intente nuevamente con un mail distinto";
          break;
        case "auth/weak-password": 
          this.msjError = "La contraseña posee pocos caracteres";
          break;
        default:
          this.msjError = e.code
          break;
      }
    });
  }

}
