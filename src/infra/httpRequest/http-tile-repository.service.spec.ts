import { TestBed } from '@angular/core/testing';

import { HttpTileRepositoryService } from './http-tile-repository.service';

describe('HttpTileRepositoryService', () => {
  let service: HttpTileRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTileRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
