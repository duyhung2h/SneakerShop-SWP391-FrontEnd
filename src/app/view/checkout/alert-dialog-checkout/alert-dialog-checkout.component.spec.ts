import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogCheckoutComponent } from './alert-dialog-checkout.component';

describe('AlertDialogCheckoutComponent', () => {
  let component: AlertDialogCheckoutComponent;
  let fixture: ComponentFixture<AlertDialogCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDialogCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
