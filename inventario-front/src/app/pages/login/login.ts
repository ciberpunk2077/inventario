// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
// })
// export class LoginComponent {

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/movimientos']);
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}

