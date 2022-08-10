import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { BubbleDataPoint, Chart, ChartConfiguration, ChartConfigurationCustomTypesPerDataset, ChartTypeRegistry, registerables, ScatterDataPoint } from 'chart.js';
// import * as Highcharts from 'highcharts';
// import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinner } from 'ngx-spinner';
import { filter } from 'rxjs';

@Component({
  selector: 'app-widget-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})

export class ColumnComponent implements OnInit, OnChanges {
    //input from dashboard component
    @Input() inputWebsite: any = null;
    @Input() inputDate: any = null;
    @Input() filterForm: any;
    @Input() url: any;
    @Input() localurl: any;
    
    @Output() toDashComp: EventEmitter<boolean> = new EventEmitter();

    getWebName: string[] = [];
    dropDownWebName: string[] = [];
    data: any = [];
    date: any[] = [];
    website: string[] = [];
    websitename: string[] = [];
    visits: number[] = [];

    reset: boolean = false;
    presentLoading:boolean = false

    graphData: any;
    graphWebName: any;
    graphVisits:any;
    graphDate: any;

    //hide and unhide button 
    appear: boolean = false;

    @ViewChild('canvas1') private canvas1!: ElementRef;
    @ViewChild('canvas2') private canvas2!: ElementRef;
    @ViewChild('canvas3') private canvas3!: ElementRef;
    @ViewChild('canvas4') private canvas4!: ElementRef;
    // chartOptions!: {};
    // Highcharts = Highcharts;
    chart1!: any;
    
    //boolean to hide and unhide div 
    divDisplayDate: boolean = false;
    divDisplayWebsite: boolean = false;
    
    //display date and website in html
    displayDate: string = '';
    displayWebsite: string = '';

    storeArray: any;
    storeVisitsArray: any;
    newArray: any;
    newArrayName:any
    top5Website: any;

    stringName!: string;
    stringDate: any;
    stringVisits!: number;
    
    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        ) { 
        Chart.register(...registerables)
    }

    async ngOnInit() { }
    
    async ngOnChanges(){
        console.log(this.filterForm.get('date').dirty, 'dirty')
        // if(this.filterForm.get('date').value || this.filterForm.get('website').value) this.chart1.destroy();
        
        console.log(this.inputDate, 'input date')
        if (this.inputDate == null && this.inputWebsite == null) { //change == null to display all graphs when there is no input
            // this.chart1.destroy()
            // this.functionRun = true;
            // this.appear = true;
            this.createGraph();
        } else if(this.inputDate != null && this.inputWebsite == null) {
            this.chart1.destroy()
            this.displayDate = this.inputDate;
            this.appear = true;
            this.divDisplayDate = true;
            await this.createGraphDateFilter()
            // this.functionRun1 = true;
        } else if(this.inputDate == null && this.inputWebsite != null) {
            this.chart1.destroy()
            this.displayWebsite = this.inputWebsite;
            this.appear = true;
            this.divDisplayWebsite = true;
            await this.createGraphWebsiteFilter()
        } else {
            // this.chart1.destroy()
            // await this.createGraphFilterWebsiteAndDate()
        }
    }

    async createGraph(){
        this.storeArray = [];
        this.newArray = [];   
        this.graphDate = [];
        this.graphData = [];
        this.graphVisits = [];
        this.graphWebName = [];     

        //activate graph by using boolean
        this.showLoading()
        
        // const url = 'https://4025-60-49-210-211.ap.ngrok.io/';
        // const ngUrl = 'http://localhost:3000';
        
        this.http.get(this.localurl).subscribe((res) => {
            
            //form group input value taken from dashbpard component
            // console.log('Halu Halu: ', this.inputDate)
            // console.log('test test: ', this.inputWebsite)
            // console.log('get web data: ',res);
            this.data = res;
            // console.log('get web data in column component: ',this.data);
        
            for(let i = 0; i < this.data.length; i++) {
                this.date[i] = this.datePipe.transform(this.data[i].date, 'dd-MM-yyyy');
                this.website[i] = this.data[i].website;
                this.visits[i] = Math.floor(this.data[i].visits);

                //get website name by using split
                if(this.website[i].split('.')[0] === 'www') this.websitename[i] = this.website[i].split('.')[1].toUpperCase();
                else this.websitename[i] = this.website[i].split('.')[0].toUpperCase();

                //get top 5 most viewed websites ny filtering date
                // if(this.data[i].date == this.inputDate){
                //     i+=i;
                //     // console.log("trying to find how many match date: ", i)
                // }
            }
            //graphData to put in graph
            this.graphData = {
                type: 'bar',
                data: {
                labels: this.websitename,
                // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    // data: this.columnWebsite,
                    label: '# of Visits',
                    data: this.visits,
                    // data: [12, 19, 3, 5, 2, 3],]
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }

            this.dismissLoading()
            
            // console.log(this.websitename)
            if (this.inputDate == null && this.inputWebsite == null) this.showGraph1(this.graphData)
        });
        
    } 

    async createGraphDateFilter(){
        
        this.storeArray = [];
        this.newArray = [];
        this.graphDate = [];
        this.graphData = [];
        this.graphVisits = [];
        this.graphWebName = [];

        let arrayWithSameDate = [];
        // this.graphData = {};
        
        this.showLoading()
        // const url = 'https://4025-60-49-210-211.ap.ngrok.io/';
        // const ngUrl = 'http://localhost:3000';

        this.http.get(this.localurl).subscribe(res => {
            
            this.data = res;
            // console.table('this.data before sort: ', this.data)

            //sort array visits from high to low with same date
            const sortArrayObjs = function(arr: any, prop1: any, prop2: any) {
                let sort1 =  [...arr].sort((a, b) => {
                    if(a[prop1] == b[prop1]) {
                        if(Math.floor(a[prop2]) == Math.floor(b[prop2])) return 0;
                        return (Math.floor(a[prop2]) > Math.floor(b[prop2])) ? -1 : 1;
                    } else {
                        return (a[prop1] > b[prop1]) ? -1 : 1;
                    }
                });
                return sort1
            };

            this.newArray = sortArrayObjs(this.data, 'date', 'visits');

            // console.log('newArray: ', this.newArray)
            arrayWithSameDate = this.newArray.filter((arr: { date: string; }) => {
                return arr.date.split('T')[0].split('-').reverse().join('-') == this.inputDate;
            })
            // console.log('arrayWithSameDate: ', arrayWithSameDate)
            

            this.graphData = {
                type: 'bar',
                data: {
                labels: [arrayWithSameDate[0].website, arrayWithSameDate[1].website, arrayWithSameDate[2].website, arrayWithSameDate[3].website, arrayWithSameDate[4].website],
                datasets: [{
                    // data: this.columnWebsite,
                    label: '# of Visits against Website',
                    data: [arrayWithSameDate[0].visits, arrayWithSameDate[1].visits, arrayWithSameDate[2].visits, arrayWithSameDate[3].visits, arrayWithSameDate[4].visits],
                    // data: [12, 19, 3, 5, 2, 3],]
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
            // console.log('this.graphData', this.graphData)
            this.showGraph1(this.graphData)
        })

        // this.showGraph2()
        this.dismissLoading()
    }

    async createGraphWebsiteFilter(){
        this.storeArray = [];
        this.newArray = [];
        this.graphDate = [];
        this.graphData = [];
        this.graphVisits = [];
        this.graphWebName = [];

        let arrayWithSameName = [];

        this.showLoading()
        // console.log('Filter Webname');
        // this.showGraph3()
        this.http.get(this.localurl).subscribe(res=>{
            this.data = res;

            //sort array visits from high to low with same website name
            const sortArrayObjs = function(arr: any, prop1: any, prop2: any) {
                let sort1 =  [...arr].sort((a, b) => {
                    if(a[prop1] == b[prop1]) {
                        if(Math.floor(a[prop2]) == Math.floor(b[prop2])) return 0;
                        return (Math.floor(a[prop2]) > Math.floor(b[prop2])) ? -1 : 1;
                    } else {
                        return (a[prop1] > b[prop1]) ? -1 : 1;
                    }
                });
                return sort1
            };

            this.newArray = sortArrayObjs(this.data, 'website', 'visits');
            // console.log('this.newArray', this.newArray)

            arrayWithSameName = this.newArray.filter((arr: { website: string; }) => {
                return arr.website == this.inputWebsite;
            })
            // console.log('arrayWithSameName: ', arrayWithSameName)
            // console.log('arrayWithSameName length: ', arrayWithSameName.length)

            for(let i = 0; i < arrayWithSameName.length; i++){
                this.graphWebName[i] = arrayWithSameName[i].website;
                this.graphVisits[i] = arrayWithSameName[i].visits;
                this.graphDate[i] = arrayWithSameName[i].date.split('T')[0].split('-').reverse().join('-');
            }
            // console.log('graphWebName: ', this.graphWebName)
            // console.log('graphVisits: ', this.graphVisits)

            this.graphData = {
                type: 'bar',
                data: {
                labels: this.graphDate,
                datasets: [{
                    // data: this.columnWebsite,
                    label: '# of Visits against Website',
                    data: this.graphVisits,
                    // data: [12, 19, 3, 5, 2, 3],]
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }

            this.showGraph1(this.graphData)

        })
        this.dismissLoading()

    }

    async createGraphFilterWebsiteAndDate(){
        this.storeArray = [];
        this.newArray = [];
        this.graphDate = [];
        this.graphData = [];
        this.graphVisits = [];
        this.graphWebName = [];
        
        this.showLoading()
        
        this.http.get(this.localurl).subscribe(res => {
            this.data = res;
            console.log(this.data)

            //get data by filtering date and website name
            for(let i = 0; i < this.data.length; i++){
                if(this.data[i].website == this.inputWebsite && this.data[i].date.split('T')[0].split('-').reverse().join('-') == this.inputDate){
                    // console.log("Found them")
                    this.stringName = this.inputWebsite;
                    this.stringDate = this.inputDate;
                    this.stringVisits = Math.floor(this.data[i].visits);
                } else {
                    console.log("Data that isnt Found");
                }
            }
            console.log(this.stringName)
            console.log(this.stringDate)
            console.log(this.stringVisits)

            this.graphData = {
                type: 'bar',
                data: {
                labels: [this.stringName],
                datasets: [{
                    // data: this.columnWebsite,
                    label: '# of Visits against Website',
                    // data: 2,
                    data: [this.stringVisits],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        // 'rgba(54, 162, 235, 0.2)',
                        // 'rgba(255, 206, 86, 0.2)',
                        // 'rgba(75, 192, 192, 0.2)',
                        // 'rgba(153, 102, 255, 0.2)',
                        // 'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        // 'rgba(54, 162, 235, 1)',
                        // 'rgba(255, 206, 86, 1)',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        // 'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }

            this.showGraph1(this.graphData)
        })

        this.dismissLoading()

    }
    
    async showLoading() : Promise <any> {
        this.presentLoading = true;
        // console.log('present loading', this.presentLoading)
    }

    async dismissLoading() : Promise <any>{
        if (this.presentLoading){
            this.presentLoading = false;
            // console.log('dismiss loading', this.presentLoading)
        }
    }

    async showGraph1(graphData: any){
        // this.chart1.update();
        // this.chart1.destroy();
        this.showLoading;
        // console.log('graphData', graphData)
        const canvas: any = document.getElementById('canvas1') as HTMLCanvasElement;
        if(canvas != null){
            const ctx = canvas.getContext('2d')
            this.chart1 = new Chart(ctx, graphData);
            // this.chart1.destroy(); 
        }

        this.dismissLoading;
    }

    async destroyCanvas(){
        this.reset = true;
        // console.log('button works');
        this.toDashComp.emit(this.reset);
        this.appear = false;
        this.divDisplayDate = false;
        this.divDisplayWebsite = false;
        // this.filterForm.reset();
        if(this.inputDate!=null) {
            this.inputDate = null;
            await this.chart1.destroy();
        }
        if(this.inputWebsite!=null) {
            this.inputWebsite = null;
            await this.chart1.destroy();
        } 

        this.filterForm.get('website').enable();
        this.filterForm.get('date').enable();
        await this.createGraph();
        console.log(this.filterForm.get('date').dirty, 'dirty in destroyCanvas')
    }
    
}
