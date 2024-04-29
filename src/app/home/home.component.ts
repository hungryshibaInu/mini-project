import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ISnackList, WikiService } from 'src/shared/services/wiki.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  newItem: ISnackList;
  isLoading: boolean;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private wikiService: WikiService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.wikiService.getSnackList();
    this.wikiService.snackList.subscribe((res) => {
      this.newItem = res[res.length - 1];
      this.isLoading = false;
      console.log('res', this.newItem);
    });
  }
}
