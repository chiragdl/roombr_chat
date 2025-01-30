import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilepreviewDialogComponent } from './filepreview-dialog.component';

describe('FilepreviewDialogComponent', () => {
  let component: FilepreviewDialogComponent;
  let fixture: ComponentFixture<FilepreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilepreviewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilepreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
