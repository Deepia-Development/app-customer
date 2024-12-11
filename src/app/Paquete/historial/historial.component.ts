import { Component, OnInit } from '@angular/core';
import { EnviosDataService } from 'src/app/_services/envios/envios-data.service';
import { Router } from '@angular/router';

interface Pedido {
  _id: string;
  id: number;
  estado:
    | 'Entregado'
    | 'En tránsito'
    | 'Procesando'
    | 'Cancelado'
    | 'Devuelto'
    | 'Rechazado'
    | 'Pendiente'
    | 'En recolección';
  origen: string;
  destino: string;
  fechaEnvio: Date;
  tipo: 'Paquete' | 'Sobre';
  costo: number;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  isSidebarOpen: boolean = false;
  historialPedidos: Pedido[] = [];
  user_id: string = '';
  constructor(
    private enviosDataService: EnviosDataService,
    private router: Router
  ) {}
  navigate(route: string[]) {
    this.router.navigate(route);
  }
  ngOnInit(): void {
    // Aquí normalmente cargarías los datos desde un servicio
    this.cargarHistorialPedidos();
  }

  cargarHistorialPedidos(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user_id = payload.id;
      console.log('User ID:', this.user_id);
    }

    // Llamada al servicio para obtener los pedidos del usuario
    this.enviosDataService.getUserShipments(this.user_id).subscribe(
      (response: any) => {
        console.log('Historial de pedidos:', response);

        // Verifica que `response.data.shipments` sea un arreglo
        if (Array.isArray(response.data.shipments)) {
          // Mapear los datos y asignar una clave única (ID)
          this.historialPedidos = response.data.shipments.map(
            (shipment: any, index: number) => ({
              _id: shipment._id,
              id: index + 1, // Usamos el índice como clave única
              estado: shipment.status,
              origen: shipment.from.state,
              destino: shipment.to.state,
              fechaEnvio: new Date(shipment.createdAt),
              tipo: shipment.shipment_type,
              costo: shipment.price.$numberDecimal,
            })
          );
        } else {
          console.error('El formato de los envíos no es un arreglo');
        }
      },
      (error: any) => {
        console.error('Error al cargar el historial de pedidos:', error);
      }
    );
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  verDetallesPedido(id: number): void {
    // Implementar la lógica para ver los detalles de un pedido específico
    console.log(`Ver detalles del pedido ${id}`);
  }

  // Métodos para la paginación (a implementar)
  paginaAnterior(): void {
    // Lógica para ir a la página anterior
  }

  paginaSiguiente(): void {
    // Lógica para ir a la página siguiente
  }

  irAPagina(numeroPagina: number): void {
    // Lógica para ir a una página específica
  }
}
