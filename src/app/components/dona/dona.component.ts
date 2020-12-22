import { Component, Input, OnInit } from '@angular/core';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent implements OnInit {

  @Input() title:string = 'Sin título';

  @Input('labels') doughnutChartLabels: Label[] = ['Sin dato 1', 'Sin dato 3', 'Sin dato 3'];
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
    [150, 250, 300],
    
  ];
  public doughnutChartType: ChartType = 'doughnut';

  constructor() { }

  ngOnInit(): void {
  }

}
