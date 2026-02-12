import { Pitch } from './pitch.entity';

export interface IPitchRepository {
  save(pitch: Pitch): Promise<Pitch>;
  findById(id: string): Promise<Pitch | null>;
  findByOrganizationId(organizationId: string): Promise<Pitch[]>;
  findBySongId(songId: string): Promise<Pitch[]>;
  findByCreatedById(
    createdById: string,
    organizationId: string,
  ): Promise<Pitch[]>;
  delete(id: string): Promise<void>;
}

export const PITCH_REPOSITORY = 'PITCH_REPOSITORY';
