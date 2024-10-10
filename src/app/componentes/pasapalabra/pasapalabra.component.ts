import { Component, OnInit } from '@angular/core';
import { PasapalabraService } from '../../servicios/pasapalabra.service';
import { Pregunta } from '../../models/pregunta.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  puntos: number = 0;
  tiempoRestante: number = 90; // 90 segundos para el juego
  intervalo: any;
  mensajeError: string = ''; // Propiedad para el mensaje de advertencia

  constructor(private pasapalabraService: PasapalabraService) {}

  ngOnInit(): void {
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
    // Lógica para finalizar el juego y mostrar puntos
    alert(`El juego ha terminado. Puntos obtenidos: ${this.puntos}`);
  }

  // verificar(): void {
  //   const pregunta = this.preguntas[this.letraActual];
  
  //   if (!this.respuesta) {
  //     this.mensaje = 'Por favor, ingrese al menos 1 caracter.'; // Mensaje de advertencia
  //     return; // No continuar si la respuesta está vacía
  //   } else if (this.pasapalabraService.verificarRespuesta(pregunta.letra, this.respuesta)) {
  //     pregunta.estado = 'correcto';
  //     this.puntos++; // Incrementa los puntos por respuesta correcta
  //     this.mensaje = ''; // Limpiar el mensaje si hay respuesta
  //   } else {
  //     pregunta.estado = 'incorrecto'; // Marca la pregunta como incorrecta
  //     this.mensaje = ''; // Limpiar el mensaje si hay respuesta
  //   }
  
  //   this.respuesta = '';
  //   this.letraActual = (this.letraActual + 1) % this.preguntas.length;
  
    
  // }
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
      this.puntos++;
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


  reiniciarJuego(): void {
    // Restablece el estado de todas las preguntas
    this.preguntas.forEach(pregunta => {
      pregunta.estado = 'pendiente';
    });
  
    // Restablece el puntaje y la letra actual
    this.puntos = 0;
    this.letraActual = 0;
  
    // Reinicia el temporizador
    clearInterval(this.intervalo);  // Limpia el temporizador actual
    this.tiempoRestante = 90;       // Reinicia el tiempo a 90 segundos
    this.iniciarTemporizador();     // Vuelve a iniciar el temporizador
  }



}
