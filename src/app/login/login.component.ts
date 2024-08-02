import { Component } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
     private readonly userService : AuthServiceService ,
     private router: Router )
     { }
  
  email:string ='';
  password:string='';
  errorMessage:string='';

  async handleSubmit() {
    if (!this.email || !this.password) {
      this.showError("Email and password are required");
      return;
    }
    try {
      const response = await this.userService.login(this.email, this.password);
      console.log(response);
      if (response.statusCode === 200) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.router.navigate(['/calendar']);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error);
    }
  }
  showError(mess:string){
    this.errorMessage = mess;
    setTimeout(()=>{
      this.errorMessage = ''
    }, 3000)
  }

}
