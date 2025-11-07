import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { Habilidade } from '../../shared/models/habilidade.interface';
import { CadastroService } from '../../shared/services/cadastro.service';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { Idioma } from '../../shared/models/idioma.interface';
// import { ChipComponent } from '../../shared/components/chip/chip.component';

@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ChipComponent],
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss'],
})
export class PerfilFormComponent implements OnInit {
  perfilForm!: FormGroup;
  fotoPreview: string | ArrayBuffer | null = null;
  caracteresRestantes: number = 70;

  habilidades: Habilidade[] = [
    { nome: 'Fullstack', selecionada: false },
    { nome: 'Front-end', selecionada: false },
    { nome: 'React', selecionada: false },
    { nome: 'Angular', selecionada: false },
  ];

  niveisIdioma: string[] = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Fluente',
    'Nativo',
  ];

  idiomas: string[] = ['Português', 'Inglês', 'Espanhol'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.perfilForm.get('resumo')?.valueChanges.subscribe((resumo: string) => {
      this.caracteresRestantes = 70 - resumo.length;
    });
  }

  inicializarFormulario(): void {
    this.perfilForm = this.formBuilder.group({
      foto: [''],
      resumo: ['', [Validators.required, Validators.minLength(10)]],
      habilidadesSelecionadas: [[], Validators.required],
      idiomas: this.formBuilder.array([]),
      portfolio: ['', [Validators.required, Validators.pattern('https?://.+')]],
      linkedin: [
        '',
        [
          Validators.required,
          Validators.pattern('https://(www\\.)?linkedin\\.com/.+'),
        ],
      ],
    });

    this.adicionarIdioma('Português', 'Nativo');
  }

  onFotoSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const arquivo = input?.files?.[0];

    // onFotoSelecionada(event: Event & { target: HTMLInputElement }) {
    //   const arquivo = event.target.files?.[0];

    if (arquivo) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result;
        this.perfilForm.patchValue({ foto: reader.result });
      };
      reader.readAsDataURL(arquivo);
    }
  }

  onAnterior(): void {
    this.salvarDadosInseridos();
    this.router.navigate(['/cadastro/dados-pessoais']);
  }

  onProximo(): void {
    if (this.perfilForm.valid) {
      this.salvarDadosInseridos();
      this.router.navigate(['/cadastro/confirmacao']);
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }

  toggleHabilidade(habilidade: Habilidade): void {
    habilidade.selecionada = !habilidade.selecionada;

    const habilidadesSelecionadas = this.habilidades
      .filter((habilidade) => habilidade.selecionada)
      .map((habilidade) => habilidade.nome);

    this.perfilForm.patchValue({ habilidadesSelecionadas });
  }

  get idiomasArray(): FormArray {
    return this.perfilForm.get('idiomas') as FormArray;
  }

  adicionarIdioma(nome: string = '', nivel: string = ''): void {
    const idiomaForm = this.formBuilder.group({
      nome: [nome, Validators.required],
      nivel: [nivel, Validators.required],
    });

    this.idiomasArray.push(idiomaForm);
  }

  removerIdioma(i: number) {
    if (i === 0 && this.idiomasArray.at(0).get('nome')?.value === 'Português') {
      return;
    }
    this.idiomasArray.removeAt(i);
  }

  private extrairIdiomas(): Idioma[] {
    return this.idiomasArray.controls.map((controle) => {
      return {
        nome: controle.get('nome')?.value,
        nivel: controle.get('nivel')?.value,
      };
    });
  }

  private salvarDadosInseridos(): void {
    const dadosInseridos = this.perfilForm.value;
    this.cadastroService.atualizarDadosCadastro({
      foto: this.fotoPreview,
      resumo: dadosInseridos.resumo,
      habilidadesSelecionadas: dadosInseridos.habilidadesSelecionadas,
      // idiomas: dadosInseridos.idiomas,
      idiomas: this.extrairIdiomas(),
      portfolio: dadosInseridos.portfolio,
      linkedin: dadosInseridos.linkedin,
    });
  }
}
