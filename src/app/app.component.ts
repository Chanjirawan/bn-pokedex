import { Component, HostListener } from '@angular/core';
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

@HostListener('document:pointerdown', ['$event'])
onPointerDown(event: PointerEvent): void {
  const ripple = document.createElement('span');
  ripple.className = 'click-ripple';

  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;

  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 200);
}


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
    const keyword = this.searchText.trim().toLowerCase();

    const types = [
      'fire', 'water', 'grass', 'psychic', 'fighting',
      'fairy', 'normal', 'metal', 'darkness', 'lightning'
    ];

    let url = `http://localhost:3030/api/cards?limit=30`;

    if (types.includes(keyword)) {
      url += `&type=${keyword}`;
    } else {
      url += `&name=${keyword}`;
    }

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
    const hp = parseInt(p.hp, 10) || 0;
    return Math.min(Math.max(hp, 0), 100);
  }

  getStrength(p: Pokemon): number {
    return Math.min((p.attacks?.length || 0) * 50, 100);
  }

  getWeakness(p: Pokemon): number {
    return Math.min((p.weaknesses?.length || 0) * 100, 100);
  }

  getDamage(p: Pokemon): number {
    if (!p.attacks) return 0;
    return p.attacks.reduce((sum, atk) => {
      const dmg = parseInt(atk.damage.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + dmg;
    }, 0);
  }

  getHappiness(p: Pokemon): number {
    const hp = this.getHP(p);
    const damage = this.getDamage(p);
    const weakness = this.getWeakness(p);

    const happiness = ((hp / 10) + (damage / 10) + 10 - (weakness / 100)) / 5;
    return Math.max(0, Math.floor(happiness));
  }

  getHappinessArray(p: Pokemon): number[] {
    return Array(this.getHappiness(p)).fill(0);
  }
}
