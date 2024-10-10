import { Injectable } from '@angular/core';
import { Pregunta } from '../models/pregunta.models';

@Injectable({
  providedIn: 'root'
})
export class PasapalabraService {

  preguntas: Pregunta[] = [
    { letra: 'A', palabra: 'Arbol', definicion: 'Ser vivo vegetal con tronco.' , estado: 'pendiente' },
    { letra: 'B', palabra: 'Barco', definicion: 'Medio de transporte acuático.', estado: 'pendiente' },
    { letra: 'C', palabra: 'Casa', definicion: 'Edificio destinado a ser habitado.', estado: 'pendiente' },
    { letra: 'D', palabra: 'Dado', definicion: 'Objeto cúbico que se usa en juegos de azar.', estado: 'pendiente' },
    { letra: 'E', palabra: 'Elefante', definicion: 'Mamífero terrestre de gran tamaño.', estado: 'pendiente' },
    { letra: 'F', palabra: 'Fuego', definicion: 'Combustión que produce luz y calor.', estado: 'pendiente' },
    { letra: 'G', palabra: 'Gato', definicion: 'Animal doméstico de la familia de los felinos.', estado: 'pendiente' },
    { letra: 'H', palabra: 'Hombre', definicion: 'Ser humano de sexo masculino.', estado: 'pendiente' },
    { letra: 'I', palabra: 'Isla', definicion: 'Porción de tierra rodeada de agua.', estado: 'pendiente' },
    { letra: 'J', palabra: 'Jardin', definicion: 'Terreno destinado a la cultivación de plantas.', estado: 'pendiente' },
    { letra: 'K', palabra: 'Kilómetro', definicion: 'Unidad de medida de longitud igual a mil metros.', estado: 'pendiente' },
    { letra: 'L', palabra: 'Luz', definicion: 'Radiación que permite la visión.', estado: 'pendiente' },
    { letra: 'M', palabra: 'Mesa', definicion: 'Mueble con una superficie plana y horizontal.', estado: 'pendiente' },
    { letra: 'N', palabra: 'Nube', definicion: 'Conjunto de pequeñas gotas de agua suspendidas en la atmósfera.', estado: 'pendiente' },
    { letra: 'O', palabra: 'Oso', definicion: 'Mamífero grande y robusto, con pelaje espeso.', estado: 'pendiente' },
    { letra: 'P', palabra: 'Perro', definicion: 'Animal doméstico, conocido como el mejor amigo del hombre.', estado: 'pendiente' },
    { letra: 'Q', palabra: 'Queso', definicion: 'Producto lácteo obtenido a partir de la cuajada de la leche.', estado: 'pendiente' },
    { letra: 'R', palabra: 'Rio', definicion: 'Corriente de agua que fluye por un cauce.', estado: 'pendiente' },
    { letra: 'S', palabra: 'Sol', definicion: 'Estrella que da luz y calor a la Tierra.', estado: 'pendiente' },
    { letra: 'T', palabra: 'Tigre', definicion: 'Gran felino de pelaje rayado.', estado: 'pendiente' },
    { letra: 'U', palabra: 'Universo', definicion: 'Totalidad de todo lo que existe, incluyendo espacio y tiempo.', estado: 'pendiente' },
    { letra: 'V', palabra: 'Viento', definicion: 'Movimiento del aire en la atmósfera.', estado: 'pendiente' },
    { letra: 'W', palabra: 'Whisky', definicion: 'Bebida alcohólica destilada a partir de cereales.', estado: 'pendiente' },
    { letra: 'X', palabra: 'Xilófono', definicion: 'Instrumento musical de percusión.', estado: 'pendiente' },
    { letra: 'Y', palabra: 'Yate', definicion: 'Embarcación de recreo.', estado: 'pendiente' },
    { letra: 'Z', palabra: 'Zapato', definicion: 'Calzado que cubre el pie.', estado: 'pendiente' }
];

  constructor() { }

  

  obtenerPreguntas(): Pregunta[] {
    return this.preguntas;
  }
  
  verificarRespuesta(letra: string, respuesta: string): boolean {
    const pregunta = this.preguntas.find(p => p.letra === letra);
    return pregunta?.palabra.toLowerCase() === respuesta.toLowerCase();
  }
}
