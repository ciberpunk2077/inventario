// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],  // 👈 Importa NgIf y FormsModule
  templateUrl: './login.html',
  styleUrl: './login.css',
  })


export class LoginComponent {

  credenciales = {
    username: '',
    password: ''
  };
   
  loading = false;
  error = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.error = '';

    this.loginService.login(this.credenciales).subscribe({
      next: (res) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);

        // 🔥 AQUÍ ENTRAS AL SISTEMA
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      }
    });
  }
}