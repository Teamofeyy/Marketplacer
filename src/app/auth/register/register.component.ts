import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiAppearance, TuiButton, TuiTitle} from '@taiga-ui/core';
import {TuiCardLarge, TuiForm, TuiHeader} from '@taiga-ui/layout';
import {AuthInputsComponent} from '../../shared/components/auth-inputs/auth-inputs.component';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';

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
    TuiButton,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: '../../shared/styles/auth.less'
})
export class RegisterComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = new FormGroup({
    login: new FormControl<string | null>('', Validators.required),
    password: new FormControl<string | null>('', [Validators.required, Validators.minLength(6)]),
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
        this.router.navigate(['/auth/login']).then(() => {
          console.log('Registration successful! Please login.');
        });
      },
      error: (err) => {
        console.error('Registration failed:', err);
      }
    })
  }
}
