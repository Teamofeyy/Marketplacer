import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';


@NgModule({
  declarations: [],
  imports: [
    RegisterComponent,
    LoginComponent,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
