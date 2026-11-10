import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();
const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamAlert, setStreamAlert] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.io
  useEffect(() => {
    const s = io(BACKEND_URL, {
      reconnectionAttempts: 5,
      timeout: 3000,
    });

    s.on('connect', () => {
      setIsServerConnected(true);
    });

    s.on('disconnect', () => {
      setIsServerConnected(false);
      setIsStreaming(false);
    });

    s.on('new-transaction', (tx) => {
      setTransactions((prev) => [tx, ...prev]);
      if (tx.status === 'FLAGGED') {
        setStreamAlert(tx);
        // Auto-clear toast after 4 seconds
        setTimeout(() => setStreamAlert(null), 4000);
      }
    });

    setSocket(s);

    return () => s.disconnect();
  }, []);

  // Fetch initial transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getTransactions();
      if (res && res.data) {
        setTransactions(res.data);
        setIsServerConnected(true);
      }
    } catch {
      setIsServerConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Start / Stop Stream
  const toggleStream = () => {
    if (!socket) return;
    if (isStreaming) {
      socket.emit('stop-stream');
      setIsStreaming(false);
    } else {
      socket.emit('start-stream');
      setIsStreaming(true);
    }
  };

  // Add evaluated transaction
  const addTransaction = async (formData) => {
    try {
      if (isServerConnected) {
        const res = await api.evaluateTransaction(formData);
        if (res && res.data) {
          setTransactions((prev) => [res.data, ...prev]);
          return res.data;
        }
      }
    } catch (err) {
      console.warn('[Context] Failed to send to backend, using local:', err.message);
    }
    setTransactions((prev) => [formData, ...prev]);
    return formData;
  };

  // Review transaction (records actual logged-in analyst)
  const reviewTransaction = async (id, newStatus, reviewerNotes) => {
    const reviewerName = user ? user.name : 'Niteesh Balajee';
    setTransactions((prev) =>
      prev.map((t) => {
        const match = t._id === id || t.transactionId === id || t.id === id;
        return match
          ? {
              ...t,
              status: newStatus,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reviewerNotes: reviewerNotes || (newStatus === 'SAFE' ? 'Approved by analyst' : 'Confirmed fraud'),
            }
          : t;
      })
    );

    if (isServerConnected) {
      try {
        await api.reviewTransaction(id, newStatus, reviewerNotes, reviewerName);
      } catch (err) {
        console.warn('[Context] Backend review sync failed:', err.message);
      }
    }
  };

  const flaggedCount = transactions.filter((t) => t.status === 'FLAGGED').length;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        reviewTransaction,
        flaggedCount,
        isLoading,
        isServerConnected,
        isStreaming,
        toggleStream,
        streamAlert,
        refresh: fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    return {
      transactions: [],
      addTransaction: async (data) => data,
      reviewTransaction: async () => {},
      flaggedCount: 0,
      isLoading: false,
      isServerConnected: false,
      isStreaming: false,
      toggleStream: () => {},
      streamAlert: null,
      refresh: async () => {},
    };
  }
  return context;
}

