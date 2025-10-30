import { ComponentFixture, TestBed } from '@angular/core/testing';

class ProductsComponent {}

describe('ProductsComponent', () => {
    let component: ProductsComponent;
    let fixture: ComponentFixture<ProductsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProductsComponent]
        });
        fixture = TestBed.createComponent(ProductsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
