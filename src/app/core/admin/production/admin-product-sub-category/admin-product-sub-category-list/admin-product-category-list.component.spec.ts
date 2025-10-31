import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductCategoryListComponent } from './admin-product-category-list.component';

describe('AdminProductCategoryListComponent', () => {
  let component: AdminProductCategoryListComponent;
  let fixture: ComponentFixture<AdminProductCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
