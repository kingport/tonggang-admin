import React, { useImperativeHandle, forwardRef } from 'react';
import { useSelector } from 'dva';
import { Button, Row, Select, Form, Input, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { STATUS_COMPANY } from '@/utils/constant';

const { Item: FormItem } = Form;
const { Option } = Select;

const SearchForm = (props, ref) => {
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const userAgentType = useSelector(({ global }) => global.userAgentType);
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      
      return await form.validateFields();
    },
  }));
  const onFinish = (values) => {
    const { getCompanyList } = props;
    getCompanyList(values);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  //导入表格
  // const importsExcel = (file) => {
  //   //使用promise导入
  //   return new Promise((resolve, reject) => {
  //     // 获取上传的文件对象
  //     const { files } = file.target; //获取里面的所有文件
  //     // 通过FileReader对象读取文件
  //     const fileReader = new FileReader();

  //     fileReader.onload = (event) => {
  //       //异步操作  excel文件加载完成以后触发
  //       try {
  //         const { result } = event.target;
  //         // 以二进制流方式读取得到整份excel表格对象
  //         const workbook = XLSX.read(result, { type: 'binary' });
  //         let data = []; // 存储获取到的数据
  //         // 遍历每张工作表进行读取（这里默认只读取第一张表）
  //         for (const sheet in workbook.Sheets) {
  //           if (workbook.Sheets.hasOwnProperty(sheet)) {
  //             data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
  //           }
  //         }
  //         resolve(data); //导出数据
  //       } catch (e) {
  //         // 这里可以抛出文件类型错误不正确的相关提示
  //         reject('失败'); //导出失败
  //       }
  //     };
  //     // 以二进制方式打开文件
  //     fileReader.readAsBinaryString(files[0]);
  //   });
  // };

  // 批量添加公司
  // const addCompanyList = async (testList) => {
  //   for (let i = 0; i < testList.length; i++) {
  //     let timer = setTimeout(async() => {
  //       console.log(testList[i], 'OOOOO');
  //         let data = {
  //           company_registered_address: '待完善',
  //           company_business_address: '待完善',
  //           registered_capital: '2',
  //           driver_num: 100,
  //           car_num: 100,
  //           company_type: 1,
  //           company_business: 1,
  //           identifier_code: '342IGIUTTY22',
  //           legal_name: '待完善',
  //           legal_idno: '440846199803225876',
  //           legal_photo: '13897746574',
  //           email: '123333@qq.com',
  //           business_license_valid_date: '2027-06-30 00:00:00',
  //           business_license_photo: 'shdjshjdwioaushd',
  //           legal_id_front_photo: 'shdjshjdwioaushd',
  //           legal_id_backend_photo: 'shdjshjdwioaushd',
  //           legal_area: '深圳市',
  //           bank_name: '待完善',
  //           account_opening_branch: '待完善',
  //           bank_code: '243523432552357645',
  //           public_driver_order_profit: '15',
  //           third_driver_order_profit: '15',
  //           agent_b_order_profit: '5',
  //           broker_name: '待完善',
  //           broker_idno: '440582199603165874',
  //           max_acount_num: '20',
  //           cooperate_date: '2021-09-01 23:59:59',
  //           ...testList[i],
  //         };
  //         const res = await addCompany(data)
  //         if(res) {
  //           message.success('添加成功')
  //         }else {
  //           clearTimeout(timer)
  //           return message.error(`添加出错 程序终止 错误出现列表在${i}行`)
  //         }       
  //     }, (i + 1) * 5000);
  //   }
  // };

  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="company_name" label="公司">
            <Input placeholder="输入查询的公司" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="area_id" label="城市">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {userCityCountyList &&
                userCityCountyList.map((item) => {
                  return (
                    <Option key={item.city} value={item.city}>
                      {item.city_name}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="company_status" label="状态">
            <Select placeholder="请选择" allowClear showSearch>
              {STATUS_COMPANY.map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="agent_type" label="代理商类型">
            <Select placeholder="请选择" allowClear showSearch>
              {userAgentType &&
                userAgentType.map((item) => {
                  return (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            style={{ margin: '0 8px' }}
            htmlType="button"
            onClick={onReset}
          >
            重置
          </Button>
          {/* <input
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => {
              importsExcel(e).then(
                function (data) {
                  addCompanyList(data);
                  // actionList(data);
                },
                function (data) {
                  console.log(data);
                },
              );
            }}
          /> */}
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
