import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InversionesService } from 'src/app/services/inversiones.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inversiones',
  templateUrl: './inversiones.component.html',
  styleUrls: ['./inversiones.component.css']
})
export class InversionesComponent implements OnInit {

  public usuario:any[] = [];
  public inversiones:any[] = [];

  constructor(
              private inversionesServ: InversionesService,
              private authServ: AuthService,
              private translate: TranslateService,
              private router: Router,
  
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario;

    if ( this.usuario[0].admin_us === 'Y' ) {
      this.getTodasInversiones()
      
    } else {
      this.getInversionesById(this.usuario[0].id_us);
      
    }

    this.translate.use(localStorage.getItem('idioma'));
    
  }



  /**
   * Método para obtener todas las inversiones 
   */
  public getTodasInversiones = () =>{
    this.inversionesServ.getAllInversionesService().subscribe( (resp:any) =>{

      this.inversiones = resp.inversiones || [];

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }






  /**
   * Método para cargar las inversiones por usuario
   * @param idUs => ID de usuario
   */
  public getInversionesById = (idUs:number) =>{

    this.inversionesServ.getInversionesUserService(idUs).subscribe( (resp:any) =>{

      this.inversiones = resp.inversiones || [];

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })

  } 



  public navegarInversion = (inversion:any) =>{

    const inver = JSON.stringify(inversion);
    this.router.navigate(['dashboard/detalle-inversion', inver]);

  }


}
