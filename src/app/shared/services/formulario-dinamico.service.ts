import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup } from '@angular/forms';
import { ConfiguracaoDeFormulario } from '../models/configurar-formulario.interface';

@Injectable({
  providedIn: 'root',
})
export class FormularioDinamicoService {
  private configuracoesDoFormulario: { [chaveFormulario: string]: Function } =
    {};

  constructor(private formBuilder: FormBuilder) {}

  registrarConfiguracoesFormulario(
    nomeDoFormulario: string,
    configuracoes: Function
  ) {
    this.configuracoesDoFormulario[nomeDoFormulario] = configuracoes;
  }

  getConfiguracoes(
    chaveFormulario: string,
    ...args: any[]
  ): ConfiguracaoDeFormulario {
    if (!this.configuracoesDoFormulario[chaveFormulario]) {
      throw new Error(
        `Configuração de formulário ${chaveFormulario} NÂO foi encontrada.`
      );
    }
    return this.configuracoesDoFormulario[chaveFormulario](...args);
  }

  criarFormGroup(
    configuracoes: ConfiguracaoDeFormulario,
    opcoesFormulario?: AbstractControlOptions
  ): FormGroup {
    const controlesFormulario: { [chaveFormulario: string]: any } = {};

    configuracoes.campos.forEach((campo) => {
      controlesFormulario[campo.formControlName] = [
        '',
        campo.validators,
        campo.asyncValidators,
      ];
    });

    return this.formBuilder.group(controlesFormulario, opcoesFormulario);
  }
}
