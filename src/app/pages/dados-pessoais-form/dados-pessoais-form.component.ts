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
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { CadastroService } from '../../shared/services/cadastro.service';

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

  estados = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' },
  ];

  cidades = [{ nome: 'São Paulo' }];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService
  ) {}

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = {
      validators: senhasIguaisValidator,
    };

    this.dadosPessoaisForm = this.formBuilder.group(
      {
        nomeCompleto: ['', Validators.required],
        estado: ['', Validators.required],
        cidade: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(8)]],
        repitaSenha: ['', Validators.required],
      },
      formOptions
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
