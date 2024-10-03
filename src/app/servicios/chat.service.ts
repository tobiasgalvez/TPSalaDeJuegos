import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from '../models/mensaje.models'; // Importa el tipo si está en otro archivo

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: Firestore) {}

  // Obtener los mensajes del chat
  obtenerMensajes(): Observable<Mensaje[]> {
    const chatCollection = collection(this.firestore, 'chats');
    const chatQuery = query(chatCollection, orderBy('timestamp'));

    return collectionData(chatQuery, { idField: 'id' }).pipe(
      map((mensajes: Mensaje[]) => mensajes.map(mensaje => ({
        ...mensaje,
        timestamp: mensaje.timestamp?.toDate ? mensaje.timestamp.toDate() : mensaje.timestamp
      })))
    );
  }

  // Método para enviar un mensaje
  enviarMensaje(message: Mensaje) {
    const chatCollection = collection(this.firestore, 'chats');
    const data = {
      ...message,
      timestamp: new Date() // Guardamos la fecha como Date
    };
    
    return addDoc(chatCollection, data) // `addDoc` proviene de `firebase/firestore`
      .then(() => console.log('Mensaje enviado'))
      .catch((error: any) => console.error('Error al enviar el mensaje: ', error));
  }
}
