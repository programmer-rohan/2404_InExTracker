import { Component, OnInit, assertInInjectionContext } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

export interface Transaction {
  id: number;
  date: Date;
  description: string;
  amount: number;
  type: string;
  createdOn: Date;
}

@Component({
  selector: 'maintenance',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent implements OnInit {
  years: number[] = [];
  months: { index: number; name: string }[] = [];
  transactionForm: FormGroup = this.fb.group(
    {
      id: this.fb.control(0),
      year: this.fb.control(2024, [Validators.required]),
      month: this.fb.control(3, [Validators.required]),
      date: this.fb.control(null, [Validators.required]),
      description: this.fb.control('', [Validators.required]),
      amount: this.fb.control(null, [Validators.required]),
      type: this.fb.control('DEBIT', [Validators.required]),
    },
    { validators: [this.dateValidator] }
  );
  dataSource = new MatTableDataSource<Transaction>();
  columns = [
    'id',
    'date',
    'description',
    'amount',
    'type',
    'createdOn',
    'delete',
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    for (var year = new Date().getFullYear(); year >= 2021; year--)
      this.years.push(year);

    this.months = [
      { index: 0, name: 'January' },
      { index: 1, name: 'February' },
      { index: 2, name: 'March' },
      { index: 3, name: 'April' },
      { index: 4, name: 'May' },
      { index: 5, name: 'June' },
      { index: 6, name: 'July' },
      { index: 7, name: 'August' },
      { index: 8, name: 'September' },
      { index: 9, name: 'October' },
      { index: 10, name: 'November' },
      { index: 11, name: 'December' },
    ];

    // this.dataSource.data = [
    //   {
    //     id: 1,
    //     date: new Date(),
    //     description: 'Hospitalizatoin in Jehangir',
    //     amount: 100,
    //     type: 'DEBIT',
    //     createdOn: new Date(),
    //   },
    //   {
    //     id: 0,
    //     date: new Date(2023, 5, 25),
    //     description: 'Hospitalizatoin in Jehangir',
    //     amount: 500,
    //     type: 'CREDIT',
    //     createdOn: new Date(2023, 5, 25),
    //   },
    // ];
  }

  ngOnInit(): void {
    this.apiService.getAllTransactions().subscribe({
      next: (res: Transaction[]) => {
        this.dataSource.data = res;
      },
    });
  }

  dateValidator(control: AbstractControl) {
    var date = control.get('date')?.value;
    var month = control.get('month')?.value;
    var validValues = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (date <= validValues[month]) control.get('date')?.setErrors(null);
    else control.get('date')?.setErrors({ invalidDate: true });
  }

  insertForm() {
    var transaction = {
      id: this.IdControl.value,
      date: new Date(
        this.YearControl.value,
        this.MonthControl.value,
        this.DateControl.value
      ),
      description: this.DescriptionControl.value,
      amount: this.AmountControl.value,
      type: this.TxTypeControl.value,
      createdOn: new Date(),
    };
    this.apiService.upsertTransaction(transaction).subscribe({
      next: (res: Transaction) => {
        this.transactionForm.reset();
        this.IdControl.setValue(0);
        this.YearControl.setValue(new Date().getFullYear());
        this.MonthControl.setValue(new Date().getMonth() - 1);
        this.TxTypeControl.setValue('DEBIT');
        this.dataSource.data = [res, ...this.dataSource.data];
      },
    });
  }

  edit(transactionToEdit: Transaction) {
    this.dataSource.data = this.dataSource.data.filter(
      (v) => v.id != transactionToEdit.id
    );

    this.IdControl.setValue(transactionToEdit.id);
    this.YearControl.setValue(new Date(transactionToEdit.date).getFullYear());
    this.MonthControl.setValue(new Date(transactionToEdit.date).getMonth());
    this.DateControl.setValue(new Date(transactionToEdit.date).getDate());
    this.DescriptionControl.setValue(transactionToEdit.description);
    this.AmountControl.setValue(transactionToEdit.amount);
    this.TxTypeControl.setValue(transactionToEdit.type);
  }

  deleteElement(transaction: Transaction) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Confirmation',
        message: 'This will delete the transaction. Are you sure?',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (res: boolean) => {
        if (res === true) {
          this.apiService.deleteTransaction(transaction.id).subscribe({
            next: (res: string) => {
              this.snackBar.open(res, 'OK');
              if (res == 'deleted')
                this.dataSource.data = this.dataSource.data.filter(
                  (v) => v.id != transaction.id
                );
            },
          });
          this.snackBar.open('Item Delted', 'OK');
        }
      },
    });
  }

  //#region Form Control Getters
  get IdControl(): AbstractControl {
    return this.transactionForm.get('id') as AbstractControl;
  }

  get YearControl(): AbstractControl {
    return this.transactionForm.get('year') as AbstractControl;
  }

  get MonthControl(): AbstractControl {
    return this.transactionForm.get('month') as AbstractControl;
  }

  get DateControl(): AbstractControl {
    return this.transactionForm.get('date') as AbstractControl;
  }

  get DescriptionControl(): AbstractControl {
    return this.transactionForm.get('description') as AbstractControl;
  }

  get AmountControl(): AbstractControl {
    return this.transactionForm.get('amount') as AbstractControl;
  }

  get TxTypeControl(): AbstractControl {
    return this.transactionForm.get('type') as AbstractControl;
  }
  //#endregion
}
