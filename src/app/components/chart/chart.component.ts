import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import Chart, { type ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() type: 'pie' | 'line' = 'line';
  @Input() labels: Array<string | number> | null = [];
  @Input() data: number[] | null = [];
  @Input() backgroundColor: string[] | string | undefined | null;
  @Output() pointClick = new EventEmitter<string | number>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['labels'] || changes['data'])) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    if (!this.canvasRef) return;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: this.type as ChartType,
      data: {
        labels: this.labels ?? [],
        datasets: [
          {
            label: 'Data',
            data: this.data ?? [],
            backgroundColor: Array.isArray(this.backgroundColor) ? this.backgroundColor : undefined,
            borderColor: typeof this.backgroundColor === 'string' ? this.backgroundColor : undefined,
            fill: false,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (_evt: unknown, elements: Array<{ index: number }>) => {
          if (!elements || !elements.length) return;
          const idx = elements[0].index;
          const label = this.chart?.data.labels ? this.chart.data.labels[idx] : undefined;
          if (label !== undefined) this.pointClick.emit(label as string | number);
        },
      },
    });
  }

  private updateChart(): void {
    if (!this.chart) {
      this.renderChart();
      return;
    }
    this.chart.data.labels = this.labels ?? [];
    if (this.chart.data.datasets && this.chart.data.datasets.length > 0) {
      this.chart.data.datasets[0].data = this.data ?? [];
    }
    this.chart.update();
  }
}
