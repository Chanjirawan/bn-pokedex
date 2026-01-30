import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const COLORS: Record<string, string> = {
  Psychic: '#f8a5c2',
  Fighting: '#f0932b',
  Fairy: '#c44569',
  Normal: '#f6e58d',
  Grass: '#badc58',
  Metal: '#95afc0',
  Water: '#3dc1d3',
  Lightning: '#f9ca24',
  Darkness: '#574b90',
  Colorless: '#ffffff',
  Fire: '#eb4d4b',
};


interface Pokemon {
  id: string;
  name: string;
  hp: string;
  attacks?: { name: string; damage: string }[];
  weaknesses?: { type: string; value: string }[];
  imageUrl: string;
  type: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'bn-pokedex';

  myPokedex: Pokemon[] = [];
  searchResult: Pokemon[] = [];
  isModalOpen = false;
  searchText = '';

  constructor(private http: HttpClient) {}

  openModal(): void {
    this.isModalOpen = true;
    this.searchPokemon();
  }

  closeModal(event?: Event): void {
    if (!event || (event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.isModalOpen = false;
      this.searchText = '';
    }
  }

  searchPokemon(): void {
    const url = `http://localhost:3030/api/cards?limit=30&name=${this.searchText.toLowerCase()}&type=${this.searchText.toLowerCase()}`;

    this.http.get<{ cards: Pokemon[] }>(url).subscribe((res) => {
      const cards = res.cards || [];
      this.searchResult = cards.filter(
        (card) => !this.myPokedex.some((p) => p.id === card.id)
      );
    });
  }

  addPokemon(pokemon: Pokemon): void {
    this.myPokedex.push(pokemon);
    this.searchResult = this.searchResult.filter((p) => p.id !== pokemon.id);
  }

  removePokemon(id: string): void {
    this.myPokedex = this.myPokedex.filter((p) => p.id !== id);
  }

  getHP(p: Pokemon): number {
    const hp = parseInt(p.hp) || 0;
    return hp > 100 ? 100 : hp < 0 ? 0 : hp;
  }

  getStrength(p: Pokemon): number {
    const attacks = p.attacks?.length || 0;
    const str = attacks * 50;
    return str > 100 ? 100 : str;
  }

  getWeakness(p: Pokemon): number {
    const weaknesses = p.weaknesses?.length || 0;
    const weak = weaknesses * 100;
    return weak > 100 ? 100 : weak;
  }

  getDamage(p: Pokemon): number {
    if (!p.attacks) return 0;
    return p.attacks.reduce((total, atk) => {
      const val = parseInt(atk.damage.replace(/[^0-9]/g, '')) || 0;
      return total + val;
    }, 0);
  }

  getHappiness(p: Pokemon): number {
    const hp = this.getHP(p);
    const damage = this.getDamage(p);
    const weakness = (p.weaknesses?.length || 0) * 100 > 100 ? 100 : (p.weaknesses?.length || 0) * 100;

    const happiness = ((hp / 10) + (damage / 10) + 10 - (weakness / 100)) / 5;
    return Math.max(0, Math.floor(happiness));
  }

  getHappinessArray(p: Pokemon): any[] {
    return new Array(this.getHappiness(p));
  }
}
