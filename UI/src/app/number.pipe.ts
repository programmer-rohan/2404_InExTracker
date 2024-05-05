import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number',
  standalone: true,
})
export class NumberPipe implements PipeTransform {
  transform(value: number): string {
    //912345678
    //1,23,45,678
    //876543219
    //91,23,45,678

    var valueToConvert = value.toString().split('').reverse().join('');
    var final = '';
    var count = 3;
    for (var i = 0; i < valueToConvert.length; i++) {
      var digit = valueToConvert.at(i);
      final = digit + final;
      count--;

      if (count == 0 && i < valueToConvert.length - 1) {
        final = ',' + final;
        count = 2;
      }
    }

    return '\u20B9' + final;
  }
}
