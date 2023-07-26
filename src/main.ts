import { createTable } from './Table/index'
import { mockData } from './mock/mock'


const header =
  [
    { name: '日期', value: 'date' },
    { name: '姓名', value: 'name' },
    { name: '地址', value: 'address', width: '220px' }
  ]

createTable('#app', {
  data: mockData, // 表格数据
  tableHeader: header, // 表头数据
  clickRowCallback: (cell, rowData) => { // 点击行时的回调
    alert(`当前点击的单元格是 ${cell},这一行的数据是 ${JSON.stringify(rowData)}`)
  },
  pagination: {
    size: 4 //每一页多少条数据
  }
})