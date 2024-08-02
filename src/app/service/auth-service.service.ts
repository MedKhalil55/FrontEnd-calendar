import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async login(email: string, password: string): Promise<any> {
    const url = `${this.BASE_URL}/api/auth/authenticate`;
  
      return await this.http.post<any>(url, { email, password })
      .pipe(
        catchError(this.handleError)
      ).toPromise();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 403) {
        errorMessage = 'Invalid email or password!';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }


  async register(userData: any, ): Promise<any> {
    const url = `${this.BASE_URL}/api/auth/register`;
    try {
      const response = await this.http.post<any>(url, userData).toPromise()
      return response;
    }
    catch (error) {
      throw error;
    }
  }
  async getAllUsers(token: string): Promise<any> {
    const url = `${this.BASE_URL}/api/auth/getUsers`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try {
      const response = await this.http.get<any>(url, { headers }).toPromise()
      return response;
    }
    catch (error) {
      throw error;
    }
  }
  async getProfile(token: string): Promise<any> {
    const url = `${this.BASE_URL}/api/auth/profile`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try {
      const response = await this.http.get<any>(url, { headers }).toPromise()
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/api/auth/getUsers/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try {
      const response = await this.http.get<any>(url, { headers }).toPromise()
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }
  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }
  isAdmin(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      return role === 'Admin'
    }
    return false;
  }
  isUser() {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      return role === 'User'
    }
    return false;
  }

}