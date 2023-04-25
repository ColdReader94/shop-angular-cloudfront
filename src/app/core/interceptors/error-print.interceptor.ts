import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        // eslint-disable-next-line rxjs/no-implicit-any-catch
        error: (e: any) => {
          const url = new URL(request.url);
          if (e?.status === 401) {
            alert(
              `Authorization error has been occured: ${e.status}. Unauthorized. Reason: no data for authorization was provided`
            );
          }
          if (e?.status === 403) {
            alert(
              `Identification error has been occured. ${e.status}. Forbidden. Reason: wrong credentials was provided`
            );
          }

          this.notificationService.showError(
            `Request to "${url.pathname}" failed. Check the console for the details`,
            0
          );
        },
      })
    );
  }
}
