import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Olympic } from '../../models/olympic.model';
import { CountryStats, OlympicDataService } from '../../services/olympic-data.service';
import { Indicator } from '../../models/indicator.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public indicators: Indicator[] = [];
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';
  public isLoading = true;
  public lineChartLabels: number[] = [];
  public lineChartData: number[] = [];
  public lineChartBackground = '#0b868f';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicDataService: OlympicDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const countryName = params.get('countryName');
      this.loadCountry(countryName);
    });
  }

  private loadCountry(countryName: string | null): void {
    this.isLoading = true;
    this.error = '';

    this.olympicDataService.getCountryByName(countryName).subscribe({
      next: (olympic: Olympic | undefined) => {
        if (!olympic) {
          this.error = 'The requested country was not found.';
          this.isLoading = false;
          this.router.navigate(['/not-found']);
          return;
        }

        this.setCountryData(olympic);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load country data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  private setCountryData(olympic: Olympic): void {
    this.error = '';
    this.titlePage = olympic.country;
    const stats: CountryStats = this.olympicDataService.getOlympicStats(olympic);
    this.totalEntries = stats.totalEntries;
    this.totalMedals = stats.totalMedals;
    this.totalAthletes = stats.totalAthletes;
    this.indicators = stats.indicators;
    this.lineChartLabels = stats.years;
    this.lineChartData = stats.medals;
  }
}
