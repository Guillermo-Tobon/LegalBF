import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';

@Component({
  selector: 'app-configuracion-cuenta',
  templateUrl: './configuracion-cuenta.component.html',
  styleUrls: ['./configuracion-cuenta.component.css']
})
export class ConfiguracionCuentaComponent implements OnInit {


  constructor( private configSrv: ConfiguracionesService ) { }

  ngOnInit(): void {
    this.configSrv.checkCurrentThemeServices();
  }


  /**
   * Método para cambiar el tema
   * @param theme => Color del tema
   */
  public changeTheme = ( theme:string ) =>{
    this.configSrv.changeThemeServices(theme);
  }




}
