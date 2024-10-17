import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

interface Resultado {
  usuario: string;
  puntaje: number;
  fecha: any; // Si es un timestamp de Firestore, puede ser tipo `any` o `Date`.
}

@Injectable({
  providedIn: 'root',
})
export class ResultadosService {
  constructor(private firestore: Firestore) {}

  obtenerTodosLosResultados(): Observable<Resultado[]> {
    const ahorcadoRef = collection(this.firestore, 'resultados_ahorcado');
    const mayorMenorRef = collection(this.firestore, 'resultados_mayor-menor');
    const pasapalabraRef = collection(this.firestore, 'resultados_pasapalabra');
    const preguntadosRef = collection(this.firestore, 'resultados_preguntados');

    const ahorcado = collectionData(ahorcadoRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Ahorcado',  // Aquí asignas el nombre del juego según la colección
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha // Verifica si fecha tiene toDate()
      })))
    );

    const mayorMenor = collectionData(mayorMenorRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Mayor-Menor',
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha
      })))
    );

    const pasapalabra = collectionData(pasapalabraRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Pasapalabra',
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha
      })))
    );

    const preguntados = collectionData(preguntadosRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Preguntados',
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha
      })))
    );

    // Combina todos los resultados de las colecciones en un solo array
    return forkJoin([ahorcado, mayorMenor, pasapalabra, preguntados]).pipe(
      map(resultadosArray => resultadosArray.flat())
    );
  }
}
