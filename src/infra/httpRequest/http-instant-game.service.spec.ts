import { TestBed } from '@angular/core/testing';

import { HttpInstantGameService } from './http-instant-game.service';

describe('HttpInstantGameService', () => {
  let service: HttpInstantGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInstantGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
