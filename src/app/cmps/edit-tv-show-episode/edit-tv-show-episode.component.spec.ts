import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTvShowEpisodeComponent } from './edit-tv-show-episode.component';

describe('EditTvShowEpisodeComponent', () => {
  let component: EditTvShowEpisodeComponent;
  let fixture: ComponentFixture<EditTvShowEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTvShowEpisodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTvShowEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
