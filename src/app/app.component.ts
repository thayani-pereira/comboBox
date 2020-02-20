import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/material/core';
import { Bank, BANKS, ComboBox, Generos } from './demo-data';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  version = VERSION;

  matSelectSearchVersion = MatSelectSearchVersion;
  banks: Bank[] = BANKS;
  listaBancos: any;
  listaGenero: any;
  valorDefaultBanco: string;
  valorDefaultGenero: string;

  ngOnInit() {
    this.listaBancos = this.banks.map(banco => ({
      id: banco.id,
      text: banco.name
    }));

    this.valorDefaultBanco = this.banks[10].id;

    this.listaGenero = Generos.map(genero => ({
      id: genero.id,
      text: genero.name
    }));

    this.valorDefaultGenero = this.listaGenero[1].id;
  }

  itemSelecionadoBanco(event) {
    console.log('Banco ' + event);
  }

  itemSelecionadoGenero(event) {
    console.log('Genero ' + event);
  }
}
