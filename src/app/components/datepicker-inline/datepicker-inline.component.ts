import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datepicker-inline',
  templateUrl: './datepicker-inline.component.html',
  styleUrls: ['./datepicker-inline.component.css']
})
export class DatepickerInlineComponent implements OnInit {

  @Input() title:string;

  public bsInlineValue = new Date();
  public bsInlineRangeValue: Date[];
  public maxDate = new Date();

  constructor() { }

  ngOnInit(): void {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
  }

}
