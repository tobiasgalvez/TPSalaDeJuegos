import { TestBed } from '@angular/core/testing';

import { PasapalabraService } from './pasapalabra.service';

describe('PasapalabraService', () => {
  let service: PasapalabraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasapalabraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
