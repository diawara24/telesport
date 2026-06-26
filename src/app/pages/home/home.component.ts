import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Olympic } from '../../models/olympic.model';
import { OlympicDataService } from '../../services/olympic-data.service';
import { Indicator } from '../../models/indicator.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public totalCountries = 0;
  public totalJOs = 0;
  public titlePage = 'Medals per Country';
  public indicators: Indicator[] = [];

  // inputs for the shared chart component
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartBackground: string[] = ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'];

  constructor(private router: Router, private olympicDataService: OlympicDataService) {}

  ngOnInit(): void {
    this.olympicDataService.getOlympics().subscribe({
      next: (olympics: Olympic[]) => {
        this.totalCountries = this.olympicDataService.getTotalOlympics(olympics);
        this.totalJOs = this.olympicDataService.getTotalJOs(olympics);

        this.indicators = [
          { label: 'Number of Countries: ', value: this.totalCountries },
          { label: 'Number of JOs: ', value: this.totalJOs },
        ];

        this.pieChartLabels = this.olympicDataService.getCountryNames(olympics);
        this.pieChartData = this.olympicDataService.getMedalCountsByCountry(olympics);
      },
    });
  }

  public onPiePointClick(label: string | number): void {
    const countryName = String(label);
    this.router.navigate(['country', countryName]);
  }
}

