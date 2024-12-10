import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Localisation } from '../Classes/Location/localisation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  constructor(private httpClient :HttpClient) { }

  getAllLocations(){
    return this.httpClient.get<Localisation[]>('http://localhost:8080/PI/OLTP/API/get-locations')
  }
}
