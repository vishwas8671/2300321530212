'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Notification, NotificationTypeFilter } from '../types/notification';
import { api, logFrontend } from '../services/api';

interface UseNotificationsProps {
  page: number;
  limit: number;
  typeFilter: NotificationTypeFilter;
}

const FALLBACK_NOTIFICATIONS: Notification[] = [
  { ID: 'fe_1', Type: 'Placement', Message: 'Google SDE-1 Hiring drive active', Timestamp: '2026-04-22 17:51:18' },
  { ID: 'fe_2', Type: 'Placement', Message: 'Microsoft Project Manager internship applications open', Timestamp: '2026-04-22 15:00:00' },
  { ID: 'fe_3', Type: 'Result', Message: 'Software Engineering Mid-Sem Marks published', Timestamp: '2026-04-22 12:00:00' },
  { ID: 'fe_4', Type: 'Result', Message: 'Database Systems Lab Exam grades sheet', Timestamp: '2026-04-22 10:00:00' },
  { ID: 'fe_5', Type: 'Event', Message: 'Annual Tech Fest registrations open now', Timestamp: '2026-04-20 10:00:00' },
  { ID: 'fe_6', Type: 'Event', Message: 'Cultural Program registration deadline extended', Timestamp: '2026-04-22 18:00:00' },
  { ID: 'fe_7', Type: 'Placement', Message: 'Amazon SDE off-campus drive announced', Timestamp: '2026-04-22 09:00:00' },
  { ID: 'fe_8', Type: 'Result', Message: 'End-Sem Theoretical Exam Marks board', Timestamp: '2026-04-23 09:00:00' },
  { ID: 'fe_9', Type: 'Event', Message: 'Inter-Departmental Sports Meet fixtures sheet', Timestamp: '2026-04-19 08:00:00' },
  { ID: 'fe_10', Type: 'Placement', Message: 'Netflix Graduate SWE Internship roles live', Timestamp: '2026-04-18 10:00:00' },
  { ID: 'fe_11', Type: 'Result', Message: 'Web Development Project Review Marks', Timestamp: '2026-04-21 14:00:00' },
];

export function useNotifications({ page, limit, typeFilter }: UseNotificationsProps) {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  // Load viewed notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('campus_notifications_viewed_ids');
      if (stored) {
        setViewedIds(new Set(JSON.parse(stored)));
      }
      logFrontend('debug', 'hook', 'Loaded viewed notification history from localStorage.');
    } catch (err: any) {
      console.error('Failed to parse viewed notification IDs from localStorage:', err);
    }
  }, []);

  // Fetch notifications from the API
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    await logFrontend('info', 'hook', 'Fetching campus notifications from API.');

    try {
      const response = await api.get<any>('/evaluation-service/notifications');
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.notifications || []);
      setAllNotifications(list);
      await logFrontend('info', 'hook', `Successfully fetched ${list.length} notifications.`);
    } catch (err: any) {
      console.warn('API Fetch failed, using fallback mock notifications dataset:', err.message);
      setAllNotifications(FALLBACK_NOTIFICATIONS);
      await logFrontend('warn', 'hook', `Notification API fetch failed: ${err.message}. Falling back to mock dataset.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Log filter changes
  useEffect(() => {
    logFrontend('info', 'hook', `Category filter changed to: "${typeFilter}"`);
  }, [typeFilter]);

  // Log page changes
  useEffect(() => {
    logFrontend('debug', 'hook', `Pagination page changed to: ${page}`);
  }, [page]);

  // Filter notifications based on type
  const filteredNotifications = useMemo(() => {
    if (typeFilter === 'All') {
      return allNotifications;
    }
    return allNotifications.filter(
      (n) => (n.Type || '').toLowerCase() === typeFilter.toLowerCase()
    );
  }, [allNotifications, typeFilter]);

  // Paginated notifications for the current page
  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredNotifications.slice(startIndex, endIndex);
  }, [filteredNotifications, page, limit]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredNotifications.length / limit));
  }, [filteredNotifications.length, limit]);

  // Mark a notification as viewed
  const markAsViewed = useCallback(async (id: string) => {
    setViewedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      
      try {
        localStorage.setItem('campus_notifications_viewed_ids', JSON.stringify(Array.from(next)));
      } catch (err) {
        console.error('Failed to write viewed IDs to localStorage:', err);
      }

      logFrontend('info', 'component', `Notification clicked and marked as viewed. ID: ${id}`);
      return next;
    });
  }, []);

  return {
    notifications: paginatedNotifications,
    allNotifications,
    loading,
    error,
    totalPages,
    totalCount: filteredNotifications.length,
    viewedIds,
    markAsViewed,
    refetch: fetchNotifications,
  };
}
