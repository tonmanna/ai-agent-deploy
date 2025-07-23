import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent, Collection } from '../../types';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentCardComponent {
  @Input() agent!: Agent;
  @Input() collections!: Collection[];

  @Output() edit = new EventEmitter<Agent>();
  @Output() delete = new EventEmitter<Agent>();
  @Output() editPrompt = new EventEmitter<Agent>();

  trackByCollectionId(index: number, collectionId: number): number {
    return collectionId;
  }

  getCollectionName(collectionId: number): string {
    const collection = this.collections.find(c => c.id === collectionId);
    return collection ? collection.name : 'Unknown Collection';
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700'
    };
    return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }

  onEdit(): void {
    this.edit.emit(this.agent);
  }

  onDelete(): void {
    this.delete.emit(this.agent);
  }

  onEditPrompt(): void {
    this.editPrompt.emit(this.agent);
  }
}