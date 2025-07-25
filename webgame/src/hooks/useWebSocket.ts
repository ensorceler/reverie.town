import { useEffect, useCallback, useRef } from 'react'
import { useChatStore, ChatMessage, RoomCredentials } from '../stores/chatStore'

// WebSocket message types
interface WebSocketMessage {
  id?: string;
  type: 'join' | 'message' | 'user_joined' | 'user_left' | 'error'
  data?: any
  message?: string
  sender?: string
  timestamp?: string
  room?: string
}

interface UseWebSocketOptions {
  wsUrl?: string
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    wsUrl = 'ws://localhost:8080/wschat', // Default WebSocket endpoint
    reconnectDelay = 3000,
    maxReconnectAttempts = 5
  } = options

  const {
    ws,
    isConnected,
    isConnecting,
    connectionError,
    currentRoom,
    roomCredentials,
    messages,
    setWebSocket,
    setConnectionState,
    setRoom,
    addMessage,
    clearMessages,
    disconnect
  } = useChatStore()

  const reconnectAttempts = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Connect to WebSocket with room credentials
  const connectToRoom = useCallback(async (credentials: RoomCredentials) => {
    if (isConnecting || isConnected) {
      return
    }

    setConnectionState(false, true)
    clearMessages()

    try {
      const websocket = new WebSocket(wsUrl + "?roomID=" + credentials.roomName + "&client=" + credentials.clientName)

      websocket.onopen = () => {
        console.log('WebSocket connected')
        setWebSocket(websocket)
        setConnectionState(true, false)
        setRoom(credentials.roomName, credentials)
        reconnectAttempts.current = 0

        // Send join room message
        const joinMessage: WebSocketMessage = {
          type: 'join',
          data: {
            room: credentials.roomName,
            clientName: credentials.clientName
          }
        }
        websocket.send(JSON.stringify(joinMessage))
      }

      websocket.onmessage = (event) => {
        handleIncomingMessage(event.data)
      }

      websocket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        setWebSocket(null)
        setConnectionState(false, false)

        // Attempt reconnection if not intentionally closed
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect(credentials)
        }
      }

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionState(false, false, 'Connection failed')
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setConnectionState(false, false, 'Failed to connect')
    }
  }, [wsUrl, isConnecting, isConnected, maxReconnectAttempts])

  // Handle incoming messages from WebSocket
  const handleIncomingMessage = useCallback((data: string) => {
    try {
      const wsMessage: WebSocketMessage = JSON.parse(data)
      console.log('handleIncomingMessage:', wsMessage)
      switch (wsMessage.type) {
        case 'message':
          if (wsMessage.message && wsMessage.sender) {
            const newMessage: ChatMessage = {
              id: wsMessage.id!,
              sender: wsMessage.sender,
              message: wsMessage.message,
              timestamp: new Date(wsMessage.timestamp!).toString() || new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              }),
              isOwn: wsMessage.sender === roomCredentials?.clientName
            }
            addMessage(newMessage)
          }
          break

        case 'user_joined':
          if (wsMessage.sender) {
            const joinMessage: ChatMessage = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              sender: 'System',
              message: `${wsMessage.sender} joined the room`,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              }),
              isOwn: false
            }
            addMessage(joinMessage)
          }
          break

        case 'user_left':
          if (wsMessage.sender) {
            const leaveMessage: ChatMessage = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              sender: 'System',
              message: `${wsMessage.sender} left the room`,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              }),
              isOwn: false
            }
            addMessage(leaveMessage)
          }
          break

        case 'error':
          console.error('WebSocket server error:', wsMessage.message)
          setConnectionState(false, false, wsMessage.message || 'Server error')
          break

        default:
          console.log('Unknown message type:', wsMessage.type)
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }, [roomCredentials?.clientName, addMessage, setConnectionState])

  // Send message function
  const sendMessage = useCallback((messageText: string) => {
    if (!ws || !isConnected || !roomCredentials) {
      console.error('Cannot send message: WebSocket not connected or no room credentials')
      return false
    }

    if (!messageText.trim()) {
      return false
    }

    try {
      const wsMessage: WebSocketMessage = {
        type: 'message',
        message: messageText.trim(),
      }

      ws.send(JSON.stringify(wsMessage))

      // Add message to local state immediately for better UX
      /*
      const newMessage: ChatMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        sender: roomCredentials.clientName,
        message: messageText.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isOwn: true
      }
        */
      //addMessage(newMessage)

      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }, [ws, isConnected, roomCredentials, currentRoom, addMessage])

  // Schedule reconnection
  const scheduleReconnect = useCallback((credentials: RoomCredentials) => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    reconnectAttempts.current++
    console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)

    reconnectTimeoutRef.current = setTimeout(() => {
      connectToRoom(credentials)
    }, reconnectDelay)
  }, [connectToRoom, reconnectDelay, maxReconnectAttempts])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      disconnect()
    }
  }, [disconnect])

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,
    currentRoom,
    messages,

    // Actions
    connectToRoom,
    sendMessage,
    disconnect,

    // WebSocket instance (for advanced usage)
    ws
  }
}