import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TuiAppearance, TuiButton, TuiTitle} from '@taiga-ui/core';
import {TuiCardLarge, TuiForm, TuiHeader} from '@taiga-ui/layout';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {AuthInputsComponent} from '../../shared/components/auth-inputs/auth-inputs.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TuiAppearance,
    TuiCardLarge,
    ReactiveFormsModule,
    RouterModule,
    AuthInputsComponent,
    TuiHeader,
    TuiTitle,
    TuiButton,
    TuiForm
  ],
  templateUrl: './login.component.html',
  styleUrl: '../../shared/styles/auth.less'
})
export class LoginComponent {
  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.value;

    this.authService.login({
      login: formValue.login || '',
      password: formValue.password || ''
    }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']).then();
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }
}
