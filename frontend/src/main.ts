// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app';
// import { provideRouter } from '@angular/router';
// import { routes } from './app/app.routes';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { TokenInterceptor } from './app/interceptors/token-interceptor';



// const { providers: appConfigProviders, ...otherAppConfig } = appConfig;


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     importProvidersFrom(HttpClientModule),
//     provideHttpClient(withInterceptorsFromDi()),
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: TokenInterceptor,
//       multi: true
//     }
//   ]
// });
  

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
