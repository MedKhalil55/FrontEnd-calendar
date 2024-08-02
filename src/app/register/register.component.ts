import { Component } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formData: any = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: '',
    
  };
  errorMessage: string = '';

  constructor(
    private readonly userService: AuthServiceService,
    private readonly router: Router
  ) { }

  async handleSubmit() {


    // Check if all fields are not empty
    if (!this.formData.firstname || !this.formData.lastname  || !this.formData.email || !this.formData.password || !this.formData.role ) {
      this.showError('Please fill in all fields.');
      return;
    }

    // Confirm registration with user
    const confirmRegistration = confirm('Are you sure you want to register this user?');
    if (!confirmRegistration) {
      return;
    }

    try {
      console.log(this.formData);
      const response = await this.userService.register(this.formData);
      console.log(response);

      if (response.statusCode === 200) {
        localStorage.setItem('token',response.token)
        localStorage.setItem('role',response.role)
        this.router.navigate(['/calendar']);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; // Clear the error message after the specified duration
    }, 3000);
  }

}
