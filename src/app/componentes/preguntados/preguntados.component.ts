import { Component, OnInit } from '@angular/core';
import { PreguntadosService } from '../../servicios/preguntados.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss']
})
export class PreguntadosComponent implements OnInit {

  paises: any[] = [];
  paisActual: any;
  opciones: any[] = [];
  puntuacion: number = 0;
  mensajeResultado: string = '';
  esCorrecto: boolean = false;
  preguntasRespondidas: number = 0; // Contador de preguntas
  maxPreguntas: number = 10;
  juegoTerminado: boolean = false; 
  mensajeFinal: string = ''; 
  botonesDeshabilitados: boolean = false; 

  constructor(private preguntadosService: PreguntadosService) {}

  ngOnInit(): void {
    this.preguntadosService.obtenerPaises().subscribe(data => {
      this.paises = data;
      this.nuevaPregunta();
    });
  }

  nuevaPregunta(): void {
    // Resetea el mensaje y el estado de la respuesta
    this.mensajeResultado = '';
    this.esCorrecto = false;
  
    // Si el número de preguntas respondidas alcanza el máximo, se termina el juego
    if (this.preguntasRespondidas >= this.maxPreguntas) {
      this.juegoTerminado = true;
      this.mensajeFinal = `Juego terminado. Tu puntuación final es ${this.puntuacion} de ${this.maxPreguntas}.`;
    } else {
      // Si no, se continúa con la siguiente pregunta
      this.paisActual = this.obtenerPaisesRandom();
      this.opciones = this.obtenerOpciones(this.paisActual);
      this.botonesDeshabilitados = false; // Habilitar botones al generar una nueva pregunta
    }
  }
  

  obtenerPaisesRandom(): any {
    const indiceRandom = Math.floor(Math.random() * this.paises.length);
    return this.paises[indiceRandom];
  }

  obtenerOpciones(paisCorrecto: any): any[] {
    const opciones = new Set([paisCorrecto]);
    while (opciones.size < 4) {
      const paisRandom = this.obtenerPaisesRandom();
      opciones.add(paisRandom);
    }
  
    // Convertimos el Set en un array y lo mezclamos
    return this.mezclarOpciones(Array.from(opciones));
  }
  
  mezclarOpciones(opciones: any[]): any[] {
    
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]]; // Intercambio
    }
    return opciones;
  }


  verificarRespuesta(paisSeleccionado: any): void {
    this.botonesDeshabilitados = true;
    if (paisSeleccionado.cca2 === this.paisActual.cca2) {
      this.puntuacion++;
      this.mensajeResultado = 'Correcto!'; 
      this.esCorrecto = true; 
    } else {
      this.mensajeResultado = 'Incorrecto!'; 
      this.esCorrecto = false; 
    }
  
    // Esperar unos segundos antes de mostrar la siguiente pregunta
    setTimeout(() => {
      this.preguntasRespondidas++; // Incrementa el contador de preguntas
      this.nuevaPregunta();
    }, 2000); // 2 segundos de espera para que el usuario vea el resultado
  }
}
