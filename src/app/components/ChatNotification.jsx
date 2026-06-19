import { X } from 'lucide-react';
import { Link } from 'react-router';

export default function ChatNotification({ messageInfo, setMessageInfo }) {
  if (!messageInfo.senderUserName) return
  return (
    <div className="fixed bottom-0 right-0 mb-5 mr-5 p-5 z-999 w-100 rounded-lg bg-[#12161d]">
      <div className="flex row items-center mb-3">
        {messageInfo.profileImg != null ? (
          <img
            className="w-10 h-10 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center"
            src={`data:image/png;base64,${messageInfo.profileImg}`}
            alt={messageInfo.senderUserName}
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center shadow-lg shadow-[#BFBCFC]/30">
            <span className="text-[#0B0E14] font-bold text-xl">{messageInfo.senderUserName[0]}</span>
          </div>
        )}
        <h1 className="ms-4">{messageInfo.senderUserName}</h1>
        <button className="absolute text-red-500 top-0 right-0 p-3 cursor-pointer" onClick={() => setMessageInfo(null)}><X /></button>
      </div>
      <p>{messageInfo.message.length > 30 ? messageInfo.message.substring(0, 30) + "..." : messageInfo.message}</p>
      <p>{messageInfo.timeSended}</p>
    </div>
  )
}