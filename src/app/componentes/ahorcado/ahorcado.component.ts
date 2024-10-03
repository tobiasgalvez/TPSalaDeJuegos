import { CommonModule } from '@angular/common'; // para las directivas ng
import { Component } from '@angular/core';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {

  palabra: string = "TOBIAS";  // La palabra a adivinar
  letrasIngresadas: string[] = [];  // Letras ingresadas
  intentos: number = 6;  // intentos
  maxIntentos: number = 6;  // Número máximo de intentos
  hasGanado: boolean = false;


  get letrasFaltantes() {
    return this.palabra.split('').map(letra => this.letrasIngresadas.includes(letra) ? letra : '_').join(' ');
  }

  // get imagenAhorcado() {
  //   // Ruta de la imagen según el número de intentos fallidos
  //   return `assets/images/ahorcado-${this.maxIntentos - this.intentos}.png`;
  // }

  ingresarLetra(letra: string) {
    if (!this.letrasIngresadas.includes(letra)) {
      this.letrasIngresadas.push(letra);
      if (!this.palabra.includes(letra)) {
        this.intentos--;
      }
      this.verificarGanador();  // Llama a la verificación de victoria después de cada intento
    }
  }

  verificarGanador() {
    if (!this.letrasFaltantes.includes('_')) {
      this.hasGanado = true;
    }
  }

  reiniciarJuego() {
    this.letrasIngresadas = [];
    this.intentos = 6;
    this.hasGanado = false;  // Reinicia el estado de victoria
  }

}
