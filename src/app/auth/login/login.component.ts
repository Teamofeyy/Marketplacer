import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import {TuiAppearance, TuiButton, TuiError, TuiTextfieldComponent, TuiTitle} from '@taiga-ui/core';
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
  styleUrl: './login.component.less'
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl(''),
  })

  onLogin() {
    this.authService.login({ login: this.login, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']).then();
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }

  constructor(private authService: AuthService, private router: Router) {}

}
