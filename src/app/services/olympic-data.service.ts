import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Olympic } from '../models/olympic.model';
import { Indicator } from '../models/indicator.model';
import { environment } from 'src/environments/environment';

export interface CountryStats {
  totalEntries: number;
  totalMedals: number;
  totalAthletes: number;
  years: number[];
  medals: number[];
  indicators: Indicator[];
}

@Injectable({
  providedIn: 'root',
})
export class OlympicDataService {

  private readonly olympicUrl = environment.apiUrl || environment.mockDataUrl;

  constructor(private http: HttpClient) {}

  getOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl);
  }

  getTotalOlympics(olympics: Olympic[]): number {
    return olympics.length;
  }

  getTotalJOs(olympics: Olympic[]): number {
    return Array.from(
      new Set(olympics.flatMap((olympic) => olympic.participations.map((participation) => participation.year)))
    ).length;
  }

  getCountryNames(olympics: Olympic[]): string[] {
    return olympics.map((olympic) => olympic.country);
  }

  getMedalCountsByCountry(olympics: Olympic[]): number[] {
    return olympics.map((olympic) => olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0));
  }

  getCountryByName(countryName: string | null): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map((olympics) => olympics.find((olympic) => olympic.country === countryName))
    );
  }

  getOlympicStats(olympic: Olympic): CountryStats {
    const participations = olympic.participations;
    return {
      totalEntries: participations.length,
      totalMedals: participations.reduce((sum, participation) => sum + participation.medalsCount, 0),
      totalAthletes: participations.reduce((sum, participation) => sum + participation.athleteCount, 0),
      years: participations.map((participation) => participation.year),
      medals: participations.map((participation) => participation.medalsCount),
      indicators: [
        { label: 'Number of entries', value: participations.length },
        { label: 'Total Number of medals', value: participations.reduce((sum, participation) => sum + participation.medalsCount, 0) },
        { label: 'Total Number of athletes', value: participations.reduce((sum, participation) => sum + participation.athleteCount, 0) }
      ]
    };
  }
}
