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
    this.olympicDataService.getCountryByName(countryName).subscribe({
      next: (olympic: Olympic | undefined) => {
        if (!olympic) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.setCountryData(olympic);
      },
      error: (error) => {
        this.error = error.message ?? 'Unable to load country data.';
      },
    });
  }

  private setCountryData(olympic: Olympic): void {
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
