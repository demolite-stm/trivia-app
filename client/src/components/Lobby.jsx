import React, {useEffect, useState} from 'react'

export default function Lobby({socket, startGame, showCopied}) {
  const [users, setUsers] = useState([])
  const [roomid, setRoomId] = useState('')
  const [ingame, setIngame] = useState(false)
  const [thisuser, setThisuser] = useState()
  useEffect(() => {
    socket.emit('get-users')
    socket.emit('get-single-user')
    socket.on('roomUsers', ({roomid, users}) => {
      setUsers(users)
      setRoomId(roomid)
      socket.emit('get-single-user')
    })

    socket.on('ingame', (val) => {
      console.log(val)
      setIngame(val)
    })
    socket.on('get-this-user', (user) => {
      setThisuser(user)
      console.log(user)
    })
  // eslint-disable-next-line
  },[])
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomid)
    showCopied()
  }
  return (
    <>
      <div className="flex flex-row min-w-full min-h-full p-2 justify-items-center items-center sm:flex-col sm:text-center">
        <div className="pr-10 border-r border-gray-400 sm:border-r-0 sm:mb-4 sm:pr-0">
          <h2 className="font-semibold text-lg mb-2">Users (<span onClick={copyRoomId} className="text-blue-700 hover:underline cursor-pointer">{roomid}</span>)</h2>
          {users.map(v => {
            return <li className="list-none">{v.username} {v.owner && <>👑</>}</li>
          })}
        </div>
        
        {thisuser ? 
        ingame ? <button className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:cursor-default ml-12 sm:ml-0" disabled>In Game</button>: !thisuser.owner ? <button className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:cursor-default ml-12 sm:ml-0" disabled>Start Game</button>:
        <button className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-transform:ease-in-out duration-75 ml-12 sm:ml-0" onClick={startGame}>Start Game</button>
        : <p>loading...</p>}
        
      </div>
    </>
  )
}