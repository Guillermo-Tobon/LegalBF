import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-anexo',
  templateUrl: './detalle-anexo.component.html',
  styleUrls: ['./detalle-anexo.component.css']
})
export class DetalleAnexoComponent implements OnInit {

  public anexo:any[] = [];

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
  ) { }

  ngOnInit(): void {
    this.routeActive.params.subscribe( data =>{
      this.anexo = JSON.parse( data['anexo'] ) || [];
      
      console.log(this.anexo)
      //this.iniciarFormulario(this.anexo);

    })
  }

}
