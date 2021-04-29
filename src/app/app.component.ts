import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  myControl = new FormControl();
  users = [];
  spinner = false;
  input$;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    const input$ = this.myControl.valueChanges.pipe(
      filter(text => text.length > 2),
      debounceTime(1000),
      distinctUntilChanged(),
      tap((v) => {
        if (v.length === 0) {
          this.users = [];
          } else {
          this.spinner = true;
          this.users = [];
        }
      }),
      filter( v => v.trim()),
    ).subscribe( v =>  {
      this.search();
    });


  }


  search(): void {
    this.http.get(`https://api.github.com/search/users?q=${this.myControl.value}&page,per_page,sort,order?since=XXX`).subscribe(
      res => {
        const response: any = res;
        this.users = response.items;
        this.spinner = false;
      }
    );
  }

}
