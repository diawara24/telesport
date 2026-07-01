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
  public isLoading = true;
  public error = '';

  // inputs for the shared chart component
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartBackground: string[] = ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'];

  constructor(private router: Router, private olympicDataService: OlympicDataService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.error = '';

    this.olympicDataService.getOlympics().subscribe({
      next: (olympics: Olympic[]) => {
        const overview = this.olympicDataService.getOlympicOverview(olympics);
        this.totalCountries = overview.totalCountries;
        this.totalJOs = overview.totalJOs;
        this.indicators = overview.indicators;
        this.pieChartLabels = overview.pieChartLabels;
        this.pieChartData = overview.pieChartData;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load Olympic data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  public onPiePointClick(label: string | number): void {
    const countryName = String(label);
    this.router.navigate(['country', countryName]);
  }
}

