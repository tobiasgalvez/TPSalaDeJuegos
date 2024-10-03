import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore'; // Para la fecha y hora

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  loggedUser: string = "";
  errorMessage: string = ""; // Propiedad para el mensaje de error
  showError: boolean = false; // Indicador para mostrar el mensaje de error

  constructor(public auth: Auth, private router: Router, private firestore: Firestore) { }

  login() {
    if (!this.email || !this.password) {
      console.log('Email o contraseña vacíos');
      this.errorMessage = "Email o contraseña vacíos"; // Mensaje de error
        this.showError = true; // Mostrar el mensaje de error
      return;
    }
    console.log("Intentando iniciar sesión...");
    
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((res) => {
        console.log('Inicio de sesión exitoso', res);
        this.showError = false; // Ocultar el mensaje de error

        // Registrar log en Firestore
        this.registrarLogUsuario(res.user.email);

        this.router.navigate(['/']); // Redirigir al home
      })
      .catch((e) => {
        console.log('Error en el inicio de sesión:', e.code, e.message);
        this.errorMessage = "Datos incorrectos"; // Mensaje de error
        this.showError = true; // Mostrar el mensaje de error
      });
  }

  // Método para registrar el log del usuario en Firestore
  async registrarLogUsuario(email: string | null) {
    const logsCollection = collection(this.firestore, 'logs'); // Referencia a la colección 'logs'
    const logDoc = doc(logsCollection); // Crear un nuevo documento

    try {
      await setDoc(logDoc, {
        usuario: email,
        fechaIngreso: Timestamp.now() // Guardar la hora actual
      });
      console.log("Log registrado en Firestore correctamente.");
    } catch (error) {
      console.error("Error al registrar el log en Firestore:", error);
    }
  }

  accesoRapidoLogin(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
