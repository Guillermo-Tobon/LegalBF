import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';


@Component({
  selector: 'app-lineal',
  templateUrl: './lineal.component.html',
  styleUrls: ['./lineal.component.css']
})
export class LinealComponent implements OnInit {

  @Input() title:string;
  @Input() nombreInv:string;
  @Input() capitalInv:number;
  @Input() monedaInv:string;
  @Input() tasaInv:string;

  @Input('labels') lineChartLabels: Label[];
  @Input('data') lineChartData: ChartDataSets[]; 


  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  
  public lineChartColors: Color[] = [
    
    { // dark grey
      backgroundColor: 'rgba(57,139,247,0.2)',
      borderColor: 'rgba(57,139,247,1)',
      pointBackgroundColor: 'rgba(57,139,247,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(57,139,247,1)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];


  constructor() { }

  ngOnInit(): void { 
  }


}
