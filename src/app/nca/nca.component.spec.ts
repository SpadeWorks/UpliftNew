import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcaComponent } from './nca.component';

describe('NcaComponent', () => {
  let component: NcaComponent;
  let fixture: ComponentFixture<NcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
