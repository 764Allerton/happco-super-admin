import React, { useState, useRef, useEffect } from 'react'
import { Avatar, Image } from 'antd'
import { IoSend } from 'react-icons/io5'
import { colorCode } from 'Utils/MediaEndpoints'
import { useSelector } from 'react-redux'
import { fileUrl } from 'Constants/Url'
import { doc, collection, addDoc, setDoc } from 'firebase/firestore'
import { database } from './../firebase'
import { useUploadChatFileMutation } from 'Rtk/services/messages'
import { validateImage } from 'Utils/UtilityFunctions'
import moment from 'moment'
import Toast from 'Utils/Toast'

const ChatWindow = ({ chatMessagesData = [], docId, userDetails }) => {
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const attachmentRef = useRef(null)
  const messagesEndRef = useRef(null)
  const userData = useSelector(state => state.auth.authData)
  const [uploadChatFile] = useUploadChatFileMutation()
  let chatId

  function getSortedChatId(id1, id2) {
    if (!id1 || !id2) return null;
    const sorted = [id1, id2].sort((a, b) => a.localeCompare(b)); // Descending order
    return sorted.join("_");
  }

  if (!docId) {
    chatId = getSortedChatId(userDetails?._id, userData?._id)
  }

  useEffect(() => {
    if (docId) chatId = null
  }, [docId])

  useEffect(() => {
    setChatMessages([])
    setTimeout(() => {
      setChatMessages(chatMessagesData)
      return () => {
        setChatMessages([])
      }
    }, 10)
  }, [chatMessagesData])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  const handleSendMessage = async (type = null) => {
    if (newMessage.trim() === '') return
    let userObj = {
      _id: userData?._id ?? '',
      companyName: 'HTP',
      divisionName: '',
      email: userData?.email ?? '',
      first_name: userData?.first_name ?? '',
      id: userData?._id ?? '',
      last_name: userData?.last_name ?? '',
      name: userData?.full_name ?? '',
      profilePic: userData?.profile_pic ?? '',
      profile_pic: userData?.profile_pic ?? ''
    }

    let newChatMessage = {
      data: newMessage,
      docID: Date.now().toString(),
      from: userObj,
      memberType: 'Superadmin',
      reply: '',
      timeStamp: moment()?.unix(),
      type: 'text',
      parentDocId: docId ?? chatId,
      senderType: 'Superadmin'
    }
    firebaseSendMessage(newChatMessage)
  }

  const firebaseSendMessage = async newChatMessage => {
    const supportChatRef = doc(database, 'chats', docId ?? chatId)
    const messageCollectionRef = collection(supportChatRef, 'messages')
    try {
      await setDoc(supportChatRef, {
        users: [userData?._id, userDetails?._id],
        lastmsg: { ...newChatMessage, to: { _id: userDetails?.id, ...userDetails } }
      })
      const newMessageRef = await addDoc(messageCollectionRef, newChatMessage)
      setNewMessage('') // Clear the input box
      return newMessageRef.id
    } catch (error) {
      console.error('Failed to set data', error)
    }
  }

  const handleAttachmentClick = () => {
    attachmentRef.current.click() // Trigger the file input click
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!validateImage(file)) {
        Toast('e', 'Select Image File Only')
        return
      }
      if (file) handleUpload(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewMessage('') // Clear the text when a new file is selected
      }
      reader.readAsDataURL(file)
    }
  }

  // ******************************Upload FIle Function *****************************************************
  const handleUpload = async file => {
    let userObj = {
      _id: userData?._id ?? '',
      companyName: 'HTP',
      divisionName: '',
      email: userData?.email ?? '',
      first_name: userData?.first_name ?? '',
      id: userData?._id ?? '',
      last_name: userData?.last_name ?? '',
      name: userData?.full_name ?? '',
      profilePic: userData?.profile_pic ?? '',
      profile_pic: userData?.profile_pic ?? ''
    }
    if (file) {
      var data = new FormData()
      data.append('chat_image', file)
      const downloadURL = await uploadChatFile(data)
      const url = downloadURL?.data?.data?.[0]
      let newChatMessage = {
        data: url,
        docID: Date.now().toString(),
        from: userObj,
        memberType: 'HappCoach',
        reply: '',
        timeStamp: moment().unix(),
        type: 'Image',
        parentDocId: docId ?? chatId,
        senderType: 'Happcoach'
      }
      firebaseSendMessage(newChatMessage)
    } else {
      console.error('No file selected for upload.')
    }
  }

  const nameDefined = `${userDetails?.first_name} ${userDetails?.last_name}`

  return (
    <div>
      <div className='bg-defaultDarkColorChat text-center py-2'>
        {userDetails ? nameDefined : 'Chat Window'}
      </div>
      <div className='mt-3 overflow-y-auto h-[450px] mb-4'>
        {Array.isArray(chatMessages) &&
          chatMessages.map(item => {
            const formattedDate = moment
              .unix(item?.timeStamp)
              .format('YY-MM-DD hh:mm A')
            return item?.from?.id != userData?._id ? (
              <div className='my-1' key={item._id}>
                <div className='flex items-center px-1'>
                  {!item?.from?.profilePic ? (
                    <Avatar className='min-w-[32px]'>
                      {item?.from?.name?.charAt(0)}
                    </Avatar>
                  ) : (
                    <Avatar
                      className='min-w-[32px]'
                      src={`${fileUrl}${item?.from?.profilePic}`}
                    />
                  )}
                  <div className='flex mdMin:flex-col'>
                    <div className='ms-1 my-2 rounded bg-defaultLightColorChat w-[90%] xl:w-[100%] xl:max-w-[500px] smMin:max-w-[210px] p-2'>
                      {item?.type === 'text' && item?.data}
                      {item?.type == 'Image' && (
                        <Image
                          src={`${fileUrl}${item?.data}`}
                          alt='content'
                          className='max-w-full h-auto object-cover w-[60px]'
                        />
                      )}
                    </div>
                    <div className='self-end smMin:self-start text-xs pb-2 pl-2 mdMin:pr-[40px] min-w-[120px]'>
                      {formattedDate}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex justify-end px-1 mdMin:flex-col-reverse my-1' key={item._id}>
                <div className='flex items-end justify-end mdMin:flex-col-reverse'>
                  <div className='justify-end text-xs pb-2 pr-2 smMin:self-end mdMin:pr-[40px]'>
                    {formattedDate}
                  </div>
                  <div className='flex items-center'>
                    <div className='smMin: my-2 me-1 rounded bg-defaultDarkColorChat lg:max-w-96 w-full p-2'>
                      {item?.type === 'text' && item?.data}
                      {item?.type == 'Image' && (
                        <Image
                          src={`${fileUrl}${item?.data}`}
                          alt='content'
                          className='max-w-full h-[80px] object-cover w-[100px]'
                        />
                      )}
                    </div>
                    {!userData?.profile_pic ? (
                      <Avatar className='min-w-[32px]'>
                        {userData?.name?.charAt(0)}
                      </Avatar>
                    ) : (
                      <Avatar
                        className='min-w-[32px]'
                        src={`${fileUrl}${userData?.profile_pic}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        <div ref={messagesEndRef} />
      </div>
      {(userDetails?._id || userDetails?.id) && (
        <div className='flex'>
          <div
            className='bg-gray-100 rounded-full w-[30px] h-[30px] text-xl !text-defaultDarkColor text-center cursor-pointer'
            onClick={handleAttachmentClick}
            role='button'
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleAttachmentClick()
              }
            }}>
            +
          </div>
          <div className='w-full'>
            <div className="relative w-full">
            <textarea
                className="w-full p-2 pr-10 border rounded-md resize-none mx-1"
                rows={3}
                placeholder='Enter Message'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // prevent newline
                    handleSendMessage();
                  }
                }}
              />
              <span
                className="absolute right-3 bottom-3 cursor-pointer"
                onClick={handleSendMessage}
                onKeyDown={(e) => {
                  if (e.key == 'Enter' || e.key === ' ') {
                    handleSendMessage();
                  }
                }}
                role="button"
                tabIndex={0}>
                <IoSend color={colorCode?.defaultDarkColor} size={20} />
              </span>
            </div>
            <input
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              ref={attachmentRef}
              onChange={e => handleFileChange(e)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
export default ChatWindow