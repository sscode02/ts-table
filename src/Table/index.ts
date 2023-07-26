import '../Table/style.css' // calss 统一使用hash结尾 避免污染全局

export interface tableOption {
    style?: string,
    tableHeader: Partial<Record<string, string>>[],
    data: any[],
    pagination?: {
        size: number
    }
    clickRowCallback?: (cellData: string, rowData: Record<any, any>) => void
}

// 暴露给用户使用的api 用于创建表格
export function createTable(root: string, options: tableOption) {
    const rootElement = document.querySelector(root)!

    const tableBodyElement = createTableBody(options) // 创建表格body
    const tableHeaderElement = createTableHeader(options) // 创建表格header
    let paginationElement: Element | undefined

    if (options?.pagination && options?.pagination?.size) { //判断是否需要分页
        paginationElement = createPagination(options)
    }

    const table = normalizeTable(tableBodyElement, tableHeaderElement, paginationElement) //组装表格

    rootElement.append(table) // 创建表格
}

function normalizeTable(body: Element, header: Element, pagination: Element | undefined) {
    const div = document.createElement('div')
    const divContiner = document.createElement('div') // 使用一个容器包裹body 方便后续更新
    divContiner.id = "divContiner"

    divContiner.append(body)
    div.append(header)
    div.append(divContiner)
    if (pagination) {
        div.append(pagination)
    }
    return div
}

function createTableBody(options: tableOption, page = 1) {
    const { data, tableHeader, pagination, clickRowCallback } = options
    if (pagination?.size! > data.length) {
        throw '传入的 pagination.size 长度有误'
    }
    if (!data) throw 'you must prop a data'

    const pageDate = data.slice((page - 1) * pagination?.size!,
        page * pagination?.size! > data.length ? (data.length) : page * pagination?.size!) // 处理当前页的数据 page-1 * size 到 page * size 就是当前的数据 

    const tableBody = document.createElement('div')

    if (clickRowCallback) { // 用户传入的回调存在时
        tableBody.addEventListener('click', (e) => { //添加事件委托
            const temp = e.target as HTMLElement
            clickRowCallback(temp.innerText, data[temp?.tabIndex])
        }, true)
    }


    for (let i = 0; i < pageDate.length; i++) { // 生成表格的数据
        const row = document.createElement('div')
        row.className = 'bodyRow-0d4fc4'

        for (let j = 0; j < tableHeader.length; j++) {
            const { value, width } = tableHeader[j]
            const div = document.createElement('div') as HTMLElement
            div.setAttribute('style', `width:${width}`)
            div.tabIndex = i
            div.innerText = pageDate[i][value!]
            row.append(div)
        }
        tableBody.append(row)
    }
    return tableBody
}

function createTableHeader(options: tableOption) {
    const { tableHeader } = options

    const tableHeaderElement = document.createElement('div')
    tableHeaderElement.className = 'tableHeader-0d4fc4'
    for (let i = 0; i < tableHeader.length; i++) {
        const { name, width } = tableHeader[i]
        const div = document.createElement('div')
        div.setAttribute('style', `width:${width}`)
        div.innerText = `${name}`
        tableHeaderElement.append(div)
    }

    return tableHeaderElement
}

function createPagination(options: tableOption) {
    const { data, pagination } = options
    const div = document.createElement('div')
    const pageNum = Math.ceil(data.length / pagination?.size!)
    let current = 1 // 默认第一页
    const total = document.createElement('div')

    div.className = 'pagination-0d4fc4'
    total.innerText = `共有${data.length}条`
    div.append(total)

    const cellContiner = document.createElement('div')
    cellContiner.id = "cellContiner"

    cellContiner.addEventListener('click', (e) => { // 切换页时，更新页面
        const temp = e.target as HTMLElement
        const currentElement = document.querySelector('#cellContiner')!
        if (temp.tabIndex !== current) {
            (currentElement.childNodes[current - 1] as HTMLElement).className = ""

            //@ts-expect-error
            currentElement.childNodes[temp.tabIndex - 1].className = 'pagination-click-0d4fc4'
            current = temp.tabIndex

            const bodyContiner = document.querySelector('#divContiner')
            const child = bodyContiner?.childNodes[0]
            bodyContiner?.removeChild(child!) // 删除旧的一页

            const temp1 = createTableBody(options, current) //插入新的一页， 如果在生产环境中使用 可以使用diff对比节点提升性能
            bodyContiner?.append(temp1)
        }

    })


    for (let i = 1; i <= pageNum; i++) { // 处理页码
        const currentPage = document.createElement('div');
        currentPage.tabIndex = i
        if (current === i) {
            currentPage.className = 'pagination-click-0d4fc4'
        }

        currentPage.innerText = i.toString()
        cellContiner.append(currentPage)
    }

    div.append(cellContiner)
    return div
}