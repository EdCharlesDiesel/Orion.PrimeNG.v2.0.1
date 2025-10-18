import { Routes } from '@angular/router';
import { RegisterComponent } from '../authentication/register/register.component';
import { AccessDeniedComponent } from '../authentication/access-denied/access-denied.component';
import { ErrorComponent } from '../authentication/error/error.component';
import { LoginComponent } from '../authentication/login/login.component';
import { ProfileComponent } from '../authentication/profile/profile.component';


export default [
    { path: 'access', component: AccessDeniedComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },


] as Routes;
