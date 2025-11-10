import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { CadastroService } from '../../shared/services/cadastro.service';
import {
  Cidade,
  Estado,
  IbgeService,
} from '../../shared/services/ibge.service';
import { cpfValidator } from '../../shared/validators/cpf.validator';
import { emailExisteValidator } from '../../shared/validators/emailExiste.validator';
import { EmailValidatorService } from '../../shared/services/email-validator.service';
import { ConfiguracaoDeFormulario } from '../../shared/models/configurar-formulario.interface';
import { FormularioDinamicoService } from '../../shared/services/formulario-dinamico.service';
import { getDadosPessoaisFormConfig } from '../../config/dados-pessoais-form.config';
import { VariaveisFormulario } from '../../shared/models/variaveis-formulario.interface';

// interface DadosFormularioInterface {
//   nomeCompleto: string;
//   estado: string;
//   cidade: string;
//   email: string;
//   senha: string;
//   repitaSenha: string;
// }

export const senhasIguaisValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const senha = control.get('senha');
  const repitaSenha = control.get('repitaSenha');

  // senhasIguaisValidator takes an AbstractControl and returns either ValidationErrors or null.
  // It gets references to two form controls: senha E repitaSenha.

  // Only validate if both fields have values
  if (!senha?.value || !repitaSenha?.value) {
    return null; // Don't show error if fields are empty
  }

  return senha && repitaSenha && senha.value === repitaSenha.value
    ? null
    : { senhasSaoDiferentes: true };

  // If both fields exist AND their values are equal → returns null (valid)
  // If fields don't exist OR values are different → returns { senhasSaoDiferentes: true } (invalid)
};

@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss'],
})
export class DadosPessoaisFormComponent implements OnInit {
  dadosPessoaisForm!: FormGroup;
  configuracaoDeFormulario!: ConfiguracaoDeFormulario;

  estados$!: Observable<Estado[]>;
  cidades$!: Observable<Cidade[]>;

  carregandoCidades$ = new BehaviorSubject<boolean>(false);

  // cidades = [{ nome: 'São Paulo' }];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService,
    private ibgeService: IbgeService,
    private emailService: EmailValidatorService,
    private formDinamicoService: FormularioDinamicoService
  ) {
    this.formDinamicoService.registrarConfiguracoesFormulario(
      'dadosPessoaisForm',
      getDadosPessoaisFormConfig
    );
  }

  ngOnInit(): void {
    this.configuracaoDeFormulario =
      this.formDinamicoService.getConfiguracoes('dadosPessoaisForm');

    const opcoesFormulario: AbstractControlOptions = {
      validators: senhasIguaisValidator,
    };

    this.dadosPessoaisForm = this.formDinamicoService.criarFormGroup(
      this.configuracaoDeFormulario,
      opcoesFormulario
    );

    this.carregarEstados();
    this.addListenerEstado();
  }

  possuiCampo(name: string): boolean {
    return this.configuracaoDeFormulario.campos.some(
      (field) => field.formControlName === name
    );
  }

  getCampoPorNome(name: string): VariaveisFormulario {
    return (
      this.configuracaoDeFormulario.campos.find(
        (field) => field.formControlName === name
      ) || ({} as VariaveisFormulario)
    );
  }

  onAnterior(): void {
    this.salvarDadosInseridos();
    this.router.navigate(['/cadastro/area-atuacao']);
  }

  onProximo(): void {
    if (this.dadosPessoaisForm.valid) {
      this.salvarDadosInseridos();
      this.router.navigate(['/cadastro/confirmacao']);
    } else {
      this.dadosPessoaisForm.markAllAsTouched();
    }
  }

  retornaTipoDeCampoFormulario(
    campo: VariaveisFormulario,
    tipo: string
  ): boolean {
    return campo.type === tipo;
  }

  private carregarEstados(): void {
    this.estados$ = this.ibgeService
      .getTodosOsEstados()
      .pipe(
        map((estados) => estados.sort((a, b) => a.nome.localeCompare(b.nome)))
      );
  }

  private addListenerEstado(): void {
    const estadoControl = this.dadosPessoaisForm.get('estado');
    const cidadeControl = this.dadosPessoaisForm.get('cidade');

    if (estadoControl && cidadeControl) {
      // Disable cidade initially if estado is empty
      if (!estadoControl.value) {
        cidadeControl.disable();
      }

      this.cidades$ = estadoControl.valueChanges.pipe(
        startWith(''),
        tap(() => {
          this.resetarCidades();
          this.carregandoCidades$.next(true);
          cidadeControl.disable(); // Disable while loading
        }),
        switchMap((uf) => {
          if (uf) {
            return this.ibgeService.getCidadesNoEstado(uf).pipe(
              map((cidades) =>
                cidades.sort((a, b) => a.nome.localeCompare(b.nome))
              ),
              tap(() => {
                this.carregandoCidades$.next(false);
                cidadeControl.enable(); // Enable when loaded
              })
            );
          }
          this.carregandoCidades$.next(false);
          cidadeControl.disable(); // Keep disabled if no state selected
          return of([]);
        })
      );
    }
  }

  private resetarCidades(): void {
    this.dadosPessoaisForm.get('cidade')?.setValue('');
  }

  private salvarDadosInseridos(): void {
    const dadosInseridos = this.dadosPessoaisForm.value;
    this.cadastroService.atualizarDadosCadastro({
      nomeCompleto: dadosInseridos.nomeCompleto,
      estado: dadosInseridos.estado,
      cidade: dadosInseridos.cidade,
      email: dadosInseridos.email,
      senha: dadosInseridos.senha,
    });
  }
}

// estados = [
//   { sigla: 'AC', nome: 'Acre' },
//   { sigla: 'AL', nome: 'Alagoas' },
//   { sigla: 'AP', nome: 'Amapá' },
//   { sigla: 'AM', nome: 'Amazonas' },
//   { sigla: 'BA', nome: 'Bahia' },
//   { sigla: 'CE', nome: 'Ceará' },
//   { sigla: 'DF', nome: 'Distrito Federal' },
//   { sigla: 'ES', nome: 'Espírito Santo' },
//   { sigla: 'GO', nome: 'Goiás' },
//   { sigla: 'MA', nome: 'Maranhão' },
//   { sigla: 'MT', nome: 'Mato Grosso' },
//   { sigla: 'MS', nome: 'Mato Grosso do Sul' },
//   { sigla: 'MG', nome: 'Minas Gerais' },
//   { sigla: 'PA', nome: 'Pará' },
//   { sigla: 'PB', nome: 'Paraíba' },
//   { sigla: 'PR', nome: 'Paraná' },
//   { sigla: 'PE', nome: 'Pernambuco' },
//   { sigla: 'PI', nome: 'Piauí' },
//   { sigla: 'RJ', nome: 'Rio de Janeiro' },
//   { sigla: 'RN', nome: 'Rio Grande do Norte' },
//   { sigla: 'RS', nome: 'Rio Grande do Sul' },
//   { sigla: 'RO', nome: 'Rondônia' },
//   { sigla: 'RR', nome: 'Roraima' },
//   { sigla: 'SC', nome: 'Santa Catarina' },
//   { sigla: 'SP', nome: 'São Paulo' },
//   { sigla: 'SE', nome: 'Sergipe' },
//   { sigla: 'TO', nome: 'Tocantins' },
// ];
