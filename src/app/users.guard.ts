import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from './service/auth-service.service';
import { inject} from '@angular/core';


export const usersGuard: CanActivateFn = (route, state) => {
  if(inject(AuthServiceService).isAuthenticated()) {
      return true;
  }
  else{
    inject(Router).navigate(['/login'])
    return false;
  }
};


