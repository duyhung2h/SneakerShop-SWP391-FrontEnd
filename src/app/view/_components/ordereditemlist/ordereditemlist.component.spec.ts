import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdereditemlistComponent } from './ordereditemlist.component';

describe('OrdereditemlistComponent', () => {
  let component: OrdereditemlistComponent;
  let fixture: ComponentFixture<OrdereditemlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdereditemlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdereditemlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
