import { NgModule } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Users/login/login.component';
import { SignupComponent } from './Users/signup/signup.component';
import { CotizarComponent } from './Paquete/cotizar/cotizar.component';
import { PaqueteriasComponent } from './Paquete/paqueterias/paqueterias.component';
import { LottieModule } from 'ngx-lottie';
import lottie from 'lottie-web';
import { AppSidebarComponent } from './sidebar/app-sidebar/app-sidebar.component';
import { DescripcionComponent } from './Paquete/descripcion/descripcion.component';
import { CodigoComponent } from './Paquete/codigo/codigo.component';
import { InstruccionesComponent } from './Paquete/instrucciones/instrucciones.component';
import { HistorialComponent } from './Paquete/historial/historial.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AuthService } from './_services/autenticacion/auth.service';
import { CatchTokenService } from './_services/autenticacion/catch-token.service';
import { AuthLoginService } from './_services/autenticacion/auth-login.service';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { AuthGuard } from './_services/autenticacion/auth-guard.service';
import { ForgotPassComponent } from './Users/forgot-pass/forgot-pass.component';
import { HistorialDetailsComponent } from './Paquete/historial-details/historial-details.component';
import { WalletComponent } from './wallet/wallet.component';

export function playerFactory() {
  return lottie;
}

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    CotizarComponent,
    PaqueteriasComponent,
    AppSidebarComponent,
    DescripcionComponent,
    CodigoComponent,
    InstruccionesComponent,
    HistorialComponent,
    ForgotPassComponent,
    HistorialDetailsComponent,
    WalletComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    QRCodeModule,
    LottieModule.forRoot({ player: playerFactory }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['http://localhost:3000/api/v1/customer/login'],
      },
    }),
  ],
  providers: [
    AuthService,
    AuthLoginService,
    JwtHelperService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchTokenService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
