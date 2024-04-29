import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from 'src/shared/directive/placeholder.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mini-project';

  userSub: Subscription;
  dialogSub: Subscription;
  email: string = '';
  isAuthenticated: boolean = true;
  fromAuth: boolean = false;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  constructor(
    private authService: AuthService,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.authService.autoLogin();

    this.userSub = this.authService.user.subscribe((res) => {
      if (res) {
        this.email = res.email;
        this.showAlert(this.email);
      }

      this.isAuthenticated = !!res;
    });
  }

  onCloseAlert() {
    this.fromAuth = null;
  }

  onLogout() {
    this.authService.logout();
  }

  private showAlert(email: string) {
    const alertCmpFactory =
      this.resolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.email = this.email;
    this.dialogSub = componentRef.instance.close.subscribe(() => {
      this.dialogSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();

    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }
}
