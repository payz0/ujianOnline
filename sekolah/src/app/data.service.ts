import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl:string = "assets/data.json";

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Accept-Encoding'
  })

  constructor(private http:HttpClient) { }

  getData(){
    return this.http.get(this.baseUrl)
  }
}
