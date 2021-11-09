import { Component, OnInit,HostListener } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'sekolah';
  jadwal:any = {}
  kelas:number = localStorage.getItem('kelas') ? Number(localStorage.getItem('kelas')) : 7
  sesi:string
  jatahUjian:boolean
  token:string = "************"
  tokenMasuk:string
  closeUjian:boolean = false
  allJadwal:any
  lihatJadwal:boolean = false
  cekToken:boolean = false
  pesan:string
  warna:string
  sedangUjian:boolean = false
  detik:number = 0
  menit:number = 0
  width:string
  nyontek:number = 0
  tersisaWaktu:boolean = false
  peringatanSisa:string
  urlSoal:string
  domHtml:string
  mapelAgama:string = localStorage.getItem("agama") ? localStorage.getItem("agama") : undefined
  namaAgama:string = ""
  getToken:boolean = false
  boxToken:boolean = false
  passwordToken:string
  speed:number = 1000
  klompok:any = ["A","B"]
  constructor(private _data:DataService){}
  
  ngOnInit(){
    // console.log("hallo angular")
    this.loadJson()
    if(localStorage.getItem("?")){
      this.sedangUjian = true
      this.timer(this.jadwal.durasi,this.speed)
    }else{
      this.sedangUjian = false
    }
    // console.log(new Date(localStorage.getItem('tgl')).getDate())
  }



  @HostListener("document:mouseleave") outClickHandler() {
    if(localStorage.getItem("?")){
      this.nyontek++
      console.log( "outside click");
    }
    
  }
  @HostListener("document:visibilitychange") onchange() {
    if(localStorage.getItem("?")){
      console.log( "keluar window");
      this.nyontek++
    }
    
  }

 

  
  
  mulai(){  
    // console.log(this.jadwal.durasi)
    if(this.token == this.tokenMasuk){
      this.cekToken = true
      if(this.jadwal.mapel == "Agama" && this.mapelAgama == undefined){
        this.pesan = "Pilih agama dulu .."
        this.warna = "red"
        setTimeout(()=>{
          this.cekToken = false
        },2000)
      }else{
        if(this.mapelAgama != undefined){
          localStorage.setItem("agama",this.mapelAgama)
        }
        this.pesan = "Token benar .."
        this.warna = "green"
        localStorage.setItem("?","!@#$%^&*")
        localStorage.setItem("menit",Number(this.jadwal.durasi - 1).toString())
        localStorage.setItem("durasi",this.jadwal.durasi)
        localStorage.setItem("kelas",this.kelas.toString())
        localStorage.setItem("tgl",new Date().toString())
        setTimeout(()=>{
          this.sedangUjian = true
          setTimeout(()=>{
            this.timer(this.jadwal.durasi,this.speed)
          },2000)
        },2000)
      }
    }else{
      this.cekToken = true
      this.pesan = "Token salah ..!"
      this.warna = "red"
      setTimeout(()=>{
        this.cekToken = false
      },1000)
    }
  }

  formatData(data:any){
    return new Promise((resolve,reject)=>{
      let newD = []
      this.sortData(data).forEach((val,key)=>{
      let inewD = newD.findIndex((a)=>{return a.jadwal == val.jadwal})
        if(inewD == -1){
          newD.push(val)
        }else{
          delete val.jadwal
          newD.push(val)
        }
        if(key == data.length-1){
          this.allJadwal = newD
          resolve(newD)
        }
      })
    })
  }

  loadJson(){
    this._data.getData().subscribe((data:any)=>{
      // console.log(data)
      let tgls = Number(new Date().getMonth()+1)+"-"+new Date().getDate()+"-"+new Date().getFullYear();
      let datas = []
      this.formatData(data).then((dataFormat:any)=>{
          let index = dataFormat.findIndex((a)=>{return a.jadwal == tgls})
          
          // console.log(dataFilter.length)
          if(index != -1){
            datas.push(dataFormat[index])
            if(dataFormat[index+1] != undefined && dataFormat[index+1].jadwal == undefined ){
              datas.push(dataFormat[index+1])
            }
            this.getSesi(datas)
            // console.log(dataFormat[index+1])
            // console.log(dataFormat[index].jadwal)
            // console.log(dataFormat[index+1].jadwal)
          }else{
            this.closeUjian = true
          }

          if(new Date(localStorage.getItem('tgl')).getDate() != new Date().getDate()){
            localStorage.clear()
          }
      
      })
    })
  }

  getSesi(data:any){
        // console.log(data[0].durasi)
        if(data[0].mapel == "Agama"){
          this.namaAgama = data[0].kelas[this.kelas].agama[this.mapelAgama]
          
        }
        let jamSesi3,jamSesi4,menitSesi3,menitSesi4;
        let jam = new Date().getHours();
        let menit = new Date().getMinutes();
        
        
        let jamSesi1 = data[0].sesi[0].jam.split(':')[0]
        let menitSesi1 = data[0].sesi[0].jam.split(':')[1]
        let jamSesi2 = data[0].sesi[1].jam.split(':')[0]
        let menitSesi2 = data[0].sesi[1].jam.split(':')[1]
        
        if(data[1] != undefined){
          jamSesi3 = data[1].sesi[0].jam.split(':')[0]
          menitSesi3 = data[1].sesi[0].jam.split(':')[1]
          jamSesi4 = data[1].sesi[1].jam.split(':')[0]
          menitSesi4 = data[1].sesi[1].jam.split(':')[1]
        }
        
        if(jam <= Number(jamSesi1) + 1){
          this.jadwal = data[0]
          this.sesi = 'Kelompok A, pukul '+data[0].sesi[0].jam
          this.jatahUjian = true
          this.closeUjian = false
          console.log("sesi 1")
        }else if(jam <= Number(jamSesi2) + 1){
          this.jadwal = data[0]
          this.sesi = 'Kelompok B, pukul '+data[0].sesi[1].jam
          this.jatahUjian = true
          this.closeUjian = false
          console.log("sesi 2")
        }else if(jam <= Number(jamSesi3) + 1 && data[1] != undefined){
          this.jadwal = data[1]
          this.sesi = 'Kelompok A, pukul '+data[1].sesi[0].jam
          this.jatahUjian = true
          this.closeUjian = false
          console.log("sesi 3")
        }else if(jam <= Number(jamSesi4) + 1 && data[1] != undefined){
          this.jadwal = data[1]
          this.sesi = 'Kelompok B, pukul '+data[1].sesi[1].jam
          this.jatahUjian = true
          this.closeUjian = false
          console.log("sesi 4")
        }else if(jam > Number(jamSesi2)+2 && data[1] == undefined){
          this.closeUjian = true
        }else if(jam > Number(jamSesi4)+2 && data[1] != undefined ){
          this.closeUjian = true
        }else{
          // this.sesi = '2, pukul '+data[0].sesi[1].jam
          this.jatahUjian = false
          console.log(jam)
          console.log(Number(jamSesi2) + 1)
          this.closeUjian = true
        }
        
        if(jam == jamSesi1 && menit >= menitSesi1 - 5){
          this.sesi = "Kelompok A di mulai"
          this.jadwal = data[0]
          this.token = data[0].kelas[this.kelas].token[0]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[0].kelas[this.kelas].link+"/viewform?embedded=true"
        }else if(jam == Number(jamSesi1) + 1){
          this.sesi = "Kelompok A di mulai"
          this.jadwal = data[0]
          this.token = data[0].kelas[this.kelas].token[0]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[0].kelas[this.kelas].link+"/viewform?embedded=true"
        }

        if(jam == jamSesi2 && menit >= menitSesi2 - 5){
          this.sesi = "Kelompok B di mulai"
          this.jadwal = data[0]
          this.token = data[0].kelas[this.kelas].token[1]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[0].kelas[this.kelas].link+"/viewform?embedded=true"
        }else if(jam == Number(jamSesi2) + 1 ){
          this.sesi = "Kelompok B di mulai"
          this.jadwal = data[0]
          this.token = data[0].kelas[this.kelas].token[1]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[0].kelas[this.kelas].link+"/viewform?embedded=true"
        }

        if(jam == jamSesi3 && menit >= menitSesi3 - 5 && data[1] != undefined){
          this.sesi = "Kelompok A di mulai"
          this.jadwal = data[1]
          this.token = data[1].kelas[this.kelas].token[0]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[1].kelas[this.kelas].link+"/viewform?embedded=true"
        }else if(jam == Number(jamSesi3) + 1 && data[1] != undefined){
          this.sesi = "Kelompok A di mulai"
          this.jadwal = data[1]
          this.token = data[1].kelas[this.kelas].token[0]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[1].kelas[this.kelas].link+"/viewform?embedded=true"
        }

        if(jam == jamSesi4 && menit >= menitSesi4 - 5 && data[1] != undefined){
          this.sesi = "Kelompok B di mulai"
          this.jadwal = data[1]
          this.token = data[1].kelas[this.kelas].token[1]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[1].kelas[this.kelas].link+"/viewform?embedded=true"
        }else if(jam == Number(jamSesi4) + 1 && data[1] != undefined){
          this.sesi = "Kelompok B di mulai"
          this.jadwal = data[1]
          this.token = data[1].kelas[this.kelas].token[1]
          this.urlSoal = "https://docs.google.com/forms/d/e/"+data[1].kelas[this.kelas].link+"/viewform?embedded=true"
        }

        console.log(jamSesi3+":"+menitSesi3+" dan "+jamSesi4+":"+menitSesi4)
        this.domHtml = "<iframe src='"+this.urlSoal+"' width='100%' height='600' frameborder='0'marginheight='0' marginwidth='0'>Loading…</iframe>"
  }

  

  sortData(data:any){
    return data.sort((a, b) => new Date(a.jadwal).getDate() - new Date(b.jadwal).getDate() || a.sesi[0].jam.split(":")[0] - b.sesi[0].jam.split(":")[0]);
  }
  


  timer(durasi, speed) {
    let total = localStorage.getItem('durasi') ? Number(localStorage.getItem('durasi')) * 60 : 60 * durasi

    let mundur = localStorage.getItem('mundur') ? Number(localStorage.getItem('mundur')) : 60 * durasi
    // this.total = 60 * durasi
    // let total = mundur
    // let jumlah = localStorage.getItem('detik') ? Number(localStorage.getItem('detik')) : 0
    this.menit = localStorage.getItem('menit') ? Number(localStorage.getItem('menit')) : durasi - 1
    this.detik = localStorage.getItem('detik') ? Number(localStorage.getItem('detik')) : 60
    let stop = setInterval(()=>{
      mundur--
      this.width = (mundur / total) * 100 +'%'
      this.detik --
      // this.total --
      localStorage.setItem('detik',this.detik.toString())
      localStorage.setItem('mundur',mundur.toString())
      if(mundur == 300){
        this.tersisaWaktu = true
        this.peringatanSisa = "5"
      }else if(mundur == 100){
        this.tersisaWaktu = false
      }


      if(this.detik < 0){
        this.detik = 0
      }

      // console.log(this.width)
      if(this.detik == 0){
        // jumlah = 0
        this.detik = 60
        this.menit --
        this.peringatanSisa = Number(this.menit+1).toString()
        if(this.menit <= 0){
            this.menit = 0
        }
        localStorage.setItem('menit',this.menit.toString())
      }
      if(this.menit <= 0 && this.detik == 0 || mundur <= 0){
        // this.menit = 0
        this.tersisaWaktu = true
        this.peringatanSisa = "Time Out"
        this.detik = 0
        this.menit = 0
        clearInterval(stop)
        this.width = '0%'
        console.log("waktu habis")
        localStorage.clear() 

        setTimeout(()=>{
          location.reload()
        },2000)
        
      }
    },speed)
  }

  tampilToken(){
    if(this.passwordToken === 'gurusmpn1arsel'){
        this.getToken = true
    }else{
      this.boxToken = false
    }
  }
  
}
