import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthLoginService } from '../../_services/autenticacion/auth-login.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
})
export class AppSidebarComponent implements OnInit {
  @Input() isSidebarOpen = false; // Change default to false
  isInventarioExpanded = false;

  constructor(private authService: AuthLoginService, private router: Router) {
    this.isSidebarOpen = false;
  }

  ngOnInit(): void {
    // Cerrar el sidebar en cada cambio de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isSidebarOpen = false;
      });
  }

  toggleInventario(): void {
    this.isInventarioExpanded = !this.isInventarioExpanded;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
