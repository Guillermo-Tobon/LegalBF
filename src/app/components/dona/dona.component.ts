import { Component, Input, OnInit } from '@angular/core';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent implements OnInit {

  @Input() title:string;

  @Input('labels') doughnutChartLabels: Label[];
  @Input('data') doughnutChartData: MultiDataSet;
  
  public doughnutChartType: ChartType = 'doughnut';

  public colors:Color[] = [{ backgroundColor: ['#fde098', '#84c5f1', '#fd9fb3'] }]

  constructor() { }

  ngOnInit(): void {
  }

}
