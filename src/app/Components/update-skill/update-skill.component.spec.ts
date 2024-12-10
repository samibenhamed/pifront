import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSkillComponent } from './update-skill.component';

describe('UpdateSkillComponent', () => {
  let component: UpdateSkillComponent;
  let fixture: ComponentFixture<UpdateSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSkillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
