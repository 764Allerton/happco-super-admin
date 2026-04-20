import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { useGetDashboardGraphQuery, useGetDashboardQuery } from 'Rtk/services/profile'
import { useNavigate } from 'react-router-dom'
import BreadCrumbComponent from 'Components/BreadCrumbComponent'
import bag from 'Assets/Media/bag.png'
import LoaderComponent from 'Components/LoaderComponent'
import ActiveUserGraph from 'Components/ActiveUserGraph'

const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  
  const result = useGetDashboardQuery({
    refetchOnMountOrArgChange: true,
  });

  const resultGraph = useGetDashboardGraphQuery({
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (resultGraph.isSuccess) {
      const gData = resultGraph?.data?.data[0]
      setSeries(gData?.series)
      setCategories(gData?.category)
    }
  }, [resultGraph]);

  const Counts = result?.data?.data;
  let dataList = [
    { name: "TOTAL COMPANIES", count: Counts?.totalCountCompany, link: "/company" },
    { name: "TOTAL CLTs", count: Counts?.totalClt, link: "/clt" },
    { name: "TOTAL ACTIONS", count: Counts?.totalActioncount, link: "/hc" },
    { name: "TOTAL HAPPCOACHES", count: Counts?.totalHappcoach, link: "/happcoaches" }
  ]
  
  return (
    <div>
      <div className='flexBetween mb-4 smMin:flex-col'>
        <BreadCrumbComponent
          mainTitle="Home"
          title="Dashboard" // or any title relevant to your current page
          className="smMin:mb-2"
        />
      </div>
      <div>
        {result?.isLoading ? <LoaderComponent /> :
          <Row gutter={[10, 10]} className='flexCenter flex-column justify-evenly'>
            {dataList?.map((item, index) => {
              return (
                <Col sm={12} md={11} lg={11} key={`{${item?.name}}${index}`}>
                  <div
                    className='dashCompanyBox flex-wrap flexCenter smMin:p-2 mdMin:h-[120px] smMin:h-[110px] cursor-pointer'
                    onClick={() => navigate(item?.link)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        navigate(item?.link);
                      }
                    }}>
                    <img src={bag} alt='icon' className=' w-[50px] lg:w-[70px] mdMin:w-[72px] smMin:w-[50px] me-4' />
                    <div className=''>
                      <div className='font-bold text-center min-w-[170px] smMin:min-w-[140px] text-lg smMin:text-sm smMin:text-md'>{item?.name}</div>
                      <div className='text-center font-bold text-lg'>{item?.count}</div>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        }
        <div className='py-5'>
          <div className='flexBetween'>
            <div className='text-2xl font-extrabold my-3'>
              Companies
            </div>
          </div>
          <ActiveUserGraph categories={categories} series={series} />
        </div>
      </div>
    </div>
  )
}
export default Dashboard