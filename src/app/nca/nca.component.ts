import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-nca',
  templateUrl: './nca.component.html',
  styleUrls: ['./nca.component.css']
})
export class NcaComponent implements OnInit {

  constructor(private _dataService: DataService) { }

  ngOnInit() {
  }

}
