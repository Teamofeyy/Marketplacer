import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiAppearance, TuiButton, TuiError, TuiTextfieldComponent, TuiTitle} from '@taiga-ui/core';
import {TuiCardLarge, TuiForm, TuiHeader} from '@taiga-ui/layout';
import {TuiFieldErrorPipe} from '@taiga-ui/kit';
import {AuthInputsComponent} from '../../shared/components/auth-inputs/auth-inputs.component';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

interface RegisterFormValue {
  login: string;
  password: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiAppearance,
    TuiCardLarge,
    AuthInputsComponent,
    TuiHeader,
    TuiTitle,
    TuiForm,
    TuiButton
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = new FormGroup({
    login: new FormControl<string | null>('', Validators.required),
    password: new FormControl<string | null>('', Validators.minLength(6)),
  })

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const login = this.registerForm.get('login')?.value as string;
    const password = this.registerForm.get('password')?.value as string;

    this.authService.register({
      login: login,
      password: password,
      role_id: 1
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']).then();
      },
      error: (err) => {
        console.error('Registration failed:', err);
      }
    })
  }
}
