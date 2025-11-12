import { TestBed } from '@angular/core/testing';

import { EquipmentNotificationService } from './equipment-notification.service';

describe('EquipmentNotificationService', () => {
  let service: EquipmentNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
