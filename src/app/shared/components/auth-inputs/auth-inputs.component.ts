import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TuiError, TuiTextfield} from '@taiga-ui/core';
import {TuiFieldErrorPipe} from '@taiga-ui/kit';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-auth-inputs',
  standalone: true,
  imports: [
    TuiTextfield,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './auth-inputs.component.html',
  styleUrl: './auth-inputs.component.less'
})
export class AuthInputsComponent {
  @Input() formGroup!: FormGroup;
}
