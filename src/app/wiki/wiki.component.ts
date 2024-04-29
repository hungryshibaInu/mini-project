import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlaceholderDirective } from 'src/shared/directive/placeholder.directive';
import {
  IGeneralInfo,
  ISnackList,
  WikiService,
} from 'src/shared/services/wiki.service';
import { AddSnackComponent } from '../add-snack/add-snack.component';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss'],
})
export class WikiComponent {
  snacks: ISnackList[];
  generalInfo: IGeneralInfo;
  dialogSub: Subscription;

  @ViewChild(PlaceholderDirective, { static: false })
  confirmAdd: PlaceholderDirective;

  constructor(
    private router: Router,
    private wikiService: WikiService,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.onGetSnackList();
    this.onGetGeneralInfo();
  }

  onGetSnackList() {
    this.wikiService.getSnackList();
    this.wikiService.snackList.subscribe((res) => {
      this.snacks = res;
    });
  }

  onClickSnack(id: string) {
    this.router.navigate(['wiki', 'snack-content'], {
      queryParams: { id: id },
    });
  }

  onGetGeneralInfo() {
    this.wikiService.getGeneralInfo();
    this.wikiService.generalInfo.subscribe((res) => {
      this.generalInfo = res;
    });
  }

  onAddSnack() {
    this.showAlert();
  }

  private showAlert() {
    const alertCmpFactory =
      this.resolver.resolveComponentFactory(AddSnackComponent);

    const hostViewContainerRef = this.confirmAdd.viewContainerRef;

    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    this.dialogSub = componentRef.instance.close.subscribe(
      (res: ISnackList) => {
        if (res) {
          this.wikiService.postSnackItem(res);
        }

        this.dialogSub.unsubscribe();
        hostViewContainerRef.clear();
      }
    );
  }

  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }
}
