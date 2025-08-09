import { useEffect, useCallback, useRef } from 'react'
import { useChatStore, ChatMessage, RoomCredentials } from '../stores/chatStore'
import { PhaserEventBus } from '@/game/events/PhaserEventBus';
import { UseWebSocketOptions, WebSocketMessage } from '@/@types/websocket';

// WebSocket message types

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
        localStorage.setItem('roomName', credentials.roomName);
        localStorage.setItem('client', credentials.clientName);
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
      //console.log('handleIncomingMessage:', wsMessage)
      switch (wsMessage.type) {
        case 'message':
          if (wsMessage.message && wsMessage.sender) {
            const newMessage: ChatMessage = {
              id: wsMessage.id!,
              sender: wsMessage.sender,
              message: wsMessage.message,
              timestamp: wsMessage.timestamp || "",
              isOwn: wsMessage.sender === roomCredentials?.clientName
            }
            addMessage(newMessage)
          }
          break

        case 'userJoined':

          PhaserEventBus.emit("userJoined", {
            ...wsMessage
          })

          break

        case "playerState":

          PhaserEventBus.emit("playerState", {
            ...wsMessage
          })

          break;

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

  // In useWebSocket.ts, add this in the connectToRoom function or hook setup
  useEffect(() => {
    const handleSendPlayerState = (playerData: any) => {
      if (ws && isConnected) {
        const wsMessage = {
          type: 'sendPlayerState',
          playerState: {
            ...playerData
          }
        };
        ws.send(JSON.stringify(wsMessage));
      }
    };

    PhaserEventBus.on('sendPlayerState', handleSendPlayerState);

    return () => {
      PhaserEventBus.removeListener('sendPlayerState', handleSendPlayerState);
    };
  }, [ws, isConnected])

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