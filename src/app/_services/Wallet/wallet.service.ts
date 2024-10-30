import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }
  
  getProfile(userId: string) {
    const accessToken = localStorage.getItem('access_token');
    const headers = ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get<any>(`${this.apiUrl}/customer/profile/${userId}`, { headers });
  }

  initWallet(userId: string) {
    const accessToken = localStorage.getItem('access_token');
    const headers = ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.post<any>(`${this.apiUrl}/wallet/initialize/${userId}`,  { headers });

  }
}
