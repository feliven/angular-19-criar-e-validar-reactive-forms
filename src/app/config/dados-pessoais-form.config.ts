import { Validators } from '@angular/forms';

import { ConfiguracaoDeFormulario } from '../shared/models/configurar-formulario.interface';
import { cpfValidator } from '../shared/validators/cpf.validator';
import { senhasIguaisValidator } from '../pages/dados-pessoais-form/dados-pessoais-form.component';
import { emailExisteValidator } from '../shared/validators/emailExiste.validator';

export function getDadosPessoaisFormConfig(
  emailService: any
): ConfiguracaoDeFormulario {
  return {
    titulo: 'Crie seu cadastro',
    descricao:
      'Crie seu perfil gratuitamente para começar a trabalhar com os melhores freelancers. Em seguida, você poderá dar mais detalhes sobre suas demandas e sobre sua forma de trabalho.',
    campos: [
      {
        label: 'Nome Completo',
        formControlName: 'nomeCompleto',
        type: 'text',
        required: true,
        placeholder: '',
        errorMessages: { required: 'Nome completo é obrigatório' },
        validators: [Validators.required],
        asyncValidators: [],
        width: 'full',
      },
      {
        label: 'CPF',
        formControlName: 'cpf',
        type: 'text',
        required: true,
        placeholder: '123.456.789-00',
        errorMessages: {
          required: 'CPF é obrigatório',
          cpfInvalido: 'CPF inválido',
        },
        validators: [Validators.required, cpfValidator],
        asyncValidators: [],
        width: 'full',
      },
      {
        label: 'Estado',
        formControlName: 'estado',
        type: 'select',
        required: true,
        placeholder: 'Selecione',
        errorMessages: {
          required: 'Estado é obrigatório',
        },
        validators: [Validators.required],
        asyncValidators: [],
        width: 'half',
      },
      {
        label: 'Cidade',
        formControlName: 'cidade',
        type: 'select',
        required: true,
        placeholder: 'Selecione',
        errorMessages: {
          required: 'Cidade é obrigatória',
        },
        validators: [Validators.required],
        asyncValidators: [],
        width: 'half',
      },
      {
        label: 'Email',
        formControlName: 'email',
        type: 'email',
        required: true,
        placeholder: '',
        errorMessages: {
          required: 'Email é obrigatório',
          email: 'Email inválido',
          emailExiste: 'Email já cadastrado!',
        },
        validators: [Validators.required, Validators.email],
        asyncValidators: [emailExisteValidator(emailService)],
        width: 'full',
      },
      {
        label: 'Senha',
        formControlName: 'senha',
        type: 'password',
        required: true,
        placeholder: '',
        errorMessages: {
          required: 'Senha é obrigatória',
          minlength: 'Senha deve ter pelo menos 6 caracteres',
        },
        validators: [Validators.required, Validators.minLength(6)],
        asyncValidators: [],
        width: 'half',
      },
      {
        label: 'Repita a senha',
        formControlName: 'repitaSenha',
        type: 'password',
        required: true,
        placeholder: '',
        errorMessages: {
          required: 'Confirmação de senha é obrigatória',
          senhasSaoDiferentes: 'As senhas não coincidem',
        },
        validators: [Validators.required, senhasIguaisValidator],
        asyncValidators: [],
        width: 'half',
      },
    ],
  };
}
