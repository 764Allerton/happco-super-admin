import { Avatar, Col, Row } from 'antd'
import BreadCrumbComponent from 'Components/BreadCrumbComponent'
import ChatWindow from 'Components/ChatWindow'
// import JournalWindow from 'Components/JournalWindow'
import React, { useState, useEffect } from 'react'
import { database } from '../../../firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { useGetMessageUserDataQuery } from 'Rtk/services/messages'
import { fileUrl } from 'Constants/Url'

// const journalList = [
//   {
//     _id: '1',
//     message:
//       'Lorem ipsum dolor sit amet elit dolor sit. Donec leo eros, aliquam eget tinciduntvDonec leo eros, aliquam eget tincidunt vel, imperdiet sit amet ex. vel, imperdiet sit amet ex.Donec leo eros, aliquam eget tincidunt vel, imperdiet sit amet ex.',
//     time: 'Aug12, 2024 12:45 AM'
//   },
//   {
//     _id: '2',
//     message:
//       'Lorem ipsum dolor sit amet elit dolor sit. Donec leo eros, aliquam eget tinciduntvDonec leo eros, aliquam eget tincidunt vel, imperdiet sit amet ex. vel, imperdiet sit amet ex.Donec leo eros, aliquam eget tincidunt vel, imperdiet sit amet ex.',
//     time: 'Aug12, 2024 12:45 AM'
//   },
//   {
//     _id: '3',
//     message:
//       'Lorem ipsum dolor sit amet elit dolor sit. Donec leo eros, aliquam eget tinciduntvDonec leo eros, aliquam eget tincidunt vel, imperdiet sit amet ex. vel, imperdiet sit amet ex.Donec leo eros, aliquam eget tincidunt vel, imperdiet sit amet ex.',
//     time: 'Aug12, 2024 12:45 AM'
//   }
// ]

