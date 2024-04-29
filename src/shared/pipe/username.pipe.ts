import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'username',
})
export class UsernamePipe implements PipeTransform {
  transform(value: any) {
    return value.replace(/@[^@]+$/, '');
  }
}
