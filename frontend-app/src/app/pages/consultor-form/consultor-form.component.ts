// src/app/pages/consultor-form/consultor-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultorService } from '../../services/consultor.service';
import { Consultor } from '../../models/consultor';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-consultor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './consultor-form.component.html',
  styleUrls: ['./consultor-form.component.scss']
})
export class ConsultorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private consultorService = inject(ConsultorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  consultorForm!: FormGroup;
  isEditMode: boolean = false;
  consultorId: number | null = null;

  ngOnInit(): void {
    this.initializeForm();

    // Lógica para verificar o modo de Edição/Criação
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.consultorId = +id; // Converte string para number
          return this.consultorService.buscarPorId(this.consultorId);
        }
        return of(null);
      })
    ).subscribe(consultor => {
      if (consultor) {
        this.consultorForm.patchValue(consultor); // Preenche o formulário com dados existentes
      }
    });
  }

  initializeForm(): void {
    this.consultorForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      areaEspecializacao: ['', Validators.required]
      // dataCadastro e id são gerenciados pelo backend e pela lógica
    });
  }

  onSubmit(): void {
    if (this.consultorForm.invalid) return;

    const dados: Consultor = this.consultorForm.value;
    let operation: Observable<any>;

    if (this.isEditMode && this.consultorId !== null) {
      // Atualização (PUT)
      operation = this.consultorService.atualizar(this.consultorId, dados);
    } else {
      // Criação (POST)
      operation = this.consultorService.criar(dados);
    }

    operation.subscribe({
      next: () => {
        alert(`Consultor ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.router.navigate(['/consultores']); // Redireciona para a lista
      },
      error: (err) => console.error('Erro na operação:', err)
    });
  }
}