const chatTabs = [
  { key: 'recent', label: 'Recent' },
  { key: 'clt', label: 'CLT' }
]

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [selectedKey, setSelectedKey] = useState('chats')
  const [selectedKeyChats, setSelectedKeyChats] = useState('recent')
  const [selectedChatUser, setSelectedChatUser] = useState('')
  const [selectedUserChatDetails, setSelectedUserChatDetails] = useState('')
  const [userList, setUserList] = useState([])
  const [selectedUserType, setSelectedUserType] = useState('4')
  const [recentMessagesList, setRecentMessagesList] = useState([])
  const [docId, setDocId] = useState('')
  const [searchText, setSearchText] = useState('')
  const userData = useSelector(state => state.auth.authData)

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    position: ['bottomRight']
  })

  const result = useGetMessageUserDataQuery(
    {
      page: pagination?.page,
      limit: pagination?.pageSize,
      type: selectedUserType,
      searchData: ''
    },
    {
      refetchOnMountOrArgChange: true
    }
  )

  useEffect(() => {
    if (selectedUserType !== '4') {
      if (result?.error?.status == 400) {
        setUserList([])
        setPagination(prevPagination => ({
          ...prevPagination,
          total: 0
        }))
      } else if (result?.data?.data?.data) {
        setUserList(result?.data?.data?.data)
        setPagination(prevPagination => ({
          ...prevPagination,
          total: result?.data?.data?.totalCount
        }))
      } else getRecentMessagesList()
    }
  }, [result?.data, result])

  const handleSelect = key => {
    setSelectedKey(key)
  }

  useEffect(() => {
    if (selectedUserType == '4') getRecentMessagesList()
  }, [selectedUserType])

  //  Select the User Type ++++++++++++++++++++++++++
  const handleSelectChats = key => {
    setSelectedChatUser('')
    setMessages([])
    setDocId(null)
    setSelectedUserChatDetails(null)
    setSelectedKeyChats(key)
    setUserList([])

    if (key == 'clt') {
      setRecentMessagesList([])
      setSelectedUserType('3')
    } else if (key == 'members') {
      setRecentMessagesList([])
      setSelectedUserType('2')
    } else if (key == 'coach') {
      setRecentMessagesList([])
      setSelectedUserType('1')
    } else if (key == 'recent') {
      setUserList([])
      setSelectedUserType('4')
      getRecentMessagesList()
    }
  }

  useEffect(() => {
    if (selectedUserChatDetails) {
      getMessagesList(selectedUserChatDetails)
    }
  }, [selectedUserChatDetails])

  // Message call for Getting the List Of Recent chat user.
  const getRecentMessagesList = async () => {
    const col = collection(database, 'chats')
    const q = query(col)
    const unsubscribe = onSnapshot(q, querySnapshot => {
      let data = []
      querySnapshot.forEach(doc => {
        const docData = doc.data()
        if (docData?.users?.includes(userData?._id)) {
          data.push({
            ...doc?.data(),
            _id: doc.id
          })
        }
      })
      const list = data?.map(item =>
        item?.lastmsg?.from?.id == userData?._id
          ? item?.lastmsg?.to
          : item?.lastmsg?.from
      )
      const cleanedData = list.filter(item => item !== undefined)
      // setUserList(cleanedData)
      setRecentMessagesList(cleanedData)
    })
    return () => unsubscribe()
  }
  //  data call to get the messages of the Particular User  +++++++++++++++++++++++++++++++++++++++
  async function getMessagesList(details) {
    const col = collection(database, 'chats')
    const q = query(col, orderBy('lastmsg.timeStamp', 'asc'))
    // Set up a listener for real-time updates from Firestore
    const unsubscribe = onSnapshot(q, querySnapshot => {
      querySnapshot.forEach(doc => {
        const docData = doc.data()
        if (
          docData?.users?.includes(userData?._id) &&
          docData?.users?.includes(details?._id)
        ) {
          const messageCollectionRef = collection(
            database,
            'chats',
            doc.id,
            'messages'
          )
          const unsubscribeIn = onSnapshot(
            query(messageCollectionRef, orderBy('timeStamp', 'asc')),
            querySnapshots => {
              let _data = []
              querySnapshots.forEach(docm => {
                setDocId(doc.id)
                _data.push({
                  ...docm?.data(),
                  _id: doc.id
                })
              })
              setMessages(_data)
            }
          )
          return () => {
            unsubscribeIn()
          }
        } else {
          setMessages([])
        }
      })

      // _data = [];
    })

    // Return the unsubscribe function to stop listening when the component is unmounted
    return () => unsubscribe()
  }

  // function call on the Click of side bar user List   ++++++++++++++++++++++++++++++++++++++++
  const handleSelectedUserChat = value => {
    setDocId(null)
    setSelectedChatUser(
      `${value?.first_name ?? '--'} ${value?.last_name}`
    )
    setSelectedUserChatDetails(value)
  }

  return (
    <div>
      <div className='flexBetween mb-4 smMin:flex-col'>
        <BreadCrumbComponent
          mainTitle='Home'
          title='Messages'
          className='smMin:mb-2'
        />
      </div>
      <Row gutter={[35, 10]}>
        <Col
          onClick={() => handleSelect('chats')}
          className={`cursor-pointer font-bold text-xl ${selectedKey === 'chats' ? 'userTypeSelectedClass' : ''}`}>
          Chats
          <div
            className={`border-2 border-b-defaultDarkColor w-[60%] mx-auto ${selectedKey === 'chats' ? 'block' : 'hidden'}`}>
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} md={24} lg={24} xl={24}>
          <div className='shadow-xl  p-5 mt-5 smMin:p-1'>
            <div className='text-lg'>Chats</div>
            <Row gutter={[35, 10]} className='my-3'>
              {chatTabs?.map(({ key, label }) => (
                <Col
                  key={key}
                  onClick={() =>
                    selectedKeyChats !== key && handleSelectChats(key)
                  }
                  className={`cursor-pointer font-bold text-lg ${selectedKeyChats === key ? 'userTypeSelectedClass' : ''}`}>
                  {label}
                  <div
                    className={`border-2 border-b-defaultDarkColor w-[60%] mx-auto ${selectedKeyChats === key ? 'block' : 'hidden'}`}>
                  </div>
                </Col>
              ))}
            </Row>
            {/*   ++++++++++++++++++  User Name  + Chat section  +++++++++++++++++++++++++++++++++++ */}
            <Row gutter={[10]} className='justify-around'>
              {/* -----------------------  Side Bar Section User List ------------------------------------------ */}
              <Col xs={24} md={7} lg={8} xl={8} className='rounded-lg smMin:mb-2'>
                <div className='bg-defaultLightColorChat h-full p-2 rounded-xl max-h-[595px] overflow-y-auto'>
                  <input onChange={(e) => setSearchText(e.target.value)} placeholder='Search' type='text' style={{ padding: '7px', marginBottom: 20 }} className='w-[100%]' />
                  {(
                    ((recentMessagesList?.length > 0 && userList?.length < 1) ? recentMessagesList : userList) || []
                  )
                    .filter(item => {
                      const fullName = `${item?.first_name ?? ''} ${item?.last_name ?? ''}`.toLowerCase();
                      return fullName.includes(searchText.toLowerCase());
                    }).map(item => (
                      <div
                        key={item?._id}
                        className={`${selectedChatUser ==
                          `${item?.first_name ?? '--'} ${item?.last_name
                          }`
                          ? 'bg-defaultLightSlideColor '
                          : ''
                          } p-2 py-3 font-bold`}
                        onClick={() => handleSelectedUserChat(item)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedChatUser(
                              `${item?.first_name ?? '--'
                              } ${item?.last_name}`
                            )
                          }
                        }}
                        role='button'
                        tabIndex={0}>
                        <div className='flex items-center'>
                          {!item?.profile_pic ? (
                            <Avatar className='min-w-[32px] mr-2'>
                              {item?.first_name?.charAt(0)}
                            </Avatar>
                          ) : (
                            <Avatar
                              className='min-w-[32px] mr-2'
                              src={`${fileUrl}${item?.profile_pic}`}
                            />
                          )}
                          {/* ------------------------- Display the username ------------------------------ */}
                          <div>
                            <div>{`${item?.first_name ?? '--'} ${item?.last_name}`}</div>
                            <div className='text-sm text-gray-500'>
                              {item.companyName} - {item.divisionName}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Col>
              {/* Chat Box Section */}
              <Col xs={24} md={16} lg={16} xl={16}>
                <ChatWindow
                  chatMessagesData={messages}
                  docId={docId}
                  userDetails={selectedUserChatDetails}
                />
              </Col>
            </Row>
          </div>
        </Col>
        {/*  +++++++++++ JOURNAL SECTION ++++++++++++++ */}
        {/* <Col xs={24} md={24} lg={7} xl={7}>
          <div className='shadow-xl p-3'>
            <JournalWindow journalList={journalList} />
          </div>
        </Col> */}
      </Row>
    </div>
  )
}
export default Messages