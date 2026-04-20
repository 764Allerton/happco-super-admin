/* eslint-disable */
import { Button, Col, Form, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetCltListQuery } from 'Rtk/services/clt'
import {
  useDivisionDetailsByIdQuery,
  useGetDeptListQuery,
  useUpdateCompanyDetailsMutation
} from 'Rtk/services/company'
import { useGetHappCoachListQuery } from 'Rtk/services/happcoach'
import Toast from 'Utils/Toast'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const ManageCompany = () => {
  const [formDetails] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const companyId = location.state.record?._id
  const divisionId = location.state.record?.divisions?._id
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const cltValues = location.state.record?.divisions?.clt_details?.map(item => {
    const name = item?.first_name + ' ' + item?.last_name
    return { label: name, value: item?._id }
  })

  const resultDivisionDetails = useDivisionDetailsByIdQuery(
    { companyId: companyId, divisionId: divisionId },
    {
      refetchOnMountOrArgChange: true,
      skip: !divisionId
    }
  )

  const happCoachValues = resultDivisionDetails?.data?.data?.happcoachId?.map(
    item => {
      const name =
        item?.happcoachId?.first_name + ' ' + item?.happcoachId?.last_name
      return {
        label: name,
        value: item?.happcoachId?._id
      }
    }
  )

  const happCoachDeptValues =
    resultDivisionDetails?.data?.data?.happcoachId?.map(item => {
      const dept = item?.departmentIds?.map(deptItem => ({
        label: deptItem?.name,
        value: deptItem?._id
      }))
      return dept
    })

  let uniqueRows
  useEffect(() => {
    const uniqueRows = rows?.filter(
      (row, index, self) =>
        // Allow rows where selectedHappcoach or selectedDepartment are null
        !row.selectedHappcoach ||
        !row.selectedDepartment ||
        index ===
        self?.findIndex(
          r =>
            r.selectedHappcoach?.label === row?.selectedHappcoach?.label &&
            r.selectedDepartment?.[0]?.label ===
            row.selectedDepartment?.[0]?.label
        )
    )
    setFilteredRows(uniqueRows)
  }, [rows])

  // useEffect(() => {
  //     if (happCoachValues?.length > 0) {
  //         // Create a set of existing happCoach IDs in rows to avoid duplicates
  //         const existingHappCoachIds = new Set(rows.map(row => row.selectedHappcoach?.happcoachId?._id));

  //         const addedrow = happCoachValues?.map((item, index) => {
  //             const id = rows.length + index;
  //             const happKey = `happcoach_${id}`;
  //             const deptKey = `department_${id}`;

  //             // Check if happCoachId exists and then if the happCoach with the same ID is already added
  //             if (item.happcoachId && !existingHappCoachIds.has(item.happcoachId._id)) {
  //                 // Set form field values only for new happCoach items
  //                 formDetails.setFieldsValue({
  //                     [happKey]: item,
  //                     [deptKey]: happCoachDeptValues[index]
  //                 });

  //                 return {
  //                     id: rows.length + index,
  //                     selectedHappcoach: item,
  //                     selectedDepartment: happCoachDeptValues[index]
  //                 };
  //             } else {
  //                 // Return null for items without a happcoachId or for duplicates
  //                 return null;
  //             }
  //         }).filter(row => row !== null); // Filter out null values

  //         if (addedrow.length > 0) {
  //             setRows([...rows, ...addedrow]); // Only update rows if there are new items
  //         }
  //     }
  // }, [happCoachValues, rows, happCoachDeptValues, formDetails]);

  useEffect(() => {
    if (happCoachValues?.length > 0) {
      const addedrow = happCoachValues?.map((item, index) => {
        const id = rows.length + index
        const happKey = `happcoach_${id}`
        const deptKey = `department_${id}`

        // Use computed property names for dynamic keys
        formDetails.setFieldsValue({
          [happKey]: item,
          [deptKey]: happCoachDeptValues[index]
        })

        return {
          id: rows.length + index,
          selectedHappcoach: item, // Removed unnecessary curly braces around item
          selectedDepartment: happCoachDeptValues[index]
        }
      })
      setRows([...rows, ...addedrow])
    }
  }, [resultDivisionDetails])

  useEffect(() => {
    formDetails.setFieldsValue({
      clt: cltValues
    })
  }, [])

  const resultHappCoach = useGetHappCoachListQuery(
    { type: '' },
    {
      refetchOnMountOrArgChange: true
    }
  )

  const resultClt = useGetCltListQuery(
    { type: '' },
    {
      refetchOnMountOrArgChange: true
    }
  )

  const resultDepartment = useGetDeptListQuery(
    { divisionId: divisionId },
    {
      refetchOnMountOrArgChange: true
    }
  )

  const [updateCompanyDetails] = useUpdateCompanyDetailsMutation()

  const happCoachOptions =
    resultHappCoach?.data?.data?.data?.map(item => ({
      label: item.full_name,
      value: item._id
    })) || []

  const departmentOptions =
    resultDepartment?.data?.data?.map(item => ({
      label: item?.name,
      value: item._id
    })) || []

  if (resultDepartment?.error?.status == 400) {
    // Toast('s', resultDepartment?.error?.message)
  }

  const cltOptions =
    resultClt?.data?.data?.data?.map(item => ({
      label: item.full_name,
      value: item._id
    })) || []
  // add company details
  const handleSubmit = async values => {
    let cltData = []
    if (values?.clt?.[0]?.label) {
      cltData = values?.clt?.map(item => item?.value)
    } else {
      cltData = values?.clt
    }
    const transformedValues = {}

    // Iterate over the keys in the original values object
    Object.keys(values).forEach(key => {
      // Check if the key starts with "happcoach_"
      if (key.startsWith('happcoach_') && values[key]?.label) {
        // Add happcoach key to the result object with only the ID
        transformedValues[key] = { happcoachId: values[key].value }
      }

      // Check if the key starts with "department_" and process its value
      if (key.startsWith('department_')) {
        // Map the department array to get only the IDs
        transformedValues[key] = {
          departmentIds: values[key]?.map(dept => {
            if (dept?.label) {
              return dept?.value
            } else return dept
          })
        }
      }

      // Keep other keys intact
      // if (!key.startsWith('happcoach_') && !key.startsWith('department_')) {
      //     transformedValues[key] = values[key];
      // }
    })
    const resultArray = []

    // Get the unique numeric suffixes from the keys
    const indices = Object.keys(transformedValues)
      .map(key => key.match(/\d+/)) // Extract numeric part of the key
      .filter(Boolean) // Filter out any non-matching keys
      .map(match => match[0]) // Get the numeric value as string
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

    // Loop through the unique indices and combine the related keys
    indices.forEach(index => {
      const happcoachKey = `happcoach_${index}`
      const departmentKey = `department_${index}`

      // Ensure both happcoach and department exist before pushing to result array
      if (transformedValues[happcoachKey] && transformedValues[departmentKey]) {
        resultArray.push({
          happcoachId: transformedValues[happcoachKey].happcoachId,
          departmentIds: transformedValues[departmentKey].departmentIds
        })
      }
    })

    const happchIds = Object.keys(values)
      .filter(key => key.startsWith('happcoach_') && !values[key]?.label) // Filter keys that start with 'happcoach_'
      .map(happcoachKey => {
        const idSuffix = happcoachKey.split('_')[1] // Extract the suffix after '_'
        const departmentKey = `department_${idSuffix}` // Construct the corresponding department key
        return {
          happcoachId: values[happcoachKey],
          departmentIds: values[departmentKey]
        }
      })

    const hpIds = [...happchIds, ...resultArray]

    let payload = {
      cltId: JSON.stringify(cltData),
      happcoachId: JSON.stringify(hpIds),
      Id: companyId,
      divisionId: divisionId
    }
    try {
      let result = await updateCompanyDetails(payload).unwrap();
      Toast('s', result?.message);
      navigate('/company')
      formDetails.resetFields();
    } catch (error) {
      if (error?.data?.message) {
        Toast('e', error?.data?.message)
      } else Toast('e', error?.error)
    }
  }

  const addRow = () => {
    setRows([
      ...rows,
      { id: rows.length, selectedHappcoach: null, selectedDepartment: null }
    ])
  }

  const deleteRow = id => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id))
    }
  }

  const handleHappcoachChange = (value, rowId) => {
    setRows(
      rows.map(row =>
        row.id === rowId ? { ...row, selectedHappcoach: value } : row
      )
    )
  }

  const selectedHappcoaches = rows.map(row => row.selectedHappcoach)

  // Filter the happCoachOptions for each row to exclude already selected happcoaches
  // const getFilteredHappCoachOptions = (currentRowId) => {
  //     return happCoachOptions.filter(option => !selectedHappcoaches.includes(option.value) || rows.find(row => row.id === currentRowId).selectedHappcoach === option.value);
  // };

  const getFilteredHappCoachOptions = currentRowId => {
    return happCoachOptions
      .filter(
        option =>
          !selectedHappcoaches.includes(option.value) ||
          rows.find(row => row.id === currentRowId).selectedHappcoach ===
          option.value
      )
      .map(option => ({
        ...option,
        label: option.label
      }))
  }

  return (
    <div>
      <Form
        onFinish={handleSubmit}
        className='my-3 w-100 modalForm'
        form={formDetails}
      >
        <Row className='justify-between my-3'>
          <Col xs={24} md={24} lg={24} xl={24} className='mb-3'>
            <div className='text-extrabold text-xl mb-3'>Assign CLT</div>
            <Form.Item
              name='clt'
              label='CLT'
              rules={[{ required: true, message: 'Add clt' }]}
              className='w-[32.5%] mdMin:w-[80%]'
            >
              <Select
                value={cltValues}
                mode='tags'
                placeholder='Add clt'
                options={cltOptions} // Use the mapped options
              />
            </Form.Item>
          </Col>
          {/* <Col xs={24} md={24} lg={24} xl={24} className='mb-3'>
                        <div className='text-extrabold text-xl mb-3'>Assign Happcoach</div>
                        {rows.map((row, index) => (
                            <Row key={row.id} gutter={16} align="middle">
                                <Col xs={24} md={12} lg={10} xl={10}>
                                    <Form.Item
                                        name={`happcoach_${row.id}`}
                                        label="Happcoach"
                                        rules={[{ required: true, message: 'Please select Happcoach' }]}
                                        className='w-[80%]'
                                    >
                                        <Select
                                            placeholder="Select Happcoach"
                                            options={happCoachValues}
                                            onChange={(value) => handleHappcoachChange(value, row.id)}
                                            value={row.selectedHappcoach}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12} lg={10} xl={10}>
                                    <Form.Item
                                        name={`department_${row.id}`}
                                        label="Department"
                                        className='w-[80%]'
                                    >
                                        <Select
                                            mode="tags"
                                            placeholder="All"
                                            // value= {row.selectedDepartment}
                                            options={departmentOptions}
                                            value={row.selectedDepartment.map(dept => dept.value)}
                                        />
                                    </Form.Item>
                                </Col>

                                {index > 0 && (
                                    <Col xs={24} md={2} lg={2} xl={2}>
                                        <Button
                                            type="link"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => deleteRow(row.id)}
                                        />
                                    </Col>
                                )}
                            </Row>
                        ))}

                        <Button type="dashed" onClick={addRow} icon={<PlusOutlined />}>
                            Add Another
                        </Button>
                    </Col> */}

          <Col xs={24} md={24} lg={24} xl={24} className='mb-3'>
            <div className='text-extrabold text-xl mb-3'> Assign Happcoach</div>
            {filteredRows?.map((row, index) => (
              <Row key={row.id} gutter={16} align='middle'>
                <Col xs={24} md={12} lg={10} xl={10}>
                  <Form.Item
                    name={`happcoach_${row.id}`}
                    label='Happcoach'
                    rules={[
                      { required: true, message: 'Please select Happcoach' }
                    ]}
                    className='w-[80%]'
                  >
                    <Select
                      placeholder='Select Happcoach'
                      options={getFilteredHappCoachOptions(row.id)} // Filtered options
                      onChange={value => handleHappcoachChange(value, row.id)}
                      value={row.selectedHappcoach}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={10} xl={10}>
                  <Form.Item
                    name={`department_${row.id}`}
                    label='Department'
                    // rules={[{ required: true, message: 'Please select Department' }]}
                    className='w-[80%]'
                  >
                    <Select
                      mode='tags'
                      // defaultValue={'all'}
                      placeholder='All'
                      options={departmentOptions}
                    />
                  </Form.Item>
                </Col>
                {index > 0 && (
                  <Col xs={24} md={2} lg={2} xl={2}>
                    <Button
                      type='link'
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => deleteRow(row.id)}
                    />
                  </Col>
                )}
              </Row>
            ))}

            <Button type='dashed' onClick={addRow} icon={<PlusOutlined />}>
              Add Another
            </Button>
          </Col>
        </Row>
        <div className='flex justify-center items-center'>
          <Form.Item>
            <Button
              type='ghost'
              className='commonButton text-white !bg-defaultLightColor rounded w-[11.5rem] smMin:w-[5rem]'
              htmlType='submit'
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}
export default ManageCompany