import { NewsletterSubscriber } from '../types/topup';

export const NEWSLETTER_STORAGE_KEY = 'topup_newsletter_subscribers_v1';
export const WELCOME_PROMO_CODE = 'PROMOVIP10';

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'budi.santoso99@gmail.com',
    subscribedAt: '2026-10-08 14:20:11',
    preferences: ['Flash Sale & Diskon', 'Mobile Legends & FF'],
    source: 'Footer Bar',
    welcomeVoucherClaimed: true,
  },
  {
    id: 'sub-2',
    email: 'rizky.gamerpro@yahoo.com',
    subscribedAt: '2026-10-08 19:45:00',
    preferences: ['Kode Redeem & Voucher', 'Game Baru & Event'],
    source: 'Footer Bar',
    welcomeVoucherClaimed: true,
  },
  {
    id: 'sub-3',
    email: 'dinda.safitri88@gmail.com',
    subscribedAt: '2026-10-09 09:12:33',
    preferences: ['Flash Sale & Diskon', 'Pulsa & E-Wallet'],
    source: 'Footer Bar',
    welcomeVoucherClaimed: true,
  },
  {
    id: 'sub-4',
    email: 'kevin.alvaro.gaming@outlook.com',
    subscribedAt: '2026-10-09 11:05:40',
    preferences: ['Mobile Legends & FF', 'Kode Redeem & Voucher'],
    source: 'Footer Bar',
    welcomeVoucherClaimed: false,
  },
  {
    id: 'sub-5',
    email: 'fajar.pratama@gmail.com',
    subscribedAt: '2026-10-09 12:30:15',
    preferences: ['Flash Sale & Diskon'],
    source: 'Footer Bar',
    welcomeVoucherClaimed: true,
  },
];

export const getStoredSubscribers = (): NewsletterSubscriber[] => {
  try {
    const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(INITIAL_SUBSCRIBERS));
      return INITIAL_SUBSCRIBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SUBSCRIBERS;
  } catch (err) {
    console.warn('Failed to load subscribers from storage, using initial data:', err);
    return INITIAL_SUBSCRIBERS;
  }
};

export const saveStoredSubscribers = (subscribers: NewsletterSubscriber[]): void => {
  try {
    localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(subscribers));
  } catch (err) {
    console.error('Failed to save subscribers to localStorage:', err);
  }
};

export const addSubscriber = (
  email: string,
  preferences: string[] = ['Flash Sale & Diskon', 'Kode Redeem & Voucher'],
  source: string = 'Footer Bar'
): { success: boolean; isDuplicate: boolean; subscriber: NewsletterSubscriber; totalCount: number } => {
  const cleanEmail = email.trim().toLowerCase();
  const currentList = getStoredSubscribers();

  const existing = currentList.find((item) => item.email.toLowerCase() === cleanEmail);

  if (existing) {
    // update preferences if new ones supplied
    const updated = currentList.map((item) =>
      item.email.toLowerCase() === cleanEmail
        ? {
            ...item,
            preferences: Array.from(new Set([...(item.preferences || []), ...preferences])),
          }
        : item
    );
    saveStoredSubscribers(updated);
    return {
      success: true,
      isDuplicate: true,
      subscriber: existing,
      totalCount: updated.length,
    };
  }

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newSub: NewsletterSubscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    email: cleanEmail,
    subscribedAt: dateStr,
    preferences,
    source,
    welcomeVoucherClaimed: false,
  };

  const updatedList = [newSub, ...currentList];
  saveStoredSubscribers(updatedList);

  return {
    success: true,
    isDuplicate: false,
    subscriber: newSub,
    totalCount: updatedList.length,
  };
};

export const removeSubscriber = (idOrEmail: string): boolean => {
  const currentList = getStoredSubscribers();
  const filtered = currentList.filter(
    (item) => item.id !== idOrEmail && item.email.toLowerCase() !== idOrEmail.toLowerCase()
  );
  if (filtered.length !== currentList.length) {
    saveStoredSubscribers(filtered);
    return true;
  }
  return false;
};

export const exportSubscribersToCsv = (subscribers: NewsletterSubscriber[]): string => {
  const headers = ['ID', 'Email', 'Tanggal Daftar', 'Preferensi', 'Sumber'];
  const rows = subscribers.map((s) => [
    `"${s.id}"`,
    `"${s.email}"`,
    `"${s.subscribedAt}"`,
    `"${(s.preferences || []).join('; ')}"`,
    `"${s.source || 'Website'}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
