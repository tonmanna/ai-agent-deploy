import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBaseComponent } from '../shared/modal-base.component';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ModalBaseComponent],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmationModalComponent {
  @Input() title!: string;
  @Input() itemName!: string;
  @Input() description?: string;
  @Input() warningMessage?: string;
  @Input() additionalWarningMessage?: string;
  @Input() dependencies?: string[];
  @Input() dependencyTitle?: string;
  @Input() confirmText = 'Delete';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}