import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../servicios/chat.service';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth'; // Importa el servicio de autenticación
import { Mensaje } from '../../models/mensaje.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  mensajes$: Observable<Mensaje[]> | undefined; //Observable
  mensaje: string = '';
  usuarioLogueado: boolean = true; 
  userId: string = '';
  userEmail: string = ''; // Almacenar el correo electrónico del usuario

  constructor(private chatService: ChatService, private auth: Auth) {}

  ngOnInit(): void {
    // Obtener el correo electrónico del usuario logueado
    const user = this.auth.currentUser;
    if (user) {
      this.userId = user.uid;
      this.userEmail = user.email || ''; // Guardar el correo electrónico
    }

    this.mensajes$ = this.chatService.obtenerMensajes(); // Asigna el observable a mensajes$
    console.log('usuario:' + this.userId + ' mail:' + this.userEmail);
  }

  enviarMensaje() {
    if (this.mensaje.trim() && this.userEmail) {
      this.chatService.enviarMensaje({
        text: this.mensaje,
        userId: this.userId,
        email: this.userEmail, // Incluir el correo electrónico
        timestamp: new Date().getTime() 
      });
      this.mensaje = ''; // Limpiar el campo de entrada
    }
  }
}
