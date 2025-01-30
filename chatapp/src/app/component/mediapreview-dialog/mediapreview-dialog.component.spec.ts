import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediapreviewDialogComponent } from './mediapreview-dialog.component';

describe('MediapreviewDialogComponent', () => {
  let component: MediapreviewDialogComponent;
  let fixture: ComponentFixture<MediapreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediapreviewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediapreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
