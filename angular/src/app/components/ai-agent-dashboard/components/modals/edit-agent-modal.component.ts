import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent, Collection } from '../../types';
import { ModalBaseComponent } from '../shared/modal-base.component';

@Component({
  selector: 'app-edit-agent-modal',
  standalone: true,
  imports: [CommonModule, ModalBaseComponent],
  templateUrl: './edit-agent-modal.component.html',
  styleUrls: ['./edit-agent-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAgentModalComponent {
  @Input() agent!: Agent;
  @Input() collections!: Collection[];
  @Input() selectedCollections!: number[];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() toggleCollection = new EventEmitter<number>();
  @Output() editPrompt = new EventEmitter<void>();

  trackByCollectionId(index: number, collection: Collection): number {
    return collection.id;
  }

  isCollectionSelected(collectionId: number): boolean {
    return this.selectedCollections.includes(collectionId);
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
  }

  onToggleCollection(collectionId: number): void {
    this.toggleCollection.emit(collectionId);
  }

  onEditPrompt(): void {
    this.editPrompt.emit();
  }
}