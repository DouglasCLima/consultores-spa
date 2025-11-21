// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  public user$: Observable<User | null> = user(this.auth);

  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  logout() {
    return signOut(this.auth).then(() => this.router.navigate(['/login']));
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.user$.subscribe(user => {
        observer.next(!!user);
      });
    });
  }
  private readonly roles: { [email: string]: 'admin' | 'user' } = {
  'admin@empresa.com': 'admin',
  'user@empresa.com': 'user'
};

  private getRoleByEmail(email: string | null): 'admin' | 'user' | null {
    if (!email) return null;
    return this.roles[email] || 'user'; // Padrão é 'user' se não mapeado
  }

  public getUserRole(): Observable<'admin' | 'user' | null> {
    return this.user$.pipe(
      map(user => {
        if (user && user.email) {
          return this.getRoleByEmail(user.email);
        }
        return null;
      })
    );
  }

  public isAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(
      map(role => role === 'admin')
    );
  }
}
