import { useEffect } from 'react';
import socket from '../socket/socket';

const useSocket = (expertId) => {
  useEffect(() => {
    if (!expertId) return;
    socket.emit('join_expert', expertId);
    return () => socket.emit('leave_expert', expertId);
  }, [expertId]);

  return socket;
};

export default useSocket;
