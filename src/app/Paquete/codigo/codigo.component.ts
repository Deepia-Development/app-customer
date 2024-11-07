import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { EnviosDataService } from 'src/app/_services/envios/envios-data.service';
import { ShipmentData, Address,ShipmentDimensions } from 'src/app/models/shipmentData';
import { JwtPayload } from 'jwt-decode';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-codigo',
  templateUrl: './codigo.component.html',
  styleUrls: ['./codigo.component.scss']
})
export class CodigoComponent implements OnInit {
  qrCodeData: string = '';
  shipmentData: any;
  shipmentDimension: ShipmentDimensions = {} as ShipmentDimensions;
  fromData: Address = {} as Address;
  toData: Address = {} as Address;
  segure: any;
  costo : any;
  precio: any;
  dagpacket_profit: any;
  utilitie_dag: any;
  utilitie_lic: any;
  provider: any;
  apiProvider: any;
  ganancia: any;
  idService: any;



  constructor(
    private router: Router,
    private enviosDataService: EnviosDataService
  ) {}

  ngOnInit() {
    this.qrCodeData = this.enviosDataService.getQRCodeData();
    const data = JSON.parse(this.qrCodeData);
    console.log('Datos del código QR:', data);
    // console.log('Datos del remitente:', data.remitente);
    // console.log('Datos del destinatario:', data.destinatario);
    // console.log('Datos del paquete:', data.paqueteria);

    const dimensiones = localStorage.getItem('dimensiones');
    if (dimensiones) {
      var parsedDimensiones = JSON.parse(dimensiones); // Parse if it's a JSON string
      console.log('Dimensiones:', parsedDimensiones);
    } else {
      console.log('No dimensiones found in localStorage.');
    }    



    this.fromData = data.remitente;
    this.toData = data.destinatario
      this.shipmentDimension = parsedDimensiones;
     this.precio = parseFloat(data.precio); // For decimal numbers
     this.costo = parseFloat(data.paqueteria.precio_regular);
    this.provider = data.paqueteria.proveedor;
    const provider = localStorage.getItem('proveedor');
    this.apiProvider = provider;
    console.log('API Provider:', this.apiProvider);
    console.log('Provedor:', data.paqueteria.proveedor);

    this.ganancia = this.precio - this.costo;
    this.utilitie_dag = this.ganancia*0.7;
    this.utilitie_lic = this.ganancia*0.3;
    
    this.idService = data.paqueteria.idServicio;

    //   console.log('Ganancia:', this.ganancia);

    // console.log('shipmentDimension:', this.shipmentDimension);
    // console.log('Costo:', this.costo);
    // console.log('Precio:', this.precio);

    // console.log('Shipment data:', this.shipmentData);

    // console.log('Datos del envío:', this.shipmentData);



    this.createNewShipment();


    if (!this.qrCodeData) {
      console.error('No se encontraron datos para el código QR');
      // Aquí podrías manejar el caso de que no haya datos, por ejemplo, redirigiendo al usuario
      // this.router.navigate(['/cotizar']);
    }
  }

  createNewShipment(){

    const token = localStorage.getItem('token');
    const package_type = localStorage.getItem('tipo');
    console.log('Tipo de paquete:', package_type);

    

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      var userId = payload.id;
      
    }
    let user_id = userId;

    const newShipment: ShipmentData = {
      user_id: user_id,
      shipment_type:  'Paquete',
      from: this.fromData,
      to: this.toData,
      payment: {
        method: 'saldo',
        status: 'Pendiente'
      },
      packing: {
        answer: 'No',
        packing_type: 'None',
        packing_cost: '0'
      },
      shipment_data: {
        height: this.shipmentDimension.height,
        width: this.shipmentDimension.width,
        length: this.shipmentDimension.length,
        package_weight: this.shipmentDimension.package_weight
      },
      insurance: '0',
      cost: this.costo.toString(),
      price: this.precio.toString(),
      extra_price: '0',
      discount: '0',
      status: 'Pendiente',
      dagpacket_profit: this.ganancia.toString(),
      utilitie_dag: this.utilitie_dag.toString(),
      utilitie_lic: this.utilitie_lic.toString(),
      description: 'nada' ,
      provider: this.provider,
      apiProvider: this.apiProvider,
      idService: this.idService,
      isInternational: false
    }
  
    Swal.fire({
      title: 'Creando envío...',
      text: 'Por favor espere',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    this.enviosDataService.createShipment(newShipment, user_id).subscribe(
      response => {
        console.log('Envío creado exitosamente', response);
        console.log('Folio:', response.shipment);
        this.segure = response.shipment;
      

        if(!response.success){
          Swal.fire({
            title: 'Error al crear el envío',
            text: response.message,
            icon: 'error'
          });
        }

        Swal.fire({
          title: 'Envío creado',
          text: `Folio: ${response.shipment}`,
          icon: 'success'
        });


        this.router.navigate(['/cotizaciones']);
      },
      error => {
        Swal.fire({
          title: 'Error al crear el envío',
          text: error,
          icon: 'error'
        });
        console.error('Error al crear el envío:', error);
      }
    );


  }

  confirmarQr() {
    // Limpia los datos del QR después de confirmar
    this.enviosDataService.clearQRCodeData();
    this.router.navigate(['/instrucciones']);
  }
}