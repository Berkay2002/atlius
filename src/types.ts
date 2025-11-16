/**
 * Core data types for AtLius campus map application
 */

// Building names (Swedish)
export enum Building {
  KAKENHUS = 'Kåkenhus',
  TAPPAN = 'Täppan'
}

// Valid floor numbers
export type FloorNumber = 1 | 2 | 3 | 4 | 5;

// Building-specific floor constraints
export type KakenhusFloor = 1 | 2 | 3 | 4 | 5;
export type TappanFloor = 3 | 4 | 5;

// Room data interface
export interface RoomData {
  room: string;
  building: string;
  floor: number;
}

// Discriminated union for strict type safety
export type RoomDataStrict =
  | { room: string; building: Building.KAKENHUS; floor: KakenhusFloor }
  | { room: string; building: Building.TAPPAN; floor: TappanFloor };

// Component props interfaces
export interface LocationInfoProps {
  data: RoomData;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// SVG component type for lazy-loaded maps
export type LazySVGComponent = React.LazyExoticComponent<React.FC<React.SVGProps<SVGSVGElement>>>;

// Floor configuration interface
export interface FloorConfig {
  component: LazySVGComponent;
  header: string;
  floorCode: string;
}

// Building configuration for constants
export interface BuildingConstants {
  readonly TAPPAN: 'Täppan';
  readonly KAKENHUS: 'Kåkenhus';
}

export interface FloorCodeConstants {
  readonly TP3: 'TP3';
  readonly TP4: 'TP4';
  readonly TP5: 'TP5';
  readonly K1: 'K1';
  readonly K2: 'K2';
  readonly K3: 'K3';
  readonly K4: 'K4';
  readonly K5: 'K5';
}

export interface MapNameConstants {
  readonly TAPPAN_3: 'Täppan3';
  readonly TAPPAN_4: 'Täppan4';
  readonly TAPPAN_5: 'Täppan5';
  readonly KAKENHUS_1: 'Kåkenhus1';
  readonly KAKENHUS_2: 'Kåkenhus2';
  readonly KAKENHUS_3: 'Kåkenhus3';
  readonly KAKENHUS_4: 'Kåkenhus4';
  readonly KAKENHUS_5: 'Kåkenhus5';
  readonly TAPPAN: 'Täppan';
  readonly KAKENHUS: 'Kåkenhus';
}
