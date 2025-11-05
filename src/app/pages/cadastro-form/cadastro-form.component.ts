import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RadioOptionComponent } from '../../shared/components/radio-option/radio-option.component';

const MODULES = [CommonModule, ReactiveFormsModule];
const COMPONENTS = [RadioOptionComponent];

@Component({
  selector: 'app-cadastro-form',
  standalone: true,
  imports: [...MODULES, ...COMPONENTS],
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.scss'],
})
export class CadastroFormComponent implements OnInit {
  cadastroForm!: FormGroup;

  areasAtuacao = [
    { id: 'ti', value: 'ti', label: 'TI e Programação' },
    { id: 'design', value: 'design', label: 'Design e Multimídia' },
    { id: 'revisao', value: 'revisao', label: 'Revisão' },
    { id: 'traducao', value: 'traducao', label: 'Tradução' },
    { id: 'transcricao', value: 'transcricao', label: 'Transcrição' },
    { id: 'marketing', value: 'marketing', label: 'Marketing' },
  ];

  niveisExperiencia = [
    {
      id: 'iniciante',
      label: 'Iniciante',
      description: '(1 a 3 anos)',
    },
    {
      id: 'intermediario',
      label: 'Intermediário',
      description: '(3 a 6 anos)',
    },
    {
      id: 'avancado',
      label: 'Avançado',
      description: '(6 anos ou mais)',
    },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.cadastroForm = this.formBuilder.group({
      areasAtuacao: ['área de atuação', Validators.required],
      niveisExperiencia: ['nível de experiência', Validators.required],
    });
  }

  onNext() {}

  onAreaChange(area: string) {
    this.cadastroForm.get('areasAtuacao')?.setValue(area);
  }

  onNivelChange(nivel: string) {
    this.cadastroForm.get('niveisExperiencia')?.setValue(nivel);
  }
}
