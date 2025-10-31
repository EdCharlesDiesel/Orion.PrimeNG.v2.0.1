import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductCategoryNewComponent } from './admin-product-category-new.component';

describe('AdminProductCategoryNewComponent', () => {
  let component: AdminProductCategoryNewComponent;
  let fixture: ComponentFixture<AdminProductCategoryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductCategoryNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductCategoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
