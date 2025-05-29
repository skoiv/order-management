import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOrders(): Observable<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any[]>(this.apiUrl);
  }
}
