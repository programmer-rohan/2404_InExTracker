import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from '../maintenance/maintenance.component';
import { MaterialModule } from '../material/material.module';
import { NumberPipe } from '../number.pipe';

@Component({
  selector: 'in-ex-table',
  standalone: true,
  imports: [MaterialModule, NumberPipe],
  templateUrl: './in-ex-table.component.html',
  styleUrl: './in-ex-table.component.scss',
})
export class InExTableComponent implements OnInit {
  @Input() type: 'CREDIT' | 'DEBIT' = 'CREDIT';
  @Input() transactions: Transaction[] = [];

  columns: string[] = ['id', 'date', 'description', 'amount'];
  dataSource = new MatTableDataSource<Transaction>();
  transactionsToDisplay: Transaction[] = [];

  ngOnInit(): void {
    this.transactionsToDisplay = this.transactions.filter(
      (t) => t.type == this.type
    );
    this.dataSource.data = this.transactionsToDisplay;
  }
}
