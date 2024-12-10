import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiplomaComponent } from './add-diploma.component';

describe('AddDiplomaComponent', () => {
  let component: AddDiplomaComponent;
  let fixture: ComponentFixture<AddDiplomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDiplomaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDiplomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
