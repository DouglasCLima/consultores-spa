import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importe DatePipe
import { RouterLink } from '@angular/router';
import { Consultor } from '../../models/consultor';
import { ConsultorService } from '../../services/consultor.service';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-consultor-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FormsModule],
  templateUrl: './consultor-list.component.html',
  styleUrls: ['./consultor-list.component.scss']
})
export class ConsultorListComponent implements OnInit {
  consultores: Consultor[] = [];
  consultorService = inject(ConsultorService);
  authService = inject(AuthService);

  isAdmin$!: Observable<boolean>;

  // Variáveis de Estado para Busca/Filtro
  searchTerm: string = '';
  selectedEspecialidade: string = '';
  private searchSubject = new Subject<{ term: string, specialty: string }>();

  // Lista de especialidades para o filtro
  especialidades = [
    'Desenvolvimento Web',
    'Banco de Dados',
    'DevOps',
    'Cloud Computing',
    'Segurança da Informação'
  ];

  ngOnInit(): void {
    this.carregarConsultores();
    this.isAdmin$ = this.authService.isAdmin();

    // Configura a busca para reagir a mudanças no termo de busca OU no filtro
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) =>
        prev.term === curr.term && prev.specialty === curr.specialty
      )
    ).subscribe(({ term, specialty }) => {
      this.carregarConsultores(term, specialty);
    });
  }

  carregarConsultores(termo?: string, especialidade?: string): void {

    const termoFinal = [termo, especialidade]
        .filter(t => t && t.length > 0)
        .join(' ');

    this.consultorService.listar(termoFinal).subscribe({
      next: (data) => {
        this.consultores = data;
      },
      error: (err) => console.error('Erro ao carregar consultores:', err)
    });
  }

  //método unificado para disparar a busca em qualquer mudança
  triggerSearch(): void {
    this.searchSubject.next({
      term: this.searchTerm,
      specialty: this.selectedEspecialidade
    });
  }

  onDelete(id: number | undefined): void {
    if (id === undefined || !confirm('Tem certeza que deseja excluir este consultor?')) return;

    this.consultorService.excluir(id).subscribe({
      next: () => {
        alert('Consultor excluído com sucesso!');
        this.carregarConsultores(this.searchTerm, this.selectedEspecialidade); // Recarrega com os filtros atuais
      },
      error: (err) => console.error('Erro ao excluir:', err)
    });
  }
}
