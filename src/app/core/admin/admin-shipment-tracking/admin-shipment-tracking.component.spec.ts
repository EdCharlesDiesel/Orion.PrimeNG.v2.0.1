import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShipmentTrackingComponent } from './admin-shipment-tracking.component';

describe('AdminShipmentTrackingComponent', () => {
  let component: AdminShipmentTrackingComponent;
  let fixture: ComponentFixture<AdminShipmentTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShipmentTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShipmentTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
