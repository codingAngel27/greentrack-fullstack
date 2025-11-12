import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansModalComponent } from './loans-modal.component';

describe('LoansModalComponent', () => {
  let component: LoansModalComponent;
  let fixture: ComponentFixture<LoansModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoansModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
