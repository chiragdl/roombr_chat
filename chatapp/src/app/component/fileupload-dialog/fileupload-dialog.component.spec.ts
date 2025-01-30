import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadDialogComponent } from './fileupload-dialog.component';

describe('FileuploadDialogComponent', () => {
  let component: FileuploadDialogComponent;
  let fixture: ComponentFixture<FileuploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileuploadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileuploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
