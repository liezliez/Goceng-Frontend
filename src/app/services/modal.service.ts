import { Injectable, Injector, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private overlayRef?: OverlayRef;

  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {}

  open(component: any, data?: any): void {
    if (this.overlayRef) {
      this.close();
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    const injector = Injector.create({
      providers: [{ provide: 'MODAL_DATA', useValue: data }],
      parent: this.injector
    });

    const portal = new ComponentPortal(component, null, injector);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
