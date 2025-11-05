import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}
export interface Cidade {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class IbgeService {
  private readonly enderecoAPI =
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados/';

  // https://servicodados.ibge.gov.br/api/docs/localidades
  // https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}
  // https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios

  constructor(private http: HttpClient) {}

  getTodosOsEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.enderecoAPI).pipe(retry(2));
  }

  getCidadesNoEstado(uf: string): Observable<Cidade[]> {
    const enderecoAPIComEstado = this.enderecoAPI + '/' + uf + '/municipios';
    return this.http.get<Cidade[]>(enderecoAPIComEstado).pipe(retry(2));
  }
}
