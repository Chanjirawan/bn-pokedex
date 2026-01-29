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
  hp?: string;
  attacks?: { name: string; damage: string }[];
  weaknesses?: { type: string; value: string }[];
  imageUrl: string;
  imageUrlHiRes?: string;
  type?: string;
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
  searchName = '';
  searchType = '';

  constructor(private http: HttpClient) {}

  openModal(): void {
    this.isModalOpen = true;
    this.searchPokemon();
  }

  closeModal(event?: Event): void {
    if (!event || (event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.isModalOpen = false;
    }
  }

  searchPokemon(): void {
    let url = `http://localhost:3030/api/cards?limit=30`;
    if (this.searchName) url += `&name=${this.searchName}`;
    if (this.searchType) url += `&type=${this.searchType}`;

    this.http.get<any>(url).subscribe((res) => {
      const cards = res.cards || [];
      this.searchResult = cards.filter(
        (card: Pokemon) => !this.myPokedex.some((p) => p.id === card.id)
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

  getHP(pokemon: Pokemon): number {
    const hp = parseInt(pokemon.hp || '0');
    return hp > 100 ? 100 : hp;
  }

  getStrength(pokemon: Pokemon): number {
    const attackCount = pokemon.attacks?.length || 0;
    const str = attackCount * 50;
    return str > 100 ? 100 : str;
  }

  getWeakness(pokemon: Pokemon): number {
    const weakCount = pokemon.weaknesses?.length || 0;
    const weak = weakCount * 100;
    return weak > 100 ? 100 : weak;
  }

  getDamage(pokemon: Pokemon): number {
    if (!pokemon.attacks) return 0;
    return pokemon.attacks.reduce((total, atk) => {
      const val = parseInt(atk.damage.replace(/[^0-9]/g, '')) || 0;
      return total + val;
    }, 0);
  }

  getHappiness(pokemon: Pokemon): number {
    const hp = this.getHP(pokemon);
    const damage = this.getDamage(pokemon);
    const weakness = pokemon.weaknesses?.length || 0;
    const happiness = ((hp / 10) + (damage / 10) + 10 - weakness) / 5;
    return Math.max(0, Math.round(happiness));
  }

  getHappinessArray(pokemon: Pokemon): any[] {
    return new Array(this.getHappiness(pokemon));
  }
}
