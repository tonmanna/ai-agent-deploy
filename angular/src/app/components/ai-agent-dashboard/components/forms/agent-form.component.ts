import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Collection, NewAgent } from '../../types';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentFormComponent {
  @Input() agent!: NewAgent;
  @Input() collections!: Collection[];
  @Input() selectedCollections!: number[];
  @Input() showValidation = false;

  @Output() updateAgent = new EventEmitter<{field: keyof NewAgent, value: any}>();
  @Output() toggleCollection = new EventEmitter<number>();
  @Output() clearSelection = new EventEmitter<void>();

  trackByCollectionId(index: number, collection: Collection): number {
    return collection.id;
  }

  isCollectionSelected(collectionId: number): boolean {
    return this.selectedCollections.includes(collectionId);
  }

  onUpdateAgent(field: keyof NewAgent, value: any): void {
    this.updateAgent.emit({ field, value });
  }

  onToggleCollection(collectionId: number): void {
    this.toggleCollection.emit(collectionId);
  }

  onClearSelection(): void {
    this.clearSelection.emit();
  }

  getTotalDocuments(): number {
    return this.selectedCollections.reduce((total, colId) => {
      const collection = this.collections.find(c => c.id === colId);
      return total + (collection ? collection.documents.length : 0);
    }, 0);
  }

  getSelectedCollectionNames(): string[] {
    return this.selectedCollections.map(colId => {
      const collection = this.collections.find(c => c.id === colId);
      return collection ? collection.name : '';
    }).filter(name => name);
  }
}