import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (userId: string) => {
  if (socket?.connected) return socket

  socket = io('http://localhost:5000', {
    withCredentials: true,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)
    socket?.emit('join', userId)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  socket?.disconnect()
  socket = null
}