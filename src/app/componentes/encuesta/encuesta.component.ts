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

  constructor(private fb: FormBuilder, private firestore: Firestore, private auth: Auth) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      pregunta1: ['', Validators.required],
      pregunta2: ['', Validators.required],
      pregunta3: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.user = user; // Guardar el usuario actual
    });
  }

  onSubmit() {
    if (this.encuestaForm.valid) {
      const encuestaData = {
        ...this.encuestaForm.value,
        usuario: this.user.email, // Identificar el usuario
        fecha: new Date(),
      };

      const encuestaRef = collection(this.firestore, 'encuestas');
      addDoc(encuestaRef, encuestaData).then(() => {
        console.log('Encuesta guardada exitosamente');
        this.encuestaForm.reset(); // Reiniciar el formulario
      }).catch(error => {
        console.error('Error al guardar la encuesta: ', error);
      });
    }
  }

  // Validar si el formulario es válido
  esCampoInvalido(campo: string): boolean {
    const control = this.encuestaForm.get(campo);
    return control ? control.invalid && control.touched : false;
  }
}
