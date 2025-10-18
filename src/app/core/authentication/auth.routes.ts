import { Routes } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';



export default [
    { path: 'access', component: AccessDeniedComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },


] as Routes;
