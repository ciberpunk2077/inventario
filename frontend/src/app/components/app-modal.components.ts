import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],   // ← ← ← OBLIGATORIO
  template: `
  <div *ngIf="visible" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl animate-fadeIn flex flex-col max-h-[90vh]">
      
      <!-- HEADER -->
      <div class="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
        <button (click)="onClose()" class="text-gray-500 hover:text-red-600 text-2xl">✕</button>
      </div>

      <!-- BODY -->
      <div class="px-6 py-4 overflow-y-auto custom-scroll-area">
        <ng-container *ngIf="templateRef; else projected">
          <ng-container *ngTemplateOutlet="templateRef; context: templateContext"></ng-container>
        </ng-container>

        <ng-template #projected>
          <ng-content></ng-content>
        </ng-template>
      </div>

      <!-- FOOTER -->
      <div *ngIf="showFooter" class="px-6 py-4 border-t bg-white">
        <ng-content select="[modal-footer]"></ng-content>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .custom-scroll-area { max-height: 60vh; overflow-y: auto; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
    .animate-fadeIn { animation: fadeIn 0.18s ease-out; }
  `]
})
export class AppModal {
  @Input() visible = false;
  @Input() title = '';
  @Input() templateRef?: TemplateRef<any>;
  @Input() templateContext: any = {};
  @Input() showFooter = true;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
