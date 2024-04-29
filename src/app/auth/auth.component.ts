import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuthService,
  IAuthResponseData,
} from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  @Output() fromAuth = new EventEmitter<boolean>();

  authForm: FormGroup;
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errMessage: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
  }

  onClickSubmit() {
    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.get('email')?.value;
    const password = this.authForm.get('password')?.value;

    let authObs: Observable<IAuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.auth.login(email, password);
    } else {
      authObs = this.auth.signUp(email, password);
    }

    authObs.subscribe(
      (res) => {
        this.errMessage = '';
        this.isLoading = false;

        this.fromAuth.emit(true);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errMessage = error;
        this.isLoading = false;
      }
    );
    this.authForm.reset();
  }
}
