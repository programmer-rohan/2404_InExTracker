import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { Transaction } from '../maintenance/maintenance.component';
import { MonthNamePipe } from '../month-name.pipe';
import { InExTableComponent } from '../in-ex-table/in-ex-table.component';
import { NumberPipe } from '../number.pipe';
import { ApiService } from '../api.service';

export interface MonthlyTransactions {
  year: number;
  month: number;
  transactions: Transaction[];
}

@Component({
  selector: 'view-data',
  standalone: true,
  imports: [MaterialModule, MonthNamePipe, InExTableComponent, NumberPipe],
  templateUrl: './view-data.component.html',
  styleUrl: './view-data.component.scss',
})
export class ViewDataComponent implements OnInit {
  data: MonthlyTransactions[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMonthlyTransactions().subscribe({
      next: (res: MonthlyTransactions[]) => {
        console.log(res);
        this.data = res;
        console.log(this.data);
      },
    });
  }

  getEarnings(year: number, month: number) {
    var list = this.data.filter((d) => d.year == year && d.month == month);

    if (list.length == 0) return 0;

    var earningsList = list[0].transactions.filter((t) => t.type == 'CREDIT');

    var earnings = 0;
    earningsList.forEach((e) => (earnings += e.amount));

    return earnings;
  }

  getExpenditure(year: number, month: number) {
    var list = this.data.filter((d) => d.year == year && d.month == month);

    if (list.length == 0) return 0;

    var exList = list[0].transactions.filter((t) => t.type == 'DEBIT');

    var ex = 0;
    exList.forEach((e) => (ex += e.amount));

    return ex;
  }

  getSavings(year: number, month: number): number {
    return (
      this.getEarnings(year, month) -
      this.getExpenditure(year, month) +
      this.getPreviousSavings(year, month)
    );
  }

  getPreviousSavings(year: number, month: number): number {
    let minYear = Math.min(...this.data.map((d) => d.year));
    var minMonth = Math.min(
      ...this.data.filter((d) => d.year == minYear).map((d) => d.month)
    );

    if (year == minYear && month == minMonth) return 0;

    let prevYearMonth = this.getPreviousYearMonth(year, month);

    return this.getSavings(prevYearMonth.year, prevYearMonth.month);
  }

  getPreviousYearMonth(
    year: number,
    month: number
  ): { year: number; month: number } {
    if (month > 0) return { year: year, month: --month };
    return { year: --year, month: 11 };
  }

  hasIncome(transactions: Transaction[]): boolean {
    return transactions.filter((t) => t.type == 'CREDIT').length > 0;
  }

  hasExpense(transactions: Transaction[]): boolean {
    return transactions.filter((t) => t.type == 'DEBIT').length > 0;
  }
}
