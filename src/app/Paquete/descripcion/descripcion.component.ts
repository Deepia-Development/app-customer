import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnviosDataService } from 'src/app/_services/envios/envios-data.service';




interface Paqueteria {
  nombre: string;
  proveedor: string;  
  imagen: string;
  tiempo_de_entrega: string;
  precio: number;
  nombre_servicio: string;  
}


@Component({
  selector: 'app-descripcion',
  templateUrl: './descripcion.component.html',
  styleUrls: ['./descripcion.component.scss']
})

export class DescripcionComponent implements OnInit {
  paqueteria: Paqueteria | null = null;
  isSidebarOpen: boolean = false;
  currentStep = 1;
  sender: any = {};
  recipient: any = {};
  shippingPrice: number = 0;
  shippingType: string = 'Express';
  estimatedDeliveryTime: string = '1-2 días hábiles';
  qrCodeData: string = '';

  constructor(
    private router: Router, 
    private enviosDataService: EnviosDataService
  ) { }

  ngOnInit() {
    const paqueteria = this.enviosDataService.getPaqueteriaSeleccionada();
    console.log('Paquetería recuperada:', paqueteria);
    if (paqueteria) {
      this.paqueteria = paqueteria;
      this.shippingPrice = Number(paqueteria.precio) || 0;
      this.estimatedDeliveryTime = paqueteria.tiempo_de_entrega || '';
      this.shippingType = paqueteria.nombre_servicio || '';
    } else {
      console.log('No se encontró información de paquetería');
    }
  }


  senderFields = [
    { key: 'name', label: 'Nombre completo', type: 'text' },
    { key: 'email', label: 'Correo electrónico', type: 'email' },
    { key: 'phone', label: 'Número telefónico', type: 'tel' },
    { key: 'country', label: 'País', type: 'text' },
    { key: 'zip_code', label: 'CP', type: 'text' },
    { key: 'state', label: 'Estado', type: 'text' },
    { key: 'city', label: 'Ciudad', type: 'text' },
    { key: 'settlement', label: 'Colonia', type: 'text' },
    { key: 'street', label: 'Calle', type: 'text' },
    { key: 'external_number', label: 'Número exterior', type: 'text' },
    { key: 'internal_number', label: 'Número interior', type: 'text' },
    { key: 'reference', label: 'Referencia', type: 'text' },
  ];

  recipientFields = [...this.senderFields];

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  confirmarPedido() {
    this.generateQRCode();
    this.router.navigate(['/codigo']);
  }

  generateQRCode() {
    const envioData = {
      remitente: this.sender,
      destinatario: this.recipient,
      paqueteria: this.paqueteria,
      precio: this.shippingPrice,
      tipoEnvio: this.shippingType,
      tiempoEstimado: this.estimatedDeliveryTime,
      
    };


      

    // console.log('Datos del remitente:', this.sender);


    // console.log('Pais:', this.sender.country);
    // console.log('Estado:', this.sender.state);

    const senderIsoCodes = this.enviosDataService.getLocationCodes(
      this.sender.country,
      this.sender.state
    );


      // Agregar automáticamente los valores ISO al remitente (sender)
      this.sender.iso_estado = senderIsoCodes.stateCode;   // Por ejemplo "JA"
      this.sender.iso_pais = senderIsoCodes.countryCode;   // Por ejemplo "MX"
      this.sender.country_code = senderIsoCodes.countryCode; // Por ejemplo "MX"
  

    const recipientIsoCodes = this.enviosDataService.getLocationCodes(
      this.recipient.country,
      this.recipient.state
    );
      // Agregar automáticamente los valores ISO al remitente (sender)

    this.recipient.iso_estado = recipientIsoCodes.stateCode;
    this.recipient.iso_pais = recipientIsoCodes.countryCode;
    this.recipient.country_code = recipientIsoCodes.countryCode;


    const isoCodeSender = {
      pais: this.sender.country,
      estado: this.sender.state,
      paisCode: senderIsoCodes.countryCode,
      estadoCode: senderIsoCodes.stateCode
    };


    const isoCodeRecipient = {
      pais: this.recipient.country,
      estado: this.recipient.state,
      paisCode: recipientIsoCodes.countryCode,
      estadoCode: recipientIsoCodes.stateCode
    };



    localStorage.setItem('isoCodeSender', JSON.stringify(isoCodeSender));
    localStorage.setItem('isoCodeRecipient', JSON.stringify(isoCodeRecipient));
    
    

   

    // console.log('Datos del envío:', envioData);

    


    this.qrCodeData = JSON.stringify(envioData);
    this.enviosDataService.setQRCodeData(this.qrCodeData);
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
      console.log('Paso actual:', this.currentStep);
      console.log('Datos del remitente:', this.sender);
      console.log('Datos del destinatario:', this.recipient);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  adressRemitente() {
    const fields = ['street', 'exteriorNumber', 'interiorNumber', 'colony', 'city', 'state', 'country', 'postalCode', 'reference'];
    return fields
      .map(field => this.sender[field])
      .filter(value => value && value.trim() !== '')
      .join(', ');
  }

  adressDestinatario() {
    const fields = ['street', 'exteriorNumber', 'interiorNumber', 'colony', 'city', 'state', 'country', 'postalCode'];
    return fields
      .map(field => this.recipient[field])
      .filter(value => value && value.trim() !== '')
      .join(', ');
  }

  getPackageImage(): string {
    if (!this.paqueteria || !this.paqueteria.proveedor) {  
      console.log('Paquetería o proveedor no definido');
      return 'assets/images/isotipo-dagpacket.png';
    }
  
    const proveedorNormalizado = this.paqueteria.proveedor.toLowerCase().replace(/\s+/g, '');
    console.log('Proveedor normalizado:', proveedorNormalizado);
    
    return `assets/images/${proveedorNormalizado}_logo.png`;
  }
}

