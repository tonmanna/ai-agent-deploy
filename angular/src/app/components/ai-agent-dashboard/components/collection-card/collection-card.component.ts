import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collection } from '../../types';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionCardComponent {
  @Input() collection!: Collection;

  @Output() view = new EventEmitter<Collection>();
  @Output() edit = new EventEmitter<Collection>();
  @Output() delete = new EventEmitter<Collection>();

  trackByType(index: number, type: string): string {
    return type;
  }

  getUniqueDocumentTypes(): string[] {
    const types = this.collection.documents.map(doc => doc.type);
    return [...new Set(types)].slice(0, 5); // Show max 5 types
  }

  getTotalSize(): string {
    if (this.collection.documents.length === 0) return '0 KB';
    
    let totalBytes = 0;
    this.collection.documents.forEach(doc => {
      // Parse size string like "2.4 MB" to bytes
      const sizeMatch = doc.size.match(/^([0-9.]+)\s*(KB|MB|GB)$/i);
      if (sizeMatch) {
        const value = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        const multipliers: { [key: string]: number } = {
          'KB': 1024,
          'MB': 1024 * 1024,
          'GB': 1024 * 1024 * 1024
        };
        totalBytes += value * (multipliers[unit] || 1);
      }
    });
    
    // Convert back to readable format
    if (totalBytes >= 1024 * 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (totalBytes >= 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (totalBytes >= 1024) {
      return `${(totalBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${totalBytes} B`;
    }
  }

  onView(): void {
    this.view.emit(this.collection);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.collection);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.collection);
  }
}