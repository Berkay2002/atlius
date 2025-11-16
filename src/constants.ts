import { BuildingConstants, FloorCodeConstants, MapNameConstants } from './types';

// Building names
export const BUILDINGS: BuildingConstants = {
  TAPPAN: 'Täppan',
  KAKENHUS: 'Kåkenhus'
} as const;

// Floor codes for navigation
export const FLOOR_CODES: FloorCodeConstants = {
  TP3: 'TP3',
  TP4: 'TP4',
  TP5: 'TP5',
  K1: 'K1',
  K2: 'K2',
  K3: 'K3',
  K4: 'K4',
  K5: 'K5'
} as const;

// Map names for floor rendering
export const MAP_NAMES: MapNameConstants = {
  TAPPAN_3: 'Täppan3',
  TAPPAN_4: 'Täppan4',
  TAPPAN_5: 'Täppan5',
  KAKENHUS_1: 'Kåkenhus1',
  KAKENHUS_2: 'Kåkenhus2',
  KAKENHUS_3: 'Kåkenhus3',
  KAKENHUS_4: 'Kåkenhus4',
  KAKENHUS_5: 'Kåkenhus5',
  TAPPAN: 'Täppan',
  KAKENHUS: 'Kåkenhus'
} as const;
