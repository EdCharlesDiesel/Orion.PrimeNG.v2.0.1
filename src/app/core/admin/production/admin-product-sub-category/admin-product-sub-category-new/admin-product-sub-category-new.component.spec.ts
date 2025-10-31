import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductSubCategoryNewComponent } from './admin-product-sub-category-new.component';

describe('AdminProductCategoryNewComponent', () => {
  let component: AdminProductSubCategoryNewComponent;
  let fixture: ComponentFixture<AdminProductSubCategoryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductSubCategoryNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductSubCategoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
