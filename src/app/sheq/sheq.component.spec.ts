import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheqComponent } from './sheq.component';

describe('SheqComponent', () => {
  let component: SheqComponent;
  let fixture: ComponentFixture<SheqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
