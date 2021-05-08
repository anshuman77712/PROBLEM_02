import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// Declaring the column names and their data tye
export interface MyTableItem {
  name: string;
  Roll: number;
  Department: string;
}

// Data for the table
const EXAMPLE_DATA: MyTableItem[] = [
  {Roll: 20011001, name: 'Theodore' , Department: 'Metallurgy'},
  {Roll: 20010005, name: 'Marshall' , Department: 'Aerospace'},
  {Roll: 190110015, name: 'Robin' , Department: 'Electrical'},
  {Roll: 20000015, name: 'Lily' , Department: 'Computer-Science'},
  {Roll: 20000101, name: 'Michael' , Department: 'Chemistry'},
  {Roll: 20000454, name: 'Dwight' , Department: 'Economics'},
  {Roll: 20007894, name: 'Pamela' , Department: 'Computer-Science'},
  {Roll: 20000134, name: 'Phyllis' , Department: 'Mechanical'},
  {Roll: 20007235, name: 'Oscar' , Department: 'Mathematics'},
  {Roll: 20078945, name: 'Barney' , Department: 'Mechanical'},
  {Roll: 19078854, name: 'Lara' , Department: 'Environmental Engineering'},
  {Roll: 19078854, name: 'Stella' , Department: 'Aerospace'},
  {Roll: 18078854, name: 'Victor' , Department: 'Electrical Engineering'},
  {Roll: 19068896, name: 'McTavish' , Department: 'Computer-Science'},
  {Roll: 17068896, name: 'Jacob' , Department: 'Mechanical'},
  {Roll: 20068896, name: 'Emma' , Department: 'Environmental Engineering'},
  {Roll: 20067836, name: 'Jayden' , Department: 'Energy Science'},
  {Roll: 20068896, name: 'William' , Department: 'Metallurgy'}
];

/**
 * Data source for the MyTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MyTableDataSource extends DataSource<MyTableItem> {
  data: MyTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<MyTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: MyTableItem[]): MyTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: MyTableItem[]): MyTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'Roll': return compare(+a.Roll, +b.Roll, isAsc);
        case 'Department':  return compare(a.Department, b.Department, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
