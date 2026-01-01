import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
