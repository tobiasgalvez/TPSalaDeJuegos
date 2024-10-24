import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarJuego'
})
export class FiltrarJuegoPipe implements PipeTransform {

  transform(resultados: any[], juego: string): any[] {
    if (!resultados || juego === 'todos') {
      return resultados;
    }
    return resultados.filter(resultado => resultado.juego === juego);
  }

}
