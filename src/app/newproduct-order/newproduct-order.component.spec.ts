import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewproductOrderComponent } from './newproduct-order.component';

describe('NewproductOrderComponent', () => {
  let component: NewproductOrderComponent;
  let fixture: ComponentFixture<NewproductOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewproductOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewproductOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
