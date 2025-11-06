import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { Habilidade } from '../../shared/models/habilidade.interface';
import { CadastroService } from '../../shared/services/cadastro.service';
import { ChipComponent } from '../../shared/components/chip/chip.component';
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
  fotoPreview!: string | ArrayBuffer | null;

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
  }

  inicializarFormulario(): void {
    this.perfilForm = this.formBuilder.group({
      foto: [''],
      resumo: [''],
      habilidadesSelecionadas: [[]],
      idiomas: this.formBuilder.array([]),
      portfolio: [''],
      linkedin: [''],
    });
  }

  onFotoSelecionada(event: Event) {
    const arquivo = (event?.target as HTMLInputElement)?.files?.[0];

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

  private salvarDadosInseridos(): void {
    const dadosInseridos = this.perfilForm.value;
    this.cadastroService.atualizarDadosCadastro({
      foto: this.fotoPreview,
      resumo: dadosInseridos.resumo,
      habilidadesSelecionadas: dadosInseridos.habilidadesSelecionadas,
      // idiomas: dadosInseridos.idiomas,
      idiomas: [],
      portfolio: dadosInseridos.portfolio,
      linkedin: dadosInseridos.linkedin,
    });
  }
}
