import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullProductListComponent } from './full-product-list.component';

describe('FullProductListComponent', () => {
  let component: FullProductListComponent;
  let fixture: ComponentFixture<FullProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
