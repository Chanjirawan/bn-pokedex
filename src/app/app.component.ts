import { Component } from '@angular/core';

const COLORS = {
  Psychic: '#f8a5c2',
  Fighting: '#f0932b',
  Fairy: '#c44569',
  Normal: '#f6e58d',
  Grass: '#badc58',
  Metal: '#95afc0',
  Water: '#3dc1d3',
  Lightning: '#f9ca24',
  Darkness: '#574b90',
  Colorless: '#FFF',
  Fire: '#eb4d4b',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  title = 'bn-pokedex';

  myPokedex: any[] = [];
  searchResult: any[] = [];

  isModalOpen = false;
  searchName = '';
  searchType = '';

  openModal() {
    this.isModalOpen = true;
  }

  closeModal(event: Event) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.isModalOpen = false;
    }
  }

  searchPokemon() {
    this.searchResult = [];
  }

  addPokemon(pokemon: any) {
    this.myPokedex.push(pokemon);
  }

  removePokemon(id: any) {
    this.myPokedex = this.myPokedex.filter(p => p.id !== id);
  }
}

