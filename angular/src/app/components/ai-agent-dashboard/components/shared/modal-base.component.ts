import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalBaseComponent {
  @Input() title!: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showActions = true;
  @Input() showPrimaryAction = true;
  @Input() cancelText = 'Cancel';
  @Input() primaryActionText = 'Save';
  @Input() primaryActionDisabled = false;
  @Input() primaryActionType: 'primary' | 'danger' = 'primary';

  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() primaryAction = new EventEmitter<void>();

  get modalSizeClass(): string {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };
    return sizes[this.size];
  }

  get primaryActionClass(): string {
    return `primary-button ${this.primaryActionType}`;
  }

  onClose(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }
}