import './App.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ConfigProvider, DatePicker, message } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';

import Login from './Login'
import Home from './Home'

const App = () => {
  const [date, setDate] = useState(null);
  const handleChange = value => {
    message.info(`您选择的日期是: ${value ? value.format('YYYY年MM月DD日') : '未选择'}`);
    setDate(value);
  };
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Switch> 
          <Route path="/login" component={Login}></Route>
          <Route path="/home" component={Home}></Route>
          <Redirect to="/login" from='/' /> 
        </Switch>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
