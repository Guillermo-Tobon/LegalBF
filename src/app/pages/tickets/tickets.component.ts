import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  public usuario:any[] = [];
  public formSubmitted = false;
  public ticketFormCliente:any;

  constructor(
              private routeActive: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router,
              private ticketServ: TicketsService
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];
      
      this.iniciarFormulario(this.usuario);
    })

  }




  /**
   * Método para crear tickets
   */
  public regisTicketCliente = () =>{
    this.formSubmitted = true;

    if ( this.ticketFormCliente.invalid ) {
      return; 
    }
    if ( !this.ticketFormCliente.get('acepto').value ) {
      return;
    }

    this.ticketServ.creatTicketService( this.ticketFormCliente.value ).subscribe( (resp:any) =>{

      Swal.fire('Bien hecho!!', `${resp.msg} - Ticket ( ${resp.idticket} )`, 'success');
      //setTimeout(() => { window.location.reload(); }, 2000);

      const json = {
        nombres: this.usuario[0]['nombres_us'],
        apellidos: this.usuario[0]['apellidos_us'],
        email: 'gtobonbarco@gmail.com',
        asunto: 'Creación de ticket en LegalBF',
          descripcion: 'se ha actualizado su cuenta de LegalBF por parte del administador. Por favor ingrese y verifique su información.'
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })
    
  }



/**
 * Método para iniciar el formulario
 * @param usuario => Datos de usuario
 */
  public iniciarFormulario = (usuario:any) =>{
    console.log(this.usuario)
   
    this.ticketFormCliente = this.fb.group({
      nombrecompleto: [`${usuario[0]['nombres_us']} ${usuario[0]['apellidos_us']}`, [Validators.required, Validators.minLength(3)]],
      email: [usuario[0]['email_us'], [Validators.required, Validators.email, Validators.minLength(6)]],
      telefono: [usuario[0]['telefono_us'], [Validators.required, Validators.minLength(6)]],
      compania: [usuario[0]['compania_us'], [Validators.required, Validators.minLength(5)]],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      acepto: ['', [Validators.required]],
      id: [usuario[0]['id_us'], [Validators.required, Validators.minLength(5)]],
    });
  }


  /**
   * Método para validar los campos del formulario
   * @param campo => Valor del campo
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.ticketFormCliente.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

}
