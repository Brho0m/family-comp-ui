import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickOrderComponent } from './click-order.component';

describe('ClickOrderComponent', () => {
  let component: ClickOrderComponent;
  let fixture: ComponentFixture<ClickOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClickOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
