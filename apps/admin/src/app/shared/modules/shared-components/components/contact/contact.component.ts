import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bgap-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() contact: any;

  constructor() {}

  ngOnInit(): void {}
}
