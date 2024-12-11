import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/_services/Wallet/wallet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  isSidebarOpen: boolean = false;
  isProcessing: boolean = false;
  user_id: string = '';
  profile: any = {};

  // Convertido a getter
  get userBalance(): string {
    return this.profile?.wallet?.rechargeBalance?.$numberDecimal || '0.00';
  }

  constructor(
    private readonly walletService: WalletService,
    private router: Router
  ) {
    this.isSidebarOpen = false;
  }

  ngOnInit(): void {
    this.isSidebarOpen = false;

    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.user_id = payload.id;
      }

      if (this.user_id) {
        console.log('ID de usuario obtenido:', this.user_id);
      } else {
        console.log('No se encontró ID de usuario en localStorage');
      }
    } catch (error) {
      console.error('Error al obtener el id de usuario:', error);
      this.user_id = '';
    }

    this.getProfile();
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  sendToPayStripe(): void {
    this.walletService.createCheckoutSession(this.user_id).subscribe(
      (response) => {
        console.log('Respuesta de la creación de la sesión de pago:', response);
        const url = response.url;
        window.location.href = url;
      },
      (error) => {
        console.error('Error al crear la sesión de pago:', error);
      }
    );
  }

  getProfile(): void {
    this.walletService.getProfile(this.user_id).subscribe(
      (response) => {
        console.log('Perfil de usuario:', response.data);
        this.profile = response.data;
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    );
  }
}
