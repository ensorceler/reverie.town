"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send, Settings, Users, Wifi, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EventBus } from "@/game/EventBus"
import { useWebSocket } from "@/hooks/useWebSocket"
import dayjs from "dayjs"
// Mock chat messages
/*
const mockMessages = [
    {
        id: 1,
        sender: "Alice",
        message: "Hey everyone! How's the project going?",
        timestamp: "10:30 AM",
        avatar: "/api/placeholder/32/32",
        isOwn: false
    },
    {
        id: 2,
        sender: "You",
        message: "Going well! Just finished the backend implementation.",
        timestamp: "10:32 AM",
        avatar: "/api/placeholder/32/32",
        isOwn: true
    },
]
    */

interface ChatMessage {
    id: number;
    sender: string;
    message: string;
    timestamp: string;
    avatar: string;
    isOwn: boolean;
}

const mockMessages: ChatMessage[] = [];

// Form validation schema
const joinRoomSchema = z.object({
    roomName: z.string().min(1, "Room name is required").max(50, "Room name too long"),
    clientName: z.string().min(1, "Client name is required").max(30, "Client name too long"),
})

type JoinRoomForm = z.infer<typeof joinRoomSchema>

export function Chatboard() {
    const [currentMessage, setCurrentMessage] = useState("")
    const [messages, setMessages] = useState(mockMessages)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const {
        isConnected,
        isConnecting,
        connectionError,
        currentRoom,
        messages: wsMessages,
        connectToRoom,
        sendMessage,
        disconnect
    } = useWebSocket()

    const form = useForm<JoinRoomForm>({
        resolver: zodResolver(joinRoomSchema),
        defaultValues: {
            roomName: "",
            clientName: "",
        },
    })

    const { register, handleSubmit, formState: { errors }, reset } = form

    const onSubmit = (data: JoinRoomForm) => {
        connectToRoom(data)
        setIsDialogOpen(false)
        reset()
    }

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            if (isConnected) {
                sendMessage(currentMessage)
            } else {
                const newMessage = {
                    id: messages.length + 1,
                    sender: "You",
                    message: currentMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: "/api/placeholder/32/32",
                    isOwn: true
                }
                setMessages([...messages, newMessage])
                EventBus.emit("messageSent", newMessage)
            }
            setCurrentMessage("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    useEffect(() => {
        if (wsMessages.length > 0) {
            setMessages((prevMsg: any) => [...prevMsg, ...wsMessages])
        }
    }, [wsMessages])

    useEffect(() => {
        EventBus.on("playerReachedFinish", (msg: any) => {
            console.log("Event received:", msg);
        });

        return () => {
            EventBus.removeListener('playerReachedFinish');
        }
    }, [])


    return (
        <TooltipProvider >
            <div className="flex flex-col h-full bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
                    <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <h2 className="font-semibold text-lg text-white">{currentRoom || "General Discussion"}</h2>
                        {isConnected && <Wifi className="h-4 w-4 text-green-500" />}
                        {!isConnected && !isConnecting && <WifiOff className="h-4 w-4 text-red-500" />}
                        {isConnecting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isConnected && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={disconnect}
                                >
                                    <WifiOff className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Disconnect</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Join Room</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Join Room</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="roomName">Room Name</Label>
                                    <Input
                                        id="roomName"
                                        placeholder="Enter room name..."
                                        disabled={isConnecting}
                                        {...register("roomName")}
                                    />
                                    {errors.roomName && (
                                        <p className="text-sm text-destructive">{errors.roomName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clientName">Client Name</Label>
                                    <Input
                                        id="clientName"
                                        placeholder="Enter your name..."
                                        disabled={isConnecting}
                                        {...register("clientName")}
                                    />
                                    {errors.clientName && (
                                        <p className="text-sm text-destructive">{errors.clientName.message}</p>
                                    )}
                                </div>

                                {connectionError && (
                                    <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
                                        {connectionError}
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isConnecting}>
                                        {isConnecting ? "Connecting..." : "Join Room"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start space-x-2 ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''
                                    }`}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={msg.avatar} alt={msg.sender} />
                                    <AvatarFallback>
                                        {msg.sender.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-sm font-medium text-white">
                                            {msg.sender}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {dayjs(msg.timestamp).format("LLL")}
                                        </span>
                                    </div>

                                    <div
                                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${msg.isOwn
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-200'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700 bg-gray-800">
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Type your message..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    disabled={!currentMessage.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Send message</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}