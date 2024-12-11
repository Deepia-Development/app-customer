import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProfile(userId: string) {
    const accessToken = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    return this.http.get<any>(`${this.apiUrl}/customer/profile/${userId}`, {
      headers,
    });
  }

  initWallet(userId: string) {
    const accessToken = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    return this.http.post<any>(`${this.apiUrl}/wallet/initialize/${userId}`, {
      headers,
    });
  }

  createCheckoutSession(userId: string) {
    const accessToken = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    return this.http.post<any>(
      `${this.apiUrl}/stripe/create-checkout-session`,
      { user_id: userId }, // Here userId is renamed to user_id in the body
      { headers }
    );
  }

  updateProfile(userId: string, profileData: any) {
    const accessToken = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    return this.http.put<any>(
      `${this.apiUrl}/users/${userId}`, // Remove /update/
      profileData,
      { headers }
    );
  }
}
