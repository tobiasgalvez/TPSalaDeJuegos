import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartasService } from '../../servicios/cartas.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'; // Importa Firestore
import { Auth } from '@angular/fire/auth'; // Importa Auth para obtener el usuario actual
import { User } from 'firebase/auth'; // Importa User para definir el tipo del usuario

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss']
})
export class MayorMenorComponent implements OnInit {
  deckId: string = ''; // Para almacenar el ID del mazo
  cartaActual: any = null; // La carta actual con su imagen
  cartaSiguiente: any = null; // La siguiente carta
  puntaje: number = 0;
  finDelJuego: boolean = false;
  mensajeResultado: string = ''; 
  esCorrecto: boolean = false;
  botonesDeshabilitados: boolean = false; // Para deshabilitar los botones de respuesta
  preguntasRespondidas: number = 0; // Contador de preguntas
  maxRondas: number = 10; // Máximo de rondas
  user: User | null = null; // Para guardar el usuario logueado

  constructor(private cartasService: CartasService, private firestore: Firestore, private auth: Auth) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.user = user; // Guardar el usuario actual
    });

    this.inicializarMazo();
  }

  inicializarMazo() {
    this.cartasService.obtenerMazo().subscribe(data => {
      this.deckId = data.deck_id;
      this.obtenerCarta();
    });
  }

  obtenerCarta() {
    if (this.deckId) {
      this.cartasService.obtenerCarta(this.deckId).subscribe(data => {
        this.cartaActual = data.cards[0]; // Guardamos la carta actual
        this.cartaSiguiente = null; // Reiniciar carta siguiente
      });
    }
  }

  adivinar(opcion: string) {
    if (this.cartaActual) {
      this.botonesDeshabilitados = true; // Deshabilitar botones al seleccionar una opción

      // Guardar la carta actual antes de obtener la siguiente
      const cartaAnterior = this.cartaActual;

      this.cartasService.obtenerCarta(this.deckId).subscribe(data => {
        this.cartaSiguiente = data.cards[0]; // Obtenemos la siguiente carta

        const valorCartaAnterior = this.obtenerValorCarta(cartaAnterior.value);
        const valorCartaSiguiente = this.obtenerValorCarta(this.cartaSiguiente.value);

        // Verifica si la respuesta es correcta
        if ((opcion === 'mayor' && valorCartaSiguiente > valorCartaAnterior) ||
            (opcion === 'menor' && valorCartaSiguiente < valorCartaAnterior)) {
          this.puntaje++;
          this.mensajeResultado = `Correcto! La carta es ${valorCartaSiguiente > valorCartaAnterior ? 'mayor' : 'menor'}.`;
          this.esCorrecto = true; 
        } else {
          this.mensajeResultado = `Incorrecto! La carta es ${valorCartaSiguiente > valorCartaAnterior ? 'mayor' : 'menor'}.`;
          this.esCorrecto = false; 
        }

        // Incrementar preguntas respondidas
        this.preguntasRespondidas++;

        // Comprobar si se ha alcanzado el número máximo de preguntas
        if (this.preguntasRespondidas >= this.maxRondas) {
          this.finDelJuego = true;
          //this.mensajeResultado += ` | Juego terminado! Puntaje final: ${this.puntaje}`;
          
          // Llamar al método para guardar resultados al finalizar el juego
          this.guardarResultado();
        } else {
          // Avanzar a la siguiente carta después de un breve retraso
          setTimeout(() => {
            this.mensajeResultado = ''; // Limpiar mensaje
            this.cartaActual = this.cartaSiguiente; // La siguiente carta se convierte en la actual
            this.botonesDeshabilitados = false; // Habilitar botones de nuevo
          }, 2000); // Esperar 2 segundos antes de mostrar la siguiente carta
        }
      });
    }
  }

  async guardarResultado() {
    if (this.user) { // Asegúrate de que el usuario esté logueado
      const resultadosRef = collection(this.firestore, 'resultados_mayor-menor'); // Cambia el nombre de la colección según lo necesites
      await addDoc(resultadosRef, {
        usuario: this.user.email,
        fecha: new Date(),
        puntaje: this.puntaje,
        //maxPreguntas: this.maxRondas,
      });
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.finDelJuego = false;
    this.mensajeResultado = '';
    this.esCorrecto = false;
    this.botonesDeshabilitados = false; // Habilitar botones
    this.preguntasRespondidas = 0; // Reiniciar contador de preguntas
    this.inicializarMazo();
  }

  obtenerValorCarta(carta: string): number {
    // Convierte las cartas en valores numéricos
    if (['JACK', 'QUEEN', 'KING'].includes(carta)) return 11;
    if (carta === 'ACE') return 1;
    return parseInt(carta, 10);
  }
}
