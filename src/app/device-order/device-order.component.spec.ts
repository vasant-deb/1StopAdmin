import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderComponent } from './device-order.component';

describe('DeviceOrderComponent', () => {
  let component: DeviceOrderComponent;
  let fixture: ComponentFixture<DeviceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
