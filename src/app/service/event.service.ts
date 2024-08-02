// event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/calendar/events/admin'; //  Spring Boot API URL
  //private apiUrlUserEvent = 'http://localhost:8080/calendar/events/admin/user-events';    // url for get the events of the user    

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: any): Observable<any> {  
    return this.http.post<any>(this.apiUrl, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number, token: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
}
   getEventsForCurrentUser(token: string): Observable<any[]> {
    const url = `${this.apiUrl}/user-events`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try {
      const response =  this.http.get<any>(url, { headers })
      return response;
    }
    catch (error) {
      throw error;
    }
  }
  getEventsForCurrentUserId(id:number): Observable<any[]> {
    const url = `${this.apiUrl}/user-events-id/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any[]>(url, { headers });
    }

  getCompletedEvents(token : string) : Observable<any[]>{
    const url = `${this.apiUrl}/iscompleted`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try {
      const response =  this.http.get<any>(url, { headers })
      return response;
    }
    catch (error) {
      throw error;
    }
  }  
  getInCompletedEvents(token : string) : Observable<any[]>{
    const url = `${this.apiUrl}/isnoncompleted`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try {
      const response =  this.http.get<any>(url, { headers })
      return response;
    }
    catch (error) {
      throw error;
    }
  } 
  getCompletedEventsForUserId( id : number) : Observable<any[]>{
    const url = `${this.apiUrl}/iscompletedByuser/${id}`;
    try {
      const response =  this.http.get<any>(url)
      return response;
    }
    catch (error) {
      throw error;
    }
  } 
  getInCompletedEventsForUserId(id:number) : Observable<any[]>{
    const url = `${this.apiUrl}/isnoncompletedByuser/${id}`;
    try {
      const response =  this.http.get<any>(url)
      return response;
    }
    catch (error) {
      throw error;
    }
  } 




}
