import { useState, useEffect, useCallback } from 'react';
import { SUB_CHURCHES } from '../data/parishData';

export interface ExecutiveMember {
  id?: string;
  name: string;
  role: string;
}

export interface SubStationGovernanceData {
  societies: string[];
  executiveCouncil: ExecutiveMember[];
}

export type SubStationsGovernanceRecord = Record<'st-anthony' | 'st-matthew' | 'holy-spirit', SubStationGovernanceData>;

export const DEFAULT_GOVERNANCE_DATA: SubStationsGovernanceRecord = {
  'st-anthony': {
    societies: [
      'St. Anthony Guild & Society',
      'Christian Mothers Society (St. Anthony Branch)',
      'Catholic Men Association (St. Anthony Branch)',
      'St. Anthony Youth Fellowship',
      'St. Anthony Liturgical Choir'
    ],
    executiveCouncil: [
      { role: 'Outstation Committee Chairman', name: 'Mr. Joseph Tetteh' },
      { role: 'Secretary', name: 'Ms. Faustina Mensah' },
      { role: 'Treasurer', name: 'Mrs. Philomena Agyapong' },
      { role: 'St. Anthony Guild President', name: 'Mr. Matthew Mensah' }
    ]
  },
  'st-matthew': {
    societies: [
      'St. Matthew Evangelization Circle',
      'Catholic Men Association (St. Matthew Branch)',
      'Christian Mothers (St. Matthew Branch)',
      'St. Matthew Angelic Voices Choir',
      'CYO St. Matthew Brigade'
    ],
    executiveCouncil: [
      { role: 'Outstation Committee Chairman', name: 'Mr. Emmanuel Appiah' },
      { role: 'Vice-Chairman', name: 'Mr. Clement Nuamah' },
      { role: 'Secretary', name: 'Mrs. Benedicta Ofori' },
      { role: 'Financial Secretary', name: 'Mr. Samuel B. Ansah' }
    ]
  },
  'holy-spirit': {
    societies: [
      'Sacred Heart Confraternity',
      'Christian Mothers Association',
      'Catholic Men Association',
      'Catholic Youth Organization (CYO)',
      'St. Vincent de Paul Society',
      'Catholic Charismatic Renewal',
      'Legion of Mary'
    ],
    executiveCouncil: [
      { role: 'PPC Chairman', name: 'Dr. Kwabena Asante' },
      { role: 'Treasurer', name: 'Mrs. Grace Osei-Bonsu' },
      { role: 'Welfare Officer', name: 'Mr. Anthony Mensah' }
    ]
  }
};

let cachedGovernance: SubStationsGovernanceRecord | null = null;
const listeners = new Set<(data: SubStationsGovernanceRecord) => void>();

export function useSubStationsGovernance() {
  const [governance, setGovernance] = useState<SubStationsGovernanceRecord>(cachedGovernance || DEFAULT_GOVERNANCE_DATA);
  const [isLoading, setIsLoading] = useState(!cachedGovernance);

  const fetchGovernance = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();

      if (data.settings?.substations_governance) {
        const loaded = typeof data.settings.substations_governance === 'string'
          ? JSON.parse(data.settings.substations_governance)
          : data.settings.substations_governance;

        const merged: SubStationsGovernanceRecord = {
          'st-anthony': {
            societies: loaded['st-anthony']?.societies || DEFAULT_GOVERNANCE_DATA['st-anthony'].societies,
            executiveCouncil: loaded['st-anthony']?.executiveCouncil || DEFAULT_GOVERNANCE_DATA['st-anthony'].executiveCouncil
          },
          'st-matthew': {
            societies: loaded['st-matthew']?.societies || DEFAULT_GOVERNANCE_DATA['st-matthew'].societies,
            executiveCouncil: loaded['st-matthew']?.executiveCouncil || DEFAULT_GOVERNANCE_DATA['st-matthew'].executiveCouncil
          },
          'holy-spirit': {
            societies: loaded['holy-spirit']?.societies || DEFAULT_GOVERNANCE_DATA['holy-spirit'].societies,
            executiveCouncil: loaded['holy-spirit']?.executiveCouncil || DEFAULT_GOVERNANCE_DATA['holy-spirit'].executiveCouncil
          }
        };

        cachedGovernance = merged;
        setGovernance(merged);
        listeners.forEach(l => l(merged));
      } else {
        cachedGovernance = DEFAULT_GOVERNANCE_DATA;
        setGovernance(DEFAULT_GOVERNANCE_DATA);
      }
    } catch (err) {
      console.warn('Using default governance data:', err);
      if (!cachedGovernance) {
        setGovernance(DEFAULT_GOVERNANCE_DATA);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener = (newData: SubStationsGovernanceRecord) => {
      setGovernance(newData);
    };
    listeners.add(listener);

    if (!cachedGovernance) {
      fetchGovernance();
    } else {
      setIsLoading(false);
    }

    return () => {
      listeners.delete(listener);
    };
  }, [fetchGovernance]);

  const updateCachedGovernance = useCallback((newData: SubStationsGovernanceRecord) => {
    cachedGovernance = newData;
    setGovernance(newData);
    listeners.forEach(l => l(newData));
  }, []);

  return {
    governance,
    isLoading,
    refetch: fetchGovernance,
    updateCachedGovernance
  };
}
