import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  private linkTheme:any = document.querySelector('#theme');

  constructor() {
    //Aplicando el tema seleccionado
    const url = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';
    this.linkTheme.setAttribute('href', url);
   }




   /**
   * Método para cambiar el tema
   * @param theme => Color del tema
   */
  public changeThemeServices = ( theme:string ) =>{
    const url = `./assets/css/colors/${theme}.css`;
    
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentThemeServices();
  }



  /**
   * Método para marcar la selección del tema
   */
  public checkCurrentThemeServices = () =>{
    const links = document.querySelectorAll('.selector');

    links.forEach( elem  =>{
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      if ( btnThemeUrl === currentTheme ) {
        elem.classList.add('working');
      }
    });

  }




}
