import { useState, useEffect, useCallback } from 'react';

export interface MassScheduleItem {
  day: string;
  time: string;
  type: string;
}

export interface ChurchTimetable {
  id: 'holy-spirit' | 'st-anthony' | 'st-matthew';
  name: string;
  location: string;
  priestInCharge: string;
  patronSaint: string;
  massSchedules: MassScheduleItem[];
  devotions: string[];
  specialNotice?: string;
}

export type ParishTimetableData = Record<'holy-spirit' | 'st-anthony' | 'st-matthew', ChurchTimetable>;

export const DEFAULT_TIMETABLE_DATA: ParishTimetableData = {
  'holy-spirit': {
    id: 'holy-spirit',
    name: 'Holy Spirit Rectorate (Main church)',
    location: 'Main Parish Avenue, kansaworado, P.O. Box Ax 1801, Sekondi-Takoradi',
    priestInCharge: 'Rev. Fr. Albin Kissi Ernim (Rector)',
    patronSaint: 'The Holy Spirit (Solemnity of Pentecost)',
    massSchedules: [
      { day: 'Sunday (First Mass)', time: '7:00 AM – 9:00 AM', type: 'Solemn Eucharist (English)' },
      { day: 'Sunday (Second Mass)', time: '9:30 AM – 11:30 AM', type: 'Youth & Family Mass' },
      { day: 'Monday – Friday (Morning)', time: '6:00 AM – 6:45 AM', type: 'Daily Weekday Mass' },
      { day: 'Wednesday (Evening)', time: '6:30 PM – 7:30 PM', type: 'Novena & Mass' },
      { day: 'Thursday (Holy Hour)', time: '6:30 PM – 8:00 PM', type: 'Exposition & Benediction' },
      { day: 'Saturday (Confessions)', time: '4:30 PM – 6:00 PM', type: 'Sacrament of Reconciliation' }
    ],
    devotions: [
      'Holy Rosary: 30 minutes before every Sunday Mass',
      'First Friday Devotion to the Sacred Heart of Jesus: 6:00 PM',
      'Perpetual Eucharistic Adoration Chapel: Open 24/7'
    ],
    specialNotice: 'Confessions are also heard 30 minutes before every weekday morning Mass upon request.'
  },
  'st-anthony': {
    id: 'st-anthony',
    name: 'St. Anthony of Padua Catholic Church',
    location: 'St. Anthony of padua catholic Church, kansaworado',
    priestInCharge: 'Rev. Fr. Albin Kissi Ernim (Pastor-in-charge)',
    patronSaint: 'St. Anthony of Padua (Doctor of the Church)',
    massSchedules: [
      { day: 'Sunday Mass', time: '7:30 AM – 9:30 AM', type: 'Solemn Sunday Eucharist' },
      { day: 'Tuesday (St. Anthony Devotion)', time: '6:30 PM – 8:00 PM', type: 'Devotional Mass, Novena & Bread Blessing' },
      { day: 'Thursday (Morning Mass)', time: '6:00 AM – 6:45 AM', type: 'Weekday Mass' },
      { day: '1st Saturday (Confessions)', time: '5:00 PM – 6:00 PM', type: 'Confessions & Rosary' }
    ],
    devotions: [
      '13 Tuesdays Novena to St. Anthony of Padua',
      'Blessing and Distribution of St. Anthony Bread',
      'Legion of Mary Praesidium Meeting: Sundays after Mass'
    ],
    specialNotice: 'Special devotion and prayers for lost items and miracles after Tuesday Mass.'
  },
  'st-matthew': {
    id: 'st-matthew',
    name: 'St. Matthew Catholic Church',
    location: 'St. Mathew Catholic Church, Ntankoful',
    priestInCharge: 'Rev. Fr. Albin Kissi Ernim & Pastoral Assistants',
    patronSaint: 'St. Matthew the Apostle & Evangelist',
    massSchedules: [
      { day: 'Sunday Mass', time: '8:00 AM – 10:15 AM', type: 'Solemn Eucharist & Society Gatherings' },
      { day: 'Wednesday (Midweek Mass)', time: '6:30 PM – 7:30 PM', type: 'Scripture Reflection & Mass' },
      { day: 'Friday (Divine Mercy & Adoration)', time: '6:00 PM – 7:15 PM', type: 'Divine Mercy Chaplet & Eucharistic Blessing' },
      { day: 'Saturday (Confessions)', time: '4:00 PM – 5:00 PM', type: 'Sacrament of Reconciliation' }
    ],
    devotions: [
      'Divine Mercy Chaplet: Every Friday at 3:00 PM & 6:00 PM',
      'St. Matthew Bible Study Circle: 2nd & 4th Thursdays at 6:30 PM',
      'Infant of Prague Novena'
    ],
    specialNotice: 'Divine Mercy prayer cards and chaplet beads available at the church secretariat.'
  }
};

// Global in-memory cache to synchronize instances across components instantly
let cachedTimetable: ParishTimetableData | null = null;
const listeners = new Set<(data: ParishTimetableData) => void>();

export function useParishTimetable() {
  const [timetable, setTimetable] = useState<ParishTimetableData>(cachedTimetable || DEFAULT_TIMETABLE_DATA);
  const [isLoading, setIsLoading] = useState(!cachedTimetable);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();

      if (data.settings?.liturgical_timetable) {
        const loaded = typeof data.settings.liturgical_timetable === 'string'
          ? JSON.parse(data.settings.liturgical_timetable)
          : data.settings.liturgical_timetable;

        // Merge with defaults to ensure all required fields exist
        const merged: ParishTimetableData = {
          'holy-spirit': { ...DEFAULT_TIMETABLE_DATA['holy-spirit'], ...loaded['holy-spirit'] },
          'st-anthony': { ...DEFAULT_TIMETABLE_DATA['st-anthony'], ...loaded['st-anthony'] },
          'st-matthew': { ...DEFAULT_TIMETABLE_DATA['st-matthew'], ...loaded['st-matthew'] }
        };

        cachedTimetable = merged;
        setTimetable(merged);
        listeners.forEach(fn => fn(merged));
      } else {
        cachedTimetable = DEFAULT_TIMETABLE_DATA;
        setTimetable(DEFAULT_TIMETABLE_DATA);
      }
    } catch (err: any) {
      console.warn('Using default parish timetable data:', err);
      setError(err.message);
      if (!cachedTimetable) {
        setTimetable(DEFAULT_TIMETABLE_DATA);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener = (newData: ParishTimetableData) => {
      setTimetable(newData);
    };
    listeners.add(listener);

    if (!cachedTimetable) {
      fetchTimetable();
    } else {
      setIsLoading(false);
    }

    return () => {
      listeners.delete(listener);
    };
  }, [fetchTimetable]);

  const updateCachedTimetable = useCallback((newData: ParishTimetableData) => {
    cachedTimetable = newData;
    setTimetable(newData);
    listeners.forEach(fn => fn(newData));
  }, []);

  return {
    timetable,
    isLoading,
    error,
    refetch: fetchTimetable,
    updateCachedTimetable
  };
}
