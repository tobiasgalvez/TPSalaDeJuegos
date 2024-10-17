import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ResultadosService } from '../../servicios/resultados.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent implements OnInit {

  resultados: any[] = [];

  constructor(private resultadosService: ResultadosService) {}
  
  ngOnInit(): void {
    this.resultadosService.obtenerTodosLosResultados().subscribe(
      data => {
        this.resultados = data;
        console.log('Datos obtenidos:', this.resultados); // Depuración
      },
      error => {
        console.error('Error al obtener resultados:', error); // Captura errores
      }
    );
  }

  mostrar() {
    console.log(this.resultados); // Para depuración
  }

}
