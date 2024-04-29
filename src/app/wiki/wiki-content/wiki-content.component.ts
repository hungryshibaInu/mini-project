import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { PlaceholderDirective } from 'src/shared/directive/placeholder.directive';
import { WikiService } from 'src/shared/services/wiki.service';

@Component({
  selector: 'app-wiki-content',
  templateUrl: './wiki-content.component.html',
  styleUrls: ['./wiki-content.component.scss'],
})
export class WikiContentComponent {
  snackDetail: any;
  id: string;
  editMode: boolean = false;
  dialogSub: Subscription;
  isConfirmDelete: boolean;
  snackEditForm: FormGroup;

  @ViewChild(PlaceholderDirective, { static: false })
  confirmDelete: PlaceholderDirective;

  constructor(
    private router: Router,
    private wikiService: WikiService,
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private fb: FormBuilder
  ) {
    this.id = this.route.snapshot.queryParams['id'];
  }

  ngOnInit() {
    this.onGetSnack(this.id);

    this.snackEditForm = this.fb.group({
      rarity: [this.snackDetail?.rarity.integerValue],
      cal: [this.snackDetail?.cal.integerValue],
      desc: [this.snackDetail?.desc.stringValue],
      imgUrl: [this.snackDetail?.imgUrl.stringValue],
    });

    console.log(this.snackEditForm.value);
  }

  onGetSnack(id: string) {
    this.wikiService.getSnackItem(id);
    this.wikiService.snack.subscribe((res) => {
      this.snackDetail = res.fields;
      this.snackEditForm.setValue({
        rarity: this.snackDetail?.rarity.integerValue,
        cal: this.snackDetail?.cal.integerValue,
        desc: this.snackDetail?.desc.stringValue,
        imgUrl: this.snackDetail?.imgUrl.stringValue,
      });
    });
  }

  onDeleteSnack() {
    this.showAlert(this.snackDetail?.name.stringValue);
  }

  private showAlert(name: string) {
    const alertCmpFactory =
      this.resolver.resolveComponentFactory(ConfirmComponent);

    const hostViewContainerRef = this.confirmDelete.viewContainerRef;

    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.name = name;
    this.dialogSub = componentRef.instance.close.subscribe((res: boolean) => {
      if (res) {
        this.wikiService.deleteSnackItem(this.id);
        this.wikiService.getSnackList();
        this.onClickBack();
      }
      this.dialogSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  onSubmit() {
    let data = {
      name: { stringValue: this.snackDetail?.name.stringValue },
      cal: { integerValue: this.snackEditForm.controls['cal']?.value },
      rarity: { integerValue: this.snackEditForm.controls['rarity']?.value },
      desc: { stringValue: this.snackEditForm.controls['desc']?.value },
      imgUrl: { stringValue: this.snackEditForm.controls['imgUrl']?.value },
    };

    this.wikiService.patchSnackItem(data, this.id);
    this.editMode = false;
  }

  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }

  onClickBack() {
    this.router.navigate(['wiki']);
  }
}
