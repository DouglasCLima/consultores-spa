// src/app/services/consultor.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Consultor } from '../models/consultor';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConsultorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/consultores`; // URL: http://localhost:3000/api/consultores

  listar(termoBusca?: string): Observable<Consultor[]> {
    let params = new HttpParams();
    if (termoBusca) {
      params = params.set('search', termoBusca);
    }
    return this.http.get<Consultor[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Consultor> {
    return this.http.get<Consultor>(`${this.apiUrl}/${id}`);
  }

  criar(consultor: Consultor): Observable<Consultor> {
    return this.http.post<Consultor>(this.apiUrl, consultor);
  }

  atualizar(id: number, consultor: Consultor): Observable<Consultor> {
    return this.http.put<Consultor>(`${this.apiUrl}/${id}`, consultor);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
