import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaProdutos } from './categoria-produtos';

describe('CategoriaProdutos', () => {
  let component: CategoriaProdutos;
  let fixture: ComponentFixture<CategoriaProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
