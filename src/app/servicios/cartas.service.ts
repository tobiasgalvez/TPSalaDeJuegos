// servicios/cartas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartasService {

  private apiUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/';

  constructor(private http: HttpClient) {}

  // Obtener un mazo de cartas barajado
  obtenerMazo(): Observable<any> {
    return this.http.get(`${this.apiUrl}?deck_count=1`);
  }

  // Robar una carta del mazo
  obtenerCarta(deckId: string): Observable<any> {
    return this.http.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
  }
}
