import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tgl'
})
export class TglPipe implements PipeTransform {
  bulan:any = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
  hari:any = ["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"]
  transform(value: any): any {
    if(!value) return null
    return this.hari[new Date(value).getDay()]+", "+new Date(value).getDate()+" "+this.bulan[new Date(value).getMonth()]+" "+new Date(value).getFullYear()
  }

}
