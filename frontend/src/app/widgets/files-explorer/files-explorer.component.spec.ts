import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesExplorerComponent } from './files-explorer.component';

describe('FilesExplorerComponent', () => {
  let component: FilesExplorerComponent;
  let fixture: ComponentFixture<FilesExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesExplorerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
