import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ISnackList } from 'src/shared/services/wiki.service';

@Component({
  selector: 'app-add-snack',
  templateUrl: './add-snack.component.html',
  styleUrls: ['./add-snack.component.scss'],
})
export class AddSnackComponent {
  addSnackForm: FormGroup;

  @Output() close = new EventEmitter<ISnackList | boolean>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.addSnackForm = this.fb.group({
      name: [''],
      imgUrl: [''],
      cal: [''],
      rarity: [''],
      desc: [''],
    });
  }

  onSubmit() {
    let data = {
      name: { stringValue: this.addSnackForm.controls['name']?.value },
      imgUrl: { stringValue: this.addSnackForm.controls['imgUrl']?.value },
      cal: { integerValue: this.addSnackForm.controls['cal']?.value },
      rarity: { integerValue: this.addSnackForm.controls['rarity']?.value },
      desc: { stringValue: this.addSnackForm.controls['desc']?.value },
    };
    console.log('confirm', data, this.addSnackForm.value);

    this.close.emit(data);
  }

  onClose() {
    this.close.emit(false);
  }
}
