import { Component, OnInit } from '@angular/core';
import { PasapalabraService } from '../../servicios/pasapalabra.service';
import { Pregunta } from '../../models/pregunta.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';  // Importa SweetAlert2
import { Auth, User } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'; // Importa Firestore para guardar resultados

@Component({
  selector: 'app-pasapalabra',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pasapalabra.component.html',
  styleUrl: './pasapalabra.component.scss'
})
export class PasapalabraComponent implements OnInit {

  preguntas: Pregunta[] = [];
  respuesta: string = '';
  letraActual: number = 0;
  puntaje: number = 0;
  tiempoRestante: number = 10; // 90 segundos para el juego
  intervalo: any;
  mensajeError: string = ''; // Propiedad para el mensaje de advertencia
  respuestasPendientes: any[] = []; // Almacenar las respuestas incorrectas o sin respuesta
  user: User | null = null; // Para guardar el usuario logueado

  constructor(private pasapalabraService: PasapalabraService, private auth: Auth, private firestore: Firestore) {}

  ngOnInit(): void {
    // Obtener el usuario logueado
    this.auth.onAuthStateChanged((user) => {
      this.user = user; 
    });
    this.preguntas = this.pasapalabraService.obtenerPreguntas();
    this.iniciarTemporizador();
  }

  iniciarTemporizador(): void {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.intervalo);
        this.finalizarJuego();
      }
    }, 1000);
  }

  finalizarJuego(): void {
    // Construir mensaje de preguntas pendientes
    let mensajePendientes = '';

    // Filtrar las preguntas que quedaron sin responder o incorrectas
    const preguntasPendientes = this.preguntas.filter(p => p.estado !== 'correcto');

    if (preguntasPendientes.length > 0) {
      mensajePendientes = 'Letras pendientes:<br>';
      preguntasPendientes.forEach(p => {
        mensajePendientes += `${p.letra.toUpperCase()} - ${p.palabra}<br>`;
      });
    } else {
      mensajePendientes = 'No quedaron palabras pendientes.';
    }

    // Mostrar el SweetAlert con el puntaje y las preguntas pendientes
    Swal.fire({
      title: '¡Juego terminado!',
      html: `
        <p>puntaje obtenidos: ${this.puntaje}</p>
        <p>${mensajePendientes}</p>
      `,
      icon: 'success',
      confirmButtonText: 'Salir',
      customClass: {
        popup: 'popup-clase-personalizada'
      }
    }).then(() => {
    this.guardarResultado(); // Guardar el resultado en Firestore al finalizar el juego
  });
  }

  verificar(): void {
    const pregunta = this.preguntas[this.letraActual];

    // Evitar verificar si no hay una respuesta ingresada
    if (!this.respuesta || this.respuesta.trim() === '') {
      this.mensajeError = 'Debes ingresar al menos una letra';
      return;
    }

    // Limpia cualquier mensaje de error
    this.mensajeError = '';

    // Verificar si la respuesta es correcta o incorrecta
    if (this.pasapalabraService.verificarRespuesta(pregunta.letra, this.respuesta)) {
      pregunta.estado = 'correcto'; // Marca como correcto
      this.puntaje++;
    } else {
      pregunta.estado = 'incorrecto'; // Marca como incorrecto
    }

    // Limpiar el campo de respuesta
    this.respuesta = '';

    // Saltar a la siguiente letra pendiente
    this.saltarALetraPendiente();
  }

  saltarALetraPendiente(): void {
    let nuevaLetra = this.letraActual;

    // Contar cuántas preguntas quedan pendientes
    let preguntasPendientes = this.preguntas.filter(p => p.estado === 'pendiente' || p.estado === 'sin_respuesta');

    // Si no hay más preguntas pendientes, se finaliza el juego
    if (preguntasPendientes.length === 0) {
      this.finalizarJuego();
      return;
    }

    // Recorre las preguntas y salta las que están en estado 'correcto' o 'incorrecto'
    do {
      nuevaLetra = (nuevaLetra + 1) % this.preguntas.length;
    } while (
      (this.preguntas[nuevaLetra].estado === 'correcto' || 
      this.preguntas[nuevaLetra].estado === 'incorrecto') && 
      nuevaLetra !== this.letraActual // Evita ciclo infinito si ya no hay preguntas pendientes
    );

    this.letraActual = nuevaLetra;
  }

  pasarPregunta(): void {
    const pregunta = this.preguntas[this.letraActual];
    pregunta.estado = 'sin_respuesta';
    this.respuesta = '';
    this.letraActual = (this.letraActual + 1) % this.preguntas.length;
  }


  async guardarResultado() {
    if (this.user) {
      const resultadosRef = collection(this.firestore, 'resultados_pasapalabra');
      await addDoc(resultadosRef, {
        usuario: this.user.email,
        fecha: new Date(),
        puntaje: this.puntaje,
      });
    }
  }

  reiniciarJuego(): void {
    // Restablece el estado de todas las preguntas
    this.preguntas.forEach(pregunta => {
      pregunta.estado = 'pendiente';
    });

    // Restablece el puntaje y la letra actual
    this.puntaje = 0;
    this.letraActual = 0;

    // Reinicia el temporizador
    clearInterval(this.intervalo);  // Limpia el temporizador actual
    this.tiempoRestante = 90;       // Reinicia el tiempo a 90 segundos
    this.iniciarTemporizador();     // Vuelve a iniciar el temporizador
  }
}
