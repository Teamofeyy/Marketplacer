import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  toChartPoints(history: any[], range: [Date, Date] | null): {
    points: readonly (readonly [number, number])[],
    labels: string[];
  } {
    const sorted = history.sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const filtered = !range
      ? sorted
      : sorted.filter(entry => {
        const time = new Date(entry.created_at).getTime();
        return (
          time >= range[0].getTime() &&
          time <= range[1].getTime()
        );
      });

    const points: [number, number][] = filtered.map((entry, index) => [
      index,
      entry.price
    ]);

    const labels: string[] = filtered.map(entry => {
      const date = new Date(entry.created_at);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    return {
      points: points as readonly (readonly [number, number])[],
      labels
    };
  }
}
