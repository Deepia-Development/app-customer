import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

interface User {
  email: string;
  password: string;
  name?: string;
  surname?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  private apiUrl = environment.apiUrl;
  private userRole = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRole.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.checkToken();
  }

  signUpUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/customer/register`, user);
  }

  signInUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/customer/login`, { email: user.email, password: user.password }).pipe(
      tap((response: any) => {
        const token = response.data.token;
        this.setToken(token);
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.setUserRole(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
    this.userRole.next(null);
  }

  setUserRole(token: string): void {
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken.role || 'user';
    this.userRole.next(role);
  }

  getUserRole(): Observable<string | null> {
    return this.userRole$;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      this.setUserRole(token);
    }
  }
}