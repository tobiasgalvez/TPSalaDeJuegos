import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {

  private apiUrl = 'https://restcountries.com/v3.1/lang/spanish';;

  constructor(private http: HttpClient) { }

  obtenerPaises(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
