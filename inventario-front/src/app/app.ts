// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { LayoutComponent } from './layout/layout';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [LayoutComponent],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class AppComponent {
//   protected readonly title = signal('inventario-front');
// }

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class AppComponent {}

