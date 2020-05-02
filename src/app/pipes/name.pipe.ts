import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(name: string, numberOfPlayer: number): string {
    return name + ( numberOfPlayer !== 0 ? `(${numberOfPlayer})` : '' );
  }

}
