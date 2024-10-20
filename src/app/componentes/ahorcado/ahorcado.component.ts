import { CommonModule } from '@angular/common'; // para las directivas ng
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss']
})
export class AhorcadoComponent implements OnInit {
  palabrasPosibles: Array<string> = ["TOBIAS", "JUAN", "FEDERICO", "NICOLAS", "MATIAS", "EZEQUIEL", "PATRICIO", "JOSE"];
  palabra: string = this.palabrasPosibles[Math.floor(Math.random() * this.palabrasPosibles.length)];
  letrasIngresadas: string[] = [];
  intentos: number = 6;
  maxIntentos: number = 6;
  hasGanado: boolean = false;
  puntaje: number = 0; // Nueva variable para el puntaje
  user: User | null = null; // Para guardar el usuario logueado
  
  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user; // Guardar el usuario actual
    });
  }

  get letrasFaltantes() {
    return this.palabra.split('').map(letra => this.letrasIngresadas.includes(letra) ? letra : '_').join(' ');
  }

  ingresarLetra(letra: string) {
    if (!this.letrasIngresadas.includes(letra)) {
      this.letrasIngresadas.push(letra);

      // Si la letra es correcta, sumamos 10 puntos
      if (this.palabra.includes(letra)) {
        this.puntaje += 10;
      } else {
        this.intentos--;
      }

      this.verificarGanador();
    }
  }

  verificarGanador() {
    if (!this.letrasFaltantes.includes('_')) {
      this.hasGanado = true;
      // Si ha ganado, sumamos 100 puntos adicionales
      this.puntaje += 100;
      this.guardarResultado(); // Guardar el resultado cuando gane
    } else if (this.intentos === 0) {
      this.guardarResultado(); // Guardar resultado cuando pierda
    }
  }

  reiniciarJuego() {
    this.letrasIngresadas = [];
    this.intentos = 6;
    this.hasGanado = false;
    this.puntaje = 0; // Reiniciar el puntaje al iniciar un nuevo juego
    this.palabra = this.palabrasPosibles[Math.floor(Math.random() * this.palabrasPosibles.length)];
  }

  async guardarResultado() {
    if (this.user) {
      const resultadosRef = collection(this.firestore, 'resultados_ahorcado');
      await addDoc(resultadosRef, {
        usuario: this.user.email,
        fecha: new Date(),
        palabra: this.palabra,
        estado: this.hasGanado ? 'Ganado' : 'Perdido',
        puntaje: this.puntaje // Guardar el puntaje en Firestore
      });
    }
  }
}
