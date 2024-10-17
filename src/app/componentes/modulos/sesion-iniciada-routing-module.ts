import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../mayor-menor/mayor-menor.component';
import { ChatComponent } from '../chat/chat.component';
import { PreguntadosComponent } from '../preguntados/preguntados.component';
import { PasapalabraComponent } from '../pasapalabra/pasapalabra.component';
import { EncuestaComponent } from '../encuesta/encuesta.component';
import { ResultadosComponent } from '../resultados/resultados.component';


const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'preguntados', component: PreguntadosComponent},
  { path: 'pasapalabra' , component: PasapalabraComponent},
  { path: 'encuesta', component: EncuestaComponent},
  {path: 'resultados', component: ResultadosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SesionIniciadaRoutingModule {}
