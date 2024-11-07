import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface QuoteRequest {
  pais_origen: string;
  pais_destino: string;
  cp_origen: string;
  cp_destino: string;
  alto: number;
  ancho: number;
  largo: number;
  peso: number;
  seguro: number;
  valor_declarado: number;
}

interface QuoteResponse {
  superenvios: {
    success: boolean;
    data: {
      paqueterias: any[];
    };
  };
  fedex: {
    success: boolean;
    data: {
      paqueterias: any[];
    };
  };
  paqueteexpress: {
    success: boolean;
    data: {
      paqueterias: any[];
    };
  };
  dhl: {
    success: boolean;
    data: {
      paqueterias: any[];
    };
  };
  estafeta: {
    success: boolean;
    data: {
      paqueterias: any[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  constructor(private http: HttpClient) { }

  getQuote(quoteData: any): Observable<{ superenvios: { paqueterias: any[] }, fedex: any[], paqueteexpress: any[], dhl: any[] }> {
    return this.http.post<QuoteResponse>(`${environment.apiUrl}/shipping/quote`, quoteData)
      .pipe(
        map(response => {
          const filterByPrice = (paqueterias: any[]) => {
            // Verifica que paqueterias es un array antes de usar filter
            return Array.isArray(paqueterias) ? paqueterias.filter(p => p.precio > 0 ) : [];
          };
  
          const result = {
            superenvios: {
              paqueterias: filterByPrice(response?.superenvios?.success ? response.superenvios.data.paqueterias : [])
            },
            fedex: filterByPrice(response?.fedex?.success ? response.fedex.data.paqueterias : []),
            paqueteexpress: filterByPrice(response?.paqueteexpress?.success ? response.paqueteexpress.data.paqueterias : []),
            dhl: filterByPrice(response?.dhl?.success ? response.dhl.data.paqueterias : [])
          };
  
          // Log the result to the console
          console.log("Cotizaciones obtenidas (filtradas): ", result);
  
          return result;
        }),
        catchError(error => {
          console.error("Error al obtener cotizaciones: ", error);
          return of({
            superenvios: { paqueterias: [] },
            fedex: [],
            paqueteexpress: [],
            dhl: []
          });
        })
      );
  }


}
