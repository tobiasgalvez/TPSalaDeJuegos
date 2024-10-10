export interface Pregunta {
    letra: string;
    palabra: string;
    definicion: string;
    estado: 'pendiente' | 'correcto' | 'incorrecto' | 'sin_respuesta';  
  }