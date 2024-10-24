import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

interface Resultado {
  usuario: string;
  puntaje: number;
  fecha: any;
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

    const ahorcado$ = collectionData(ahorcadoRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Ahorcado',
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha,
      })))
    );

    const mayorMenor$ = collectionData(mayorMenorRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Mayor-Menor',
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha,
      })))
    );

    const pasapalabra$ = collectionData(pasapalabraRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Pasapalabra',
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha,
      })))
    );

    const preguntados$ = collectionData(preguntadosRef, { idField: 'id' }).pipe(
      map((resultados: Resultado[]) => resultados.map(res => ({
        ...res,
        juego: 'Preguntados',
        fecha: res.fecha && res.fecha.toDate ? res.fecha.toDate() : res.fecha,
      })))
    );

    // Usa forkJoin para combinar los resultados
    return combineLatest([ahorcado$, mayorMenor$, pasapalabra$, preguntados$]).pipe(
  map(resultadosArray => resultadosArray.flat())
);
  }
}
