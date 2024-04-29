import { NgModule } from '@angular/core';
import { UsernamePipe } from './pipe/username.pipe';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './directive/placeholder.directive';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { AlertComponent } from 'src/app/alert/alert.component';

@NgModule({
  declarations: [
    UsernamePipe,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    ConfirmComponent,
    AlertComponent,
  ],
  imports: [CommonModule],
  exports: [UsernamePipe, LoadingSpinnerComponent, PlaceholderDirective],
})
export class SharedModule {}
