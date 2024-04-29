import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  @Input() name: string;
  @Output() close = new EventEmitter<boolean>();

  onClose(confirm: boolean) {
    console.log('confirm', confirm);
    
    this.close.emit(confirm);
  }
}
