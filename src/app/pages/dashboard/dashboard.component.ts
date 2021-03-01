import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public labels1:string[] = [];
  public Data1:any[] = [];
  public labels2:string[] = [];               
  public Data2:any[] = [];  
  public labels3:string[] = [];               
  public Data3:any[] = [];               
  public usuario:any[] = [];
  public usuarios:any[] = [];
  public inversiones:any[] = [];
  public totalInver:any[] = [];
  public userInver:any[] = [];
  public anexos:any[] = [];
  public archivos:any[] = [];
  public tickets:any[] = [];
  public nomInversion:string;
  public idInv:number;
  public capitalExtra:number;
  public capitalCop:number;
  public interesExtra:number;
  public interesCop:number;
  public rentaExtra:number;
  public rentaCop:number;
  public moneda:string;
  public pais:string;
  public tiempo:string;
  public tasa:string;
  public tasaCambio:number;
  public estado:number;
  public descripcion:string;
  public fechareg:string;
  public sumGanan:Number = 0;

  constructor(
              private autServ: AuthService,
              private inversionesServ: InversionesService,
              private clientesServ: ClientesService,
              private ticketServ: TicketsService,
              private archivosServ: ArchivosService,
              private router: Router
  ) { }


  ngOnInit(): void {
    this.usuario = this.autServ.usuario;
    
    this.getInversionesById(this.usuario[0].id_us);

    if ( this.usuario[0].admin_us === 'Y' ) {
      this.obtenerUsuarios();
      this.getTodasInversiones();
      this.getAllTickets();
      this.getUsuariosInversiones();
      setTimeout(() => { this.cargarGraficaDona(); }, 1000);
    }
  }




  /**
   * Método para cargar las inversiones por usuario
   * @param idUs => ID de usuario
   */
  public getInversionesById = (idUs:number) =>{

    this.inversionesServ.getInversionesUserService(idUs).subscribe( (resp:any) =>{

      this.inversiones = resp.inversiones || [];
      console.log(this.inversiones)
      
      this.idInv = this.inversiones[0].id_inv;
      this.nomInversion = this.inversiones[0].nombre_inv;
      this.capitalExtra = this.inversiones[0].capital_extra_inv;
      this.capitalCop = this.inversiones[0].capital_cop_inv;
      this.interesExtra = this.inversiones[0].interes_extra_inv;
      this.interesCop = this.inversiones[0].interes_cop_inv;
      this.rentaExtra = this.inversiones[0].renta_extra_inv;
      this.rentaCop = this.inversiones[0].renta_cop_inv;
      this.moneda = this.inversiones[0].moneda_extra_inv;
      this.pais = this.inversiones[0].pais_inv;
      this.tiempo = this.inversiones[0].tiempo_inv;
      this.tasa = this.inversiones[0].tasa_ea_inv;
      this.tasaCambio = this.inversiones[0].tasa_cambio_inv;
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
          dataGanan[i] = this.anexos[i].capital_interes_extra_anex;
          this.labels2[i] = this.anexos[i].fechAnexo;

          this.sumGanan += this.anexos[i].capital_interes_extra_anex;  
        }

        this.Data2 = [{data: dataGanan, label: 'Winnings'}]; 

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
  public verArchivo = (tipoFile:any, nomFile:any) =>{

    this.archivosServ.viewFileService( tipoFile, nomFile ).subscribe( (resp:any) =>{

      //window.open(resp.pathFile, "_blank");
      window.open(`http://127.0.0.1:8887/${tipoFile}/${nomFile}`, "_blank");
    
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  /**
   * Método para obtener los usuarios
   */
  public obtenerUsuarios = () =>{
    this.clientesServ.getUsuariosService().subscribe( (data:any) =>{
      
      this.usuarios = data.usuarios || [];
     
    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }



  /**
   * Método para obtener todas las inversiones 
   */
  public getTodasInversiones = () =>{
    this.inversionesServ.getAllInversionesService().subscribe( (resp:any) =>{

      this.totalInver = resp.inversiones || [];

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }



  /**
   * Método para obtener todos los tickets
   */
  public getAllTickets = () =>{
    this.ticketServ.getAllTicketsService().subscribe( (resp:any) =>{

      this.tickets = resp.tickets || []; 

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }


  /**
   * Método para obtener los usuarios e inversiones
   */
  public getUsuariosInversiones = () =>{
    this.inversionesServ.getUserInversionService().subscribe( (resp:any) =>{

      this.userInver = resp.datos || [];
      let dataInver = [];

      for (let i = 0; i < this.userInver.length; i++) {
        dataInver[i] = this.userInver[i].capital_extra_inv;
        this.labels3[i] = this.userInver[i].nombres_us; 
      }

      this.Data3 = [{data: dataInver, label: 'Project($)'}]; 

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }



  /**
   * Método para cargar la grafica de rosca
   */
  public cargarGraficaDona = () =>{
    this.labels1 = ['Users', 'Projects', 'Tickets'];
    this.Data1 = [[this.usuarios.length, this.totalInver.length, this.tickets.length]];

  }



  /**
   * Método para navegar a detalle anexo
   */
  public navegarAnexo = (anexo:any) =>{

    const obAnexo = JSON.stringify(anexo);
    this.router.navigate(['dashboard/detalle-anexo', obAnexo]);

  }


}
