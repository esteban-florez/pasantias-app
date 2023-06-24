interface Props {
  status: 'isSent' | 'isRead' | 'isReceived'
  fromCurrentUser?: boolean
  message: string
}

interface MessageStatus {
  status: 'isSent' | 'isRead' | 'isReceived'
  statusDirection: boolean
  time: string
}

const MESSAGE_STATUSES = {
  isSent: 'Enviado',
  isRead: 'Leído',
  isReceived: 'Recibido',
}

function CheckMessage({ status, statusDirection, time }: MessageStatus) {
  const currentStatus = MESSAGE_STATUSES[status]
  const statusPosition = statusDirection ? 'text-end' : ''

  return (
    <div className={`flex flex-row ${statusPosition} mt-1 gap-1`}>
      <span className="text-xs font-semibold text-white/70">{currentStatus}</span>
      <span className="text-xs font-semibold text-white/70">{time}.</span>
    </div>
  )
}

export default function BubbleMessage({ status, fromCurrentUser = false, message }: Props) {
  return (
    <div className={`chat ${fromCurrentUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-bubble bg-white/50">
        <p className="flex-row text-sm  text-white/80">
          {message}
        </p>
        <CheckMessage status={status} statusDirection={fromCurrentUser} time="6:00 pm" />
      </div>
    </div>
  )
}