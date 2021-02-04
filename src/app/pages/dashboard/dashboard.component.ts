import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';

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
  
  public labels2:string[] = [];               
  public Data2:any[] = [];               
  public usuario:any[] = [];
  public inversiones:any[] = [];
  public anexos:any[] = [];
  public archivos:any[] = [];
  public nomInversion:string;
  public idInv:number;
  public capital:number;
  public moneda:string;
  public pais:string;
  public tiempo:string;
  public tasa:string;
  public estado:number;
  public descripcion:string;
  public fechareg:string;
  public sumGanan:Number = 0;

  constructor(
              private autServ: AuthService,
              private inversionesServ: InversionesService,
              private archivosServ: ArchivosService,
  ) { }


  ngOnInit(): void {
    this.usuario = this.autServ.usuario;
    
    this.getInversionesById(this.usuario[0].id_us);
  }




  /**
   * Método para cargar las inversiones por usuario
   * @param idUs => ID de usuario
   */
  public getInversionesById = (idUs:number) =>{

    this.inversionesServ.getInversionesUserService(idUs).subscribe( (resp:any) =>{

      this.inversiones = resp.inversiones || [];
      
      this.idInv = this.inversiones[0].id_inv;
      this.nomInversion = this.inversiones[0].nombre_inv;
      this.capital = this.inversiones[0].capital_inv;
      this.moneda = this.inversiones[0].moneda_inv;
      this.pais = this.inversiones[0].pais_inv;
      this.tiempo = this.inversiones[0].tiempo_inv;
      this.tasa = this.inversiones[0].tasa_ea_inv;
      this.descripcion = this.inversiones[0].descripcion_inv;
      this.fechareg = this.inversiones[0].fechareg_inv;
      this.estado = this.inversiones[0].estado_inv;

      this.getAnexosByIdInver(this.inversiones[0].id_inv);
      this.getArchivosUserInversion(this.inversiones[0].id_inv, this.inversiones[0].id_us_inv);

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })

  }
  
  


  /**
   * Método para obtener los anexos
   * @param idInversion => ID inversión
   */
  public getAnexosByIdInver = (idInversion:string) =>{

    this.inversionesServ.getAnexosByIdService(idInversion).subscribe( (resp:any) =>{

      if( resp.ok ){
        this.anexos = resp.anexos || [];
        let dataGanan = [];

        for (let i = 0; i < this.anexos.length; i++) {
          dataGanan[i] = this.anexos[i].ganacias_anex;
          this.labels2[i] = this.anexos[i].fechpublica_anex;

          this.sumGanan += this.anexos[i].ganacias_anex;  
        }

        this.Data2 = [{data: dataGanan, label: 'Ganancias'}]; 

      }
      
    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    });
  }



  /**
   * Método de servicio para obtener los archivos por user e inversión
   * @param idInver => ID inversión
   * @param id => ID del usuario 
   */
  public getArchivosUserInversion = (idInver:string, idUs:number) =>{
    this.archivosServ.getFilesInverUserService(idInver, idUs).subscribe( (resp:any) =>{

      this.archivos = resp.archivos || [];

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }



  /**
   * Método para visualizar archivo por id
   * @param archivo => Objeto archivo a visualizar 
   */
  public verArchivo = (archivo:any) =>{

    this.archivosServ.viewFileService( archivo.tipo_archivo_info, archivo.nom_archivo_info ).subscribe( (resp:any) =>{

      //window.open(resp.pathFile, "_blank");
      window.open(`http://127.0.0.1:8887/${archivo.tipo_archivo_info}/${archivo.nom_archivo_info}`, "_blank");
    
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }


}
