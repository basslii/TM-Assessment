import { Component, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import * as Highcharts from 'highcharts';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  @Output() inputWebsiteFromDash: any;
  @Output() inputDateFromDash: any;
  @Output() filterFormDash: any;
  @Output() url = 'https://aefb-113-211-208-242.ap.ngrok.io/';
  @Output() localurl = 'http://localhost:3000';
  
  // @ViewChild(ColumnComponent) columnComponent: any;

  chartOptions!: {};
  Highcharts = Highcharts;

  data: any = [];
  date: any[] = [];
  website: string[] = [];
  websitename: string[] = [];
  visits: string[] = [];

  match: boolean = true;


  presentLoading : boolean = false;

  filterForm = new FormGroup ({
    date: new FormControl(""),
    website: new FormControl(""),
    visits: new FormControl(""),
  })

  selectDropDownDate: string [] = [];

  constructor(
    private http: HttpClient,
  ) {}

  // ngAfterContentInit(): {
  //   this.
  // }

  async ngOnInit() {
    //Function to ger data from the server
    await this.testFunction();
    this.filterFormDash = this.filterForm
    // console.log(typeof this.filterFormDash)
  }

  // DataLength!: number;
  dropDownWebName: string[] = [];

  async testFunction() {
    // const url = 'https://4025-60-49-210-211.ap.ngrok.io/';
    // let url = 'http://localhost:3000/';
    // const ngUrl = 'http://localhost:3000';

    // const json = await response.json()
    // console.log(json)
    this.presentLoading = true
    this.http.get(this.localurl).subscribe((res) => {

        this.data = res;
        // console.log('get web data: ',this.data);

        for(let i = 0; i < this.data.length; i++) {
          this.date[i] = this.data[i].date.split('T')[0].split('-').reverse().join('-');
          this.website[i] = this.data[i].website;
          this.visits[i] = this.data[i].visits;

          //get website name by using split
          // if(this.website[i].split('.')[0] === 'www') this.websitename[i] = this.website[i].split('.')[1].toUpperCase();
          // else this.websitename[i] = this.website[i].split('.')[0].toUpperCase();

        }

        this.dropDownWebName = Array.from(new Set(this.website)).sort();
        // this.dropDownWebName.splice(0, 0, ' ');
        this.selectDropDownDate = Array.from(new Set(this.date)).sort();
        // this.selectDropDownDate.splice(0, 0, ' ');
        
      
        this.presentLoading = false
    })
  }

  async websiteNameChange(websitename: any){
    // this.inputWebsiteFromDash = null;
    console.log('website value in dashboard: ', websitename)
    if(websitename != null) this.inputWebsiteFromDash = websitename;
    else this.inputWebsiteFromDash = null;
    // websitename = 0;
  }

  async dateChange(date: any){
    // this.inputDateFromDash = null;
    console.log('date value in dashboard: ', date)
    // console.log(this.filterFormDash.get('date').touched, 'touched')
    if(date != null) this.inputDateFromDash = date;
    else this.inputDateFromDash = null;
    // date= 0;

    // console.log('data in dateChange: ', this.data)

    for(let i = 0; i < this.data.length; i++){
      this.visits[i] = this.data[i].visits;
      this.date[i] = this.data[i].date.split('T')[0].split('-').reverse().join('-');
      this.visits[i] = this.data[i].visits;
    }

  }
  resetFormHandler(reset: boolean) {
    console.log(reset, 'filterForm is reset')
    if(reset) {
      this.filterForm.reset()
    };
  }

  toDisableWebIn(){
    this.filterForm.get('website')?.disable();
  }
  
  toDisableDateIn(){
    this.filterForm.get('date')?.disable();
  }

}
