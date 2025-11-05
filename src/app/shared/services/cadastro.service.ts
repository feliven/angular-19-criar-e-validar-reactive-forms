import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface DadosCadastroInterface {
  areaAtuacao?: string;
  nivelExperiencia?: string;
  nomeCompleto?: string;
  estado?: string;
  cidade?: string;
  email?: string;
  senha?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  private dadosCadastroSubject = new BehaviorSubject<DadosCadastroInterface>(
    {}
  );

  dadosCadastro$ = this.dadosCadastroSubject.asObservable();

  constructor() {
    const dadosSalvos = localStorage.getItem('dadosCadastro');

    if (dadosSalvos) {
      this.dadosCadastroSubject.next(JSON.parse(dadosSalvos));
    }
  }

  atualizarDadosCadastro(dados: Partial<DadosCadastroInterface>): void {
    const dadosAtuais = this.dadosCadastroSubject.getValue();
    const dadosAtualizados = { ...dadosAtuais, ...dados };
    this.dadosCadastroSubject.next(dadosAtualizados);
    localStorage.setItem('dadosCadastro', JSON.stringify(dadosAtualizados));
  }

  getDadosCadastro(): DadosCadastroInterface {
    return this.dadosCadastroSubject.value;
  }
}
