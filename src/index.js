import React, { useState } from 'react';
import { render } from 'react-dom';


import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';

moment.locale('zh-cn');




render(<App />, document.getElementById('root'));