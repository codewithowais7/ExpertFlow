module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // User joins expert-specific room when viewing their detail page
    socket.on('join_expert', (expertId) => {
      socket.join(expertId);
      console.log(`👤 ${socket.id} joined room: ${expertId}`);
    });

    // User leaves room when navigating away
    socket.on('leave_expert', (expertId) => {
      socket.leave(expertId);
      console.log(`👤 ${socket.id} left room: ${expertId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
