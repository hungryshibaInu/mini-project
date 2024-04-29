import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ISnackList {
  name: string | any;
  imgUrl: string | any;
  id?: string | any;
  cal: number | any;
  rarity: number | any;
  desc: string | any;
}

export interface IGeneralInfo {
  coffee: string;
  openHr: string;
  refillRound: string;
}

@Injectable({
  providedIn: 'root',
})
export class WikiService {
  snackList = new Subject<any[]>();
  private snackListTemp: any[];

  snack = new Subject<any>();
  private snackTemp: any;

  generalInfo = new Subject<any>();

  constructor(private http: HttpClient) {}

  getSnackList() {
    return this.http
      .get(
        'https://firestore.googleapis.com/v1/projects/srs-pantry-wiki/databases/(default)/documents/item'
      )
      .subscribe((res) => {
        let resData = [];
        res['documents'].forEach((item) => {
          resData.push({
            ...item['fields'],
            id: item['name'].split('/').pop(),
          });
        });

        this.snackListTemp = resData;
        this.snackList.next(this.snackListTemp);
      });
  }

  getSnackItem(id: string) {
    return this.http
      .get(
        `https://firestore.googleapis.com/v1/projects/srs-pantry-wiki/databases/(default)/documents/item/${id}`
      )
      .subscribe((res) => {
        this.snackTemp = res;
        this.snack.next(this.snackTemp);
      });
  }

  getGeneralInfo() {
    return this.http
      .get(
        'https://firestore.googleapis.com/v1/projects/srs-pantry-wiki/databases/(default)/documents/general/generalInfo'
      )
      .subscribe((res) => {
        this.generalInfo.next(res);
      });
  }

  deleteSnackItem(id: string) {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/srs-pantry-wiki/databases/(default)/documents/item/${id}`;

    this.http.delete(apiUrl).subscribe(
      () => {
        console.log('Document deleted.');
      },
      (error) => {
        console.error('Error deleting document:', error);
      }
    );
  }

  postSnackItem(data: ISnackList) {
    const apiUrl =
      'https://firestore.googleapis.com/v1/projects/srs-pantry-wiki/databases/(default)/documents/item';
    const postData = {
      name: '',
      fields: {
        ...data,
      },
      createTime: new Date(),
      updateTime: new Date(),
    };

    this.http.post(apiUrl, postData).subscribe(
      () => {
        this.getSnackList();
      },
      (error) => {
        console.error('Error creating document:', error);
      }
    );
  }

  patchSnackItem(data: ISnackList, id: string) {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/srs-pantry-wiki/databases/(default)/documents/item/${id}`;

    const postData = {
      name: '',
      fields: {
        ...data,
      },
      createTime: new Date(),
      updateTime: new Date(),
    };

    this.http.patch(apiUrl, postData).subscribe(
      (res) => {
        this.snack.next(res);
      },
      (error) => {
        console.error('Error creating document:', error);
      }
    );
  }
}
