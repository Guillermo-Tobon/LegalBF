import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { InversionesService } from 'src/app/services/inversiones.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //Para grafica de dona
  public labels1:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public Data1 = [
    [350, 450, 100],
    [150, 250, 300],
  ];


  //Para grafica lineal
  public labels2:string[] = ['10/01/2021', '15/03/2021', '11/06/2021', '10/08/2021', '05/10/2021', '15/12/2021', '10/01/2022'];
  public Data2 = [{ 
                    data: [1000, 1200, 1340, 1410, 1500, 1600, 1750], 
                    label: 'Ganancias'
                 }];
  
  public usuario:any[] = [];
  public inversiones:any[] = [];
  public nomInversion:string;
  public capital:number;
  public moneda:string;
  public tasa:string;

  constructor(
              private autServ: AuthService,
              private inversionesServ: InversionesService,
  ) { }


  ngOnInit(): void {
    this.usuario = this.autServ.usuario;
console.log(this.usuario)
    this.getInversionesById(this.usuario[0].id_us);
  }




  /**
   * Método para cargar las inversiones por usuario
   * @param idUs => ID de usuario
   */
  public getInversionesById = (idUs:number) =>{

    this.inversionesServ.getInversionesUserService(idUs).subscribe( (resp:any) =>{

      this.inversiones = resp.inversiones || [];
      
      this.nomInversion = this.inversiones[0].nombre_inv;
      this.capital = this.inversiones[0].capital_inv;
      this.moneda = this.inversiones[0].moneda_inv;
      this.tasa = this.inversiones[0].tasa_ea_inv;

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })

  } 


}
