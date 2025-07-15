import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCallsComponent } from './list-of-calls.component';

describe('ListOfCallsComponent', () => {
  let component: ListOfCallsComponent;
  let fixture: ComponentFixture<ListOfCallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfCallsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
