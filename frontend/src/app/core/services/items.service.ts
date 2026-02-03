import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item, PaginatedResponse } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly API_URL = environment.apiUrl;
  
  private loadingSignal = signal<boolean>(false);
  isLoading = computed(() => this.loadingSignal());

  constructor(private http: HttpClient) {}

  getItems(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Item>> {
    this.loadingSignal.set(true);
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Item>>(`${this.API_URL}/items`, { params }).pipe(
      tap(() => this.loadingSignal.set(false)),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }
}
