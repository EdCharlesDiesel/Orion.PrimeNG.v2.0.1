import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderTrackingMapComponent } from './admin-order-tracking-map.component';

describe('AdminOrderTrackingMapComponent', () => {
  let component: AdminOrderTrackingMapComponent;
  let fixture: ComponentFixture<AdminOrderTrackingMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderTrackingMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderTrackingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
