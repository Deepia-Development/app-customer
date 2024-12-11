import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CotizarComponent } from './Paquete/cotizar/cotizar.component';
import { LoginComponent } from './Users/login/login.component';
import { SignupComponent } from './Users/signup/signup.component';
import { PaqueteriasComponent } from './Paquete/paqueterias/paqueterias.component';
import { AppSidebarComponent } from './sidebar/app-sidebar/app-sidebar.component';
import { DescripcionComponent } from './Paquete/descripcion/descripcion.component';
import { CodigoComponent } from './Paquete/codigo/codigo.component';
import { InstruccionesComponent } from './Paquete/instrucciones/instrucciones.component';
import { HistorialComponent } from './Paquete/historial/historial.component';
import { AuthGuard } from './_services/autenticacion/auth-guard.service';
import { ForgotPassComponent } from './Users/forgot-pass/forgot-pass.component';
import { HistorialDetailsComponent } from './Paquete/historial-details/historial-details.component';
import { WalletComponent } from './wallet/wallet.component';
import { AjustesComponent } from './Paquete/ajustes/ajustes.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'cotizar', component: CotizarComponent, canActivate: [AuthGuard] },
  { path: 'ajustes', component: AjustesComponent },
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'paqueterias',
    component: PaqueteriasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'descripcion',
    component: DescripcionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'codigo', component: CodigoComponent, canActivate: [AuthGuard] },
  {
    path: 'instrucciones',
    component: InstruccionesComponent,
    canActivate: [AuthGuard],
  },
  { path: 'wallet', component: WalletComponent, canActivate: [AuthGuard] },
  {
    path: 'details/:id',
    component: HistorialDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/cotizar', pathMatch: 'full' },
  { path: '**', redirectTo: '/cotizar' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
