import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ComboBox } from '../demo-data';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() placeholder: string;
  placeholderLabel: string;
  noEntriesFoundLabel: string;
  /** list of banks */
  @Input() lista: ComboBox[] = [];
  @Input() valorDefault: any;
  @Output() itemSelecionado = new EventEmitter<any>();

  /** control for the selected bank */
  public formControl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public formControlFilter: FormControl = new FormControl();
  /** list of banks filtered by search keyword */
  public filteredComboBox: ReplaySubject<ComboBox[]> = new ReplaySubject<ComboBox[]>(1);

  @ViewChild('comboBoxElement', { static: true }) comboBoxElement: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor() { }

  ngOnInit() {
    this.placeholderLabel = 'Pesquisar ' + this.placeholder;
    this.noEntriesFoundLabel = this.placeholder + ' não localizado';
    // set initial selection
    if (this.valorDefault) {
      this.formControl.setValue(this.lista.find(x => x.id === this.valorDefault));
    }

    // load the initial bank list
    this.filteredComboBox.next(this.lista.slice());

    // listen for search field value changes
    this.formControlFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtrarComboBox();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredComboBox are loaded initially
   */
  protected setInitialValue() {
    this.filteredComboBox
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredComboBox are loaded initially
        // and after the mat-option elements are available
        this.comboBoxElement.compareWith = (a: ComboBox, b: ComboBox) => a && b && a.id === b.id;
      });
  }

  protected filtrarComboBox() {
    if (!this.lista) {
      return;
    }
    // get the search keyword
    let search = this.formControlFilter.value;
    if (!search) {
      this.filteredComboBox.next(this.lista.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredComboBox.next(
      this.lista.filter(d => d.text.toLowerCase().indexOf(search) > -1)
    );
  }

  selectionChange(event) {
    this.itemSelecionado.emit(event.value.id);
  }
}
