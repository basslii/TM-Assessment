import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {

  sideBarOpen = false;

  data: any = []
  websiteDate: any = [];

  api_key='2CrAJ8oa1DAL1bIxw7oAwiEhnwm_7tLGF8UFiwphnadngm3mg';

  // readonly ROOT_URL = 'https://bba9-175-141-183-205.ngrok.io/';
  // readonly ROOT_URL = 'https://jsonplaceholder.typicode.com/todos/1';
  // readonly ROOT_URL = 'http://localhost:3000/data';

  posts!: Observable<any>;
  // posts: any;
  newPost!: Observable<any>;
   readonly BASE_URL = 'https://8f6d-113-211-208-242.ap.ngrok.io';
  
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    ) {}

  async ngOnInit() {
    // fetch('https://bba9-175-141-183-205.ngrok.io/').then(response => response.json()).then(json => console.log(json))

    //? Get data from db
    // fetch(this.ROOT_URL) //get data from local db - ROOT_URL = 'http://localhost:3000/data';
    // fetch(this.ROOT_URL + '/' + this.api_key) //get data from live db
    //   .then(res => res.json())
    //   .then(res => {
    //     console.log(res);
    //     console.log(res[0])
    //     this.data = res;
    //     console.log("Data from backend", this.data)
    //     for (let i = 0; i< this.data.length; i++) {
    //       console.log(this.data[i].date);

    //? Change date format to day-month-year
    //       this.websiteDate[i] = this.datePipe.transform(this.data[i].date, 'dd-MM-yyyy')
    //     };
    //     console.log("Website Date: ", this.websiteDate)
    //   })
      // this.newFunction()
  }

  async getPosts() {
    // let params = new HttpParams().set('date', '2013-01-05');
    // const headers = new HttpHeaders()
    //   .set('content-type', 'application/json; charset=utf-8')
    //   // .set('Access-Control-Allow-Origin', '*')
    //   .set('Access-Control-Allow-Headers', '*')
    //   .set('Authorization', this.api_key)
    // // let headers = {
    //   // Token= this.api_key
    //   // authorization: 'Bearer' + this.api_key;
    //   // "Authorization: Bearer"  this.api_key,
    //   "Content-Type: application/json" 
    // }

    // let options = {
    //   // responseType: "text/plain",
    //   headers: '',
    // };

    const headers = {
      // Authorization: this.api_key,
      'content-type': 'application/json',
    };

    const responseType = 'text';

    const observe = 'response';

    // this.BASE_URL = 'https://6d9c-113-211-208-242.ap.ngrok.io/data' + '/' + this.api_key;

    // let url = this.BASE_URL + '/data/' + this.api_key;
    // let url = 'https://104e-60-49-210-211.ngrok.io/data/2CrJawPVA9TptpnFFOqPkWVrju5_2KcQ5qvaEGmG6tYBXbgER';
    // let url = 'https://2c26-113-211-208-242.ap.ngrok.io/data/2CrAJ8oa1DAL1bIxw7oAwiEhnwm_7tLGF8UFiwphnadngm3mg';
    // let url = 'https://b3d9-113-211-208-242.ap.ngrok.io/'
    // let url = 'https://008c-60-49-210-211.ngrok.io/'
    // let url = 'https://008c-60-49-210-211.ngrok.io/'
    // let url = 'https://b3d9-113-211-208-242.ap.ngrok.io'
    // let url = 'https://b3d9-113-211-208-242.ap.ngrok.io'
    

    // console.log('request url: ', url);

    // this.posts = 
  //   this.http.get(url).subscribe(
  //     data => console.log('This is data: ', data),
  //     // err => console.error('Error:', err)
  // );
    // console.log('What is this.posts: ', this.posts)
    // this.posts = this.http.get(this.ROOT_URL + '/' + { params });
    // this.posts = this.http.get(this.ROOT_URL + '/posts', { headers });
    // console.log(this.posts);
    // console.log(typeof this.posts);
    
  }

  async newFunction() {
    // let url = 'https://3ca0-113-211-208-242.ap.ngrok.io';
    let url = 'http://localhost:3000/';

    this.http.get(url).subscribe((data) => {
    console.log('get web data: ',data);

  })
  }

  async sideBarToggler(event: any){
    this.sideBarOpen = ! this.sideBarOpen;
  }
}

// interface getResults {
//   date: string,
//   website: string,
//   visits: string
// }
