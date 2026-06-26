import { Component, Input } from '@angular/core';
import { Indicator } from 'src/app/models/indicator.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() title: string | null = '';
  @Input() indicators: Indicator[] | null = [];

}
