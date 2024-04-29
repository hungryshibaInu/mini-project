import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../../app/auth/user.model';

export interface IAuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http
      .post<IAuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDHKhqKYODrMeGDSoZEAyuC6VbUnrsjYlw',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.idToken,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<IAuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDHKhqKYODrMeGDSoZEAyuC6VbUnrsjYlw',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.idToken,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDuaration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuaration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuaration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuaration);
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(err: HttpErrorResponse) {
    let errMessage = 'An unknown error occured!';
    if (!err.error || !err.error.error) {
      return throwError(errMessage);
    }

    switch (err.error.error.message) {
      case 'EMAIL_EXISTS': {
        errMessage = 'This email is already exists!';
        break;
      }

      case 'TOO_MANY_ATTEMPTS_TRY_LATER': {
        errMessage = 'Too many attempt, please try again later';
        break;
      }

      case 'EMAIL_NOT_FOUND': {
        errMessage = 'Email or password is invalid';
        break;
      }
      case 'INVALID_PASSWORD': {
        errMessage = 'Email or password is invalid';
      }
      case 'INVALID_LOGIN_CREDENTIALS': {
        errMessage = 'Email or password is invalid';
      }
    }
    return throwError(errMessage);
  }
}
