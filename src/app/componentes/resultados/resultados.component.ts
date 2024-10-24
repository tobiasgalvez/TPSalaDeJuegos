import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ResultadosService } from '../../servicios/resultados.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent implements OnInit {

  resultados: any[] = []; // Inicializa como array vacío
  resultadosFiltrados: any[] = []; // Array para los resultados filtrados
  juegoSeleccionado: string = 'todos'; // Almacena el valor del juego seleccionado

  constructor(private resultadosService: ResultadosService) {}

  ngOnInit(): void {
    this.cargarResultados(); // Carga los resultados al iniciar
  }

  cargarResultados(): void {
    this.resultadosService.obtenerTodosLosResultados().subscribe({
      next: data => {
        console.log('Resultados obtenidos:', data); // Verifica los datos
        this.resultados = data; // Asigna los resultados
        this.resultadosFiltrados = data; // Inicialmente todos los resultados
      },
      error: err => {
        console.error('Error al obtener resultados:', err); // Maneja errores
      }
    });
  }

  filtrarResultados(): void {
    console.log('Juego seleccionado:', this.juegoSeleccionado);
    if (this.juegoSeleccionado === 'todos') {
      this.resultadosFiltrados = this.resultados; // Si es "todos", muestra todos los resultados
    } else {
      this.resultadosFiltrados = this.resultados.filter(resultado => {
        console.log('Comparando:', resultado.juego, 'con', this.juegoSeleccionado);
        return resultado.juego === this.juegoSeleccionado;
      });
    }
    console.log('Resultados filtrados:', this.resultadosFiltrados);
  }
  
}
