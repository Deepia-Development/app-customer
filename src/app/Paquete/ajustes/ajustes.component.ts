import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/_services/Wallet/wallet.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
})
export class AjustesComponent implements OnInit {
  // User data
  user_id: string = '';
  profile: any = {};

  userName: string = '';
  userEmail: string = '';
  userId: string = '';

  // Password fields
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Notification settings
  emailNotifications: boolean = true;
  pushNotifications: boolean = false;

  // Sidebar control
  isSidebarOpen: boolean = false;

  // Message handling
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  isEditingName: boolean = false;
  isEditingEmail: boolean = false;
  isEditingPassword: boolean = false;

  constructor(private readonly walletService: WalletService) {}

  ngOnInit(): void {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.user_id = payload.id;
      }

      if (this.user_id) {
        this.getProfile();
      }
    } catch (error) {
      console.error('Error al obtener el id de usuario:', error);
      this.user_id = '';
    }
  }

  getProfile(): void {
    this.walletService.getProfile(this.user_id).subscribe(
      (response) => {
        console.log('Perfil de usuario:', response.data);
        this.profile = response.data;
        // Initialize form fields with profile data
        this.userName = this.profile.name || '';
        this.userEmail = this.profile.email || '';
        this.userId = this.profile.id || '';
      },
      (error) => {
        console.error('En revision', error);
        this.showError('Error al cargar el perfil');
      }
    );
  }

  openSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // ajustes.component.ts
  saveNameChange() {
    this.isEditingName = false;
    const updateData = {
      name: this.userName,
    };

    this.walletService.updateProfile(this.user_id, updateData).subscribe(
      (response) => {
        this.showSuccess('Nombre actualizado exitosamente');
        this.getProfile();
      },
      (error) => {
        console.error('En revision', error);
        this.showError('En revision');
      }
    );
  }

  saveEmailChange() {
    this.isEditingEmail = false;

    const updateData = {
      email: this.userEmail,
    };

    this.walletService.updateProfile(this.user_id, updateData).subscribe(
      (response) => {
        this.showSuccess('Email actualizado exitosamente');
        this.getProfile();
      },
      (error) => {
        console.error('En revision', error);
        this.showError('En revision');
      }
    );
  }

  savePasswordChange() {
    this.isEditingPassword = false;

    if (this.newPassword !== this.confirmPassword) {
      this.showError('Las contraseñas no coinciden');
      return;
    }

    const updateData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.walletService.updateProfile(this.user_id, updateData).subscribe(
      (response) => {
        this.showSuccess('Contraseña actualizada exitosamente');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      (error) => {
        console.error('En revision', error);
        this.showError('En revision');
      }
    );
  }

  showSuccess(msg: string) {
    this.message = msg;
    this.messageType = 'success';
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  showError(msg: string) {
    this.message = msg;
    this.messageType = 'error';
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }
}
