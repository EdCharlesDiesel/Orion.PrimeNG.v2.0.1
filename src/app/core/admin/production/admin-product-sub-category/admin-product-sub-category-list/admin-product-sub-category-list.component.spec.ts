import { ComponentFixture, TestBed } from '@angular/core/testing';

import AdminProductSubCategoryListComponent from './admin-product-sub-category-list.component';

describe('AdminProductCategoryListComponent', () => {
  let component: AdminProductSubCategoryListComponent;
  let fixture: ComponentFixture<AdminProductSubCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductSubCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductSubCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
