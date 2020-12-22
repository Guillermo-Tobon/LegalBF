import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from '../services/configuraciones.service';

declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  public year = new Date().getFullYear();

  constructor( private configSrv: ConfiguracionesService ) { }

  ngOnInit(): void {
    customInitFunctions();
  }

}
