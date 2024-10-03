import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {

  mazo: number[] = [];
  cartaActual: number = 0;
  puntaje: number = 0;
  finDelJuego: boolean = false;
  mensajeResultado: string = ''; // Variable para mostrar el mensaje
  esCorrecto: boolean = true; // Variable para controlar el color del mensaje

  constructor() {}

  ngOnInit(): void {
    this.inicializarMazo();
    this.obtenerCarta();
  }

  inicializarMazo() {
    // Inicializa el mazo con valores del 1 al 13 (A-K)
    this.mazo = Array.from({ length: 13 }, (_, i) => i + 1);
    this.mazo = this.shuffle(this.mazo);
  }

  obtenerCarta() {
    if (this.mazo.length > 0) {
      this.cartaActual = this.mazo.pop()!;
    } else {
      this.finDelJuego = true;
    }
  }

  adivinar(opcion: string) {
    if (this.mazo.length > 0) {
      const cartaSiguiente = this.mazo.pop()!;
  
      // Verificamos si la respuesta es correcta y actualizamos el mensaje y la clase
      if ((opcion === 'mayor' && cartaSiguiente > this.cartaActual) ||
          (opcion === 'menor' && cartaSiguiente < this.cartaActual)) {
        this.puntaje++;
        this.mensajeResultado = `Correcto, la carta es ${cartaSiguiente > this.cartaActual ? 'mayor' : 'menor'} (${cartaSiguiente})`;
        this.esCorrecto = true; // Mensaje en verde
      } else {
        this.mensajeResultado = `Incorrecto, la carta es ${cartaSiguiente > this.cartaActual ? 'mayor' : 'menor'} (${cartaSiguiente})`;
        this.esCorrecto = false; // Mensaje en rojo
      }
  
      this.cartaActual = cartaSiguiente;
  
      
    } else {
      this.finDelJuego = true;
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.finDelJuego = false;
    this.mensajeResultado = ''; // Limpiamos el mensaje
    this.esCorrecto = true; // Reset del estilo
    this.inicializarMazo();
    this.obtenerCarta();
  }

  shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
