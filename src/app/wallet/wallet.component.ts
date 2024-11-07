import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/_services/Wallet/wallet.service';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  constructor(private readonly walletService: WalletService) {}
  
  isProcessing: boolean = false;
  generatingGuides: boolean = false;

  isSidebarOpen: boolean = false;
  isModalOpen: boolean = false;
  user_id: string = '';
  profile: any = {};

  ngOnInit(): void {
    try {
      // Obtiene directamente el ID como string
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

  processPaymentAndGenerateGuides(): void {
    
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

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }
}
