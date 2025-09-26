// guards/redirect-if-authenticated.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
// import { Observable } from 'rxjs';

@Injectable()
export class RedirectIfAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    if (request.session.user) {
      response.redirect('/todos');
      return false;
    }

    return true;
  }
}
