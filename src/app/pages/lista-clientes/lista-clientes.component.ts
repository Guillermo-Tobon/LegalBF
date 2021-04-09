import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {

  public usuarios:any[] = [];

  constructor(
              private clientesServ: ClientesService,
              private translate: TranslateService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.translate.use(localStorage.getItem('idioma'));
    this.obtenerUsuarios();

  }


  /**
   * Método para obtener los usuarios
   */
  public obtenerUsuarios = () =>{
    let traError;
    let traMsgAlert;
    this.translate.get('Error').subscribe((res: string) =>{traError = res});
    this.translate.get('notUnableTryAgainLater').subscribe((res: string) =>{traMsgAlert = res});

    this.clientesServ.getUsuariosService().subscribe( (data:any) =>{
      if(data.ok){

        this.usuarios = data.usuarios || [];

      } else {
        Swal.fire(`${traError}`, `${traMsgAlert}`, 'error');
        setTimeout(() => { this.router.navigateByUrl('/'); }, 1200);

      }

    }, (err) =>{
      //En caso de un error
      console.log(err)
    })
  }



  /**
   * Método para ver detalle del usuario
   * @param usuario => Usuario especifico
   */
  public verDetalleCliente = (usuario:any) =>{
    const user = JSON.stringify(usuario);
    this.router.navigate(['dashboard/detalle-cliente', user]);
  }



}
