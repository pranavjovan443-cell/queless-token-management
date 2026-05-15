'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { playChime, announceToken } from '@/utils/sound';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (branch) => {
  const [socket, setSocket] = useState(null);
  const [nowServing, setNowServing] = useState(null);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    if (branch) {
      s.emit('join_room', branch);
      
      // Initial fetch
      fetch(`${SOCKET_URL}/api/tokens/live/${branch}`)
        .then(res => res.json())
        .then(data => {
          setNowServing(data.nowServing);
          setWaitingList(data.waiting);
        });
    }

    s.on('now_serving', (token) => {
      setNowServing(token);
    });

    s.on('callToken', (token) => {
      setNowServing(token);
      playChime();
      announceToken(token.tokenNumber, token.counter);
    });

    s.on('userPing', (data) => {
      const storedSessionId = localStorage.getItem('queless_session_id');
      if (data.sessionId === storedSessionId) {
        playChime();
        alert(`🔔 NOTIFICATION: Token ${data.tokenNumber}, please check the display!`);
      }
    });

    s.on('token_added', (token) => {
      setWaitingList((prev) => [...prev, token]);
    });

    return () => {
      s.disconnect();
    };
  }, [branch]);

  return { socket, nowServing, waitingList };
};
