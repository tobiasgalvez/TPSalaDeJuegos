import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'; 
import { Auth } from '@angular/fire/auth'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class EncuestaComponent implements OnInit {
  encuestaForm: FormGroup;
  user: any;
  encuestaEnviada = false; // Para controlar si se muestra el mensaje de éxito
  mostrarError = false; // Para controlar si se muestra el mensaje de error

  constructor(private fb: FormBuilder, private firestore: Firestore, private auth: Auth) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      // pregunta1 como radio button
      pregunta1: ['', Validators.required], // Valor único para radio buttons
      // pregunta2 como checkbox
      pregunta2: this.fb.group({
        masJuegos: [false], // Control para checkbox
        mejorDiseño: [false],
        mayorDificultad: [false],
      }),
      pregunta3: ['', Validators.required],
     
    });
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.user = user; // Guardar el usuario actual
    });
  }

  onSubmit() {
    console.log(this.encuestaForm.value);
    if (this.encuestaForm.valid) {
      console.log("estoy en el subir");
      const encuestaData = {
        ...this.encuestaForm.value,
        usuario: this.user.email, // Identificar el usuario
        fecha: new Date(),
      };

      const encuestaRef = collection(this.firestore, 'encuestas');
      addDoc(encuestaRef, encuestaData).then(() => {
        console.log('Encuesta guardada exitosamente');
        this.encuestaEnviada = true; // Mostrar mensaje de éxito
        this.mostrarError = false; // Ocultar el mensaje de error
        setTimeout(() => this.encuestaEnviada = false, 3000);
        this.encuestaForm.reset(); // Reiniciar el formulario
      }).catch(error => {
        console.error('Error al guardar la encuesta: ', error);
      });
    } else {
      this.mostrarError = true; // Mostrar el mensaje de error si no se completaron todos los campos
      setTimeout(() => this.mostrarError = false, 3000); // Ocultar el mensaje de error después de 3 segundos
    }
  }

  // Validar si el formulario es válido
  esCampoInvalido(campo: string): boolean {
    const control = this.encuestaForm.get(campo);
    return control ? control.invalid && control.touched : false;
  }
}