import { $, $$, render, useEffect, useMemo, type JSX, isObservable } from 'woby'
import { groupBy, orderBy, filters as ft, chain, sortBy, sumBy, isArray, omit, map } from "lodash-es"
import { /* Table, TableProps,  */useData } from '../src/index'
import { tw } from '@woby/styled'
import { useClickAway, } from '@woby/use'
import { Wheeler, useRecordWheeler } from '@woby/wheeler'
import '@woby/wheeler/dist/output.css'

const ExpandMoreIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" {...props}><path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" /></svg>
const ExpandLessIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" {...props}><path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" /></svg>
const SquareIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg class="inline-block rotate-45 scale-50" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" {...props}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" /></svg>
const FilterIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" {...props}><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z" /></svg>
const FilterOffIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" {...props}><path d="M791-55 55-791l57-57 736 736-57 57ZM633-440l-80-80h167v80h-87ZM433-640l-80-80h487v80H433Zm-33 400v-80h160v80H400ZM240-440v-80h166v80H240ZM120-640v-80h86v80h-86Z" /></svg>

const ViewColumnIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" {...props}>
    <rect fill="none" height="24" width="24" />
    <path d="M3,5v14h18V5H3z M8.33,17H5V7h3.33V17z M13.67,17h-3.33V7h3.33V17z M19,17h-3.33V7H19V17z" />
</svg>

const db = [
    { id: 1, name: "Alice", age: 8, country: "Canada", add: "Canada" },
    { id: 2, name: "Bob", age: 12, country: "USA", add: "USA" },
    { id: 3, name: "Charlie", age: 25, country: "UK", add: "UK" },
    { id: 4, name: "David", age: 32, country: "Australia", add: "Australia" },
    { id: 5, name: "Eve", age: 19, country: "Canada", add: "Canada" },
    { id: 6, name: "Frank", age: 45, country: "USA", add: "USA" },
    { id: 7, name: "Grace", age: 7, country: "UK", add: "UK" },
    { id: 8, name: "Hank", age: 28, country: "Canada", add: "Canada" },
    { id: 9, name: "Ivy", age: 14, country: "USA", add: "USA" },
    { id: 10, name: "Jack", age: 33, country: "Australia", add: "Australia" },
    { id: 11, name: "Karen", age: 22, country: "Canada", add: "Canada" },
    { id: 12, name: "Liam", age: 17, country: "USA", add: "USA" },
    { id: 13, name: "Mia", age: 31, country: "UK", add: "UK" },
    { id: 14, name: "Noah", age: 5, country: "Australia", add: "Australia" },
    { id: 15, name: "Olivia", age: 28, country: "Canada", add: "Canada" },
    { id: 16, name: "Paul", age: 9, country: "USA", add: "USA" },
    { id: 17, name: "Quinn", age: 37, country: "UK", add: "UK" },
    { id: 18, name: "Ryan", age: 16, country: "Australia", add: "Australia" },
    { id: 19, name: "Sophia", age: 11, country: "Canada", add: "Canada" },
    { id: 20, name: "Thomas", age: 29, country: "USA", add: "USA" },
    { id: 21, name: "Uma", age: 6, country: "UK", add: "UK" },
    { id: 22, name: "Vincent", age: 42, country: "Australia", add: "Australia" },
    { id: 23, name: "Wendy", age: 15, country: "Canada", add: "Canada" },
    { id: 24, name: "Xander", age: 20, country: "USA", add: "USA" },
    { id: 25, name: "Yasmine", age: 24, country: "UK", add: "UK" },
    { id: 26, name: "Zane", age: 36, country: "Australia", add: "Australia" },
    { id: 27, name: "Ava", age: 13, country: "Canada", add: "Canada" },
    { id: 28, name: "Ben", age: 38, country: "USA", add: "USA" },
    { id: 29, name: "Chloe", age: 23, country: "UK", add: "UK" },
    { id: 30, name: "Daniel", age: 18, country: "Australia", add: "Australia" },
    { id: 31, name: "Emily", age: 7, country: "Canada", add: "Canada" },
    { id: 32, name: "Finn", age: 30, country: "USA", add: "USA" },
    { id: 33, name: "Georgia", age: 10, country: "UK", add: "UK" },
    { id: 34, name: "Henry", age: 27, country: "Australia", add: "Australia" },
    { id: 35, name: "Isabella", age: 14, country: "Canada", add: "Canada" },
    { id: 36, name: "Jacob", age: 28, country: "USA", add: "USA" },
    { id: 37, name: "Katherine", age: 26, country: "UK", add: "UK" },
    { id: 38, name: "Liam", age: 33, country: "Australia", add: "Australia" },
    { id: 39, name: "Mia", age: 6, country: "Canada", add: "Canada" },
    { id: 40, name: "Noah", age: 35, country: "USA", add: "USA" },
    { id: 41, name: "Olivia", age: 9, country: "UK", add: "UK" },
    { id: 42, name: "Peter", age: 17, country: "Australia", add: "Australia" },
    { id: 43, name: "Quinn", age: 12, country: "Canada", add: "Canada" },
    { id: 44, name: "Ryan", age: 19, country: "USA", add: "USA" },
    { id: 45, name: "Sophia", age: 8, country: "UK", add: "UK" },
    { id: 46, name: "Thomas", age: 22, country: "Australia", add: "Australia" },
    { id: 47, name: "Uma", age: 5, country: "Canada", add: "Canada" },
    { id: 48, name: "Vincent", age: 24, country: "USA", add: "USA" },
    { id: 49, name: "Wendy", age: 29, country: "UK", add: "UK" },
    { id: 50, name: "Xander", age: 16, country: "Australia", add: "Australia" }
]

const groupedData = chain(db)
    .groupBy((item) => [item.country])
    // .mapValues((countryData) =>
    //     sortBy(countryData, 'name')
    // )
    .value()

const nestedGroupData = chain(db)
    .groupBy("country")
    .mapValues((countryData) =>
        chain(countryData).groupBy((item) => item.name.charAt(0))
            .mapValues((countryData) =>
                sortBy(countryData, 'name')
            )
            .value()
    )
    .value()


const MainTab = () => {
    const inputRef = $<HTMLInputElement>()
    const inputCont = $<HTMLInputElement>()
    const showColummn = $(false)
    const showInput = $(false)

    const { filters, /* showInput,  */data, sorts, /* , sortdir, filterable, */  sortClick, shows, order } =
        useData<{ id: number, name: string, age: number, country: string, add: string, }>({ data: db, sortable: { name: true, age: true, country: true }, filterable: { id: false, add: false } })

    useClickAway(inputCont, () => showInput(false))
    useEffect(() => $$(showInput) && $$(inputRef) && $$(inputRef).focus())

    // useEffect(() => console.log($$(order)))
    order(['name', 'age', 'country', 'add', 'id',])

    const fi = <FilterIcon class='cursor-pointer inline-block' onClick={() => { showInput(true); $$(filters) }} />

    return <>
        <ViewColumnIcon class='cursor-pointer inline-block' onClick={() => { showColummn(true) }} />
        {() => $$(filters) && $$(filters).length > 0 ? <>{fi}<FilterOffIcon class='cursor-pointer inline-block' onClick={() => { showInput(false); filters(null) }} /></> : fi}
        {
            () => $$(showInput) ? <div ref={inputCont} class='inline-block'>
                <input ref={inputRef} class='border' value={filters} onKeyup={e => { filters(e.target.value); console.log(e.target.value) }} onKeydown={e => { e.keyCode === 13 && (showInput(false), filters(e.target.value)) }} />
                <span class='bg-[#f8e3fa] border cursor-pointer' onClick={() => { showInput(false); filters(null) }}>✖</span>
                <span class='bg-[#f7fae3] border cursor-pointer' onClick={() => { showInput(false) }}>✔</span></div> : null
        }
        <Wheeler {...useRecordWheeler(shows)} open={showColummn} toolbar />

        <Table data={data} class='w-1/2' order={order}
            TTh={() => <tr>
                <th colspan={2} class='text-[blue] border-[1px] border-solid border-[lightgray] uppercase'>Info</th>
                <th colspan={2} class='text-[blue] border-[1px] border-solid border-[lightgray] uppercase'>Countrry</th>
                <th class='text-[blue] border-[1px] border-solid border-[lightgray] uppercase'></th></tr>}
            Th={({ col }) => $$(shows[col]) ? <th onClick={() => sortClick(col)}
                class={['text-[blue] border-[1px] border-solid border-[lightgray] uppercase',
                    () => $$(sortable[col]) ? 'cursor-pointer' : '',
                    // '[&>div]:hidden [&:hover>div]:inline-block'
                ]}>
                {col}
                <div class='float-right'>{() => $$(sortable[col]) ?
                    ($$(sorts[col]) === 'asc') ? <ExpandLessIcon /> : ($$(sortdir[col]) === 'desc') ? <ExpandMoreIcon /> : <SquareIcon /> : null}</div>
            </th> : null}
            Td={({ col, row, }) => {
                const edit = $(false)
                const inp = $<HTMLInputElement>()
                const ref = $<HTMLTableCellElement>()
                useEffect(() => $$(inp)?.focus())

                return <td ref={ref} onClick={() => { edit(true); if (!isObservable(row[col])) row[col] = $(row[col]); useEffect(() => console.log($$(row[col]), data)) }}
                    class={['border-[1px] border-solid border-[lightgray] px-3 hover:bg-[#c4d7f5] w-[150px] p-0', col === 'age' ? 'text-right' : '']}>
                    {useMemo(() => $$(edit) ? <input style={{ width: () => $$(ref)?.offsetWidth }} class='px-2 m-0' ref={inp} onBlur={() => { edit(false); console.log('blur', $$(edit)) }} onChange={e => row[col](e.target.value)} value={row[col]}>{row[col]}</input> : <span class='px-2'>{row[col]}</span>)}
                    {/* <input style={{ width: () => $$(ref)?.offsetWidth }} class='p-0 m-0' ref={inp} onBlur={() => { edit(false); console.log('blur', $$(edit)) }} onChange={e => row[group](e.target.value)} value={row[group]}>{row[group]}</input> */}
                </td>
            }}

            Tr={tw('tr')`hover:bg-[#ebf5d5]`}
        />
    </>
}

// const MainTabHook = () => {
//     const sortable = {
//         id: $(false),
//         name: $(true),
//         age: $(true),
//         country: $(true),
//     }
//     const sortdir: Record<string, Observable<SortDir>> = {
//         id: $<SortDir>(''),
//         name: $<SortDir>(''),
//         age: $<SortDir>(''),
//         country: $<SortDir>(''),
//     }
//     const filterable = {
//         name: $(true),
//         age: $(true),
//         country: $(true),
//     }
//     const sortorder: string[] = []

//     const data = $(db)
//     const filters = $<string>(null)
//     const showInput = $(false)
//     const showColummn = $(false)
//     const inputRef = $<HTMLInputElement>()
//     const inputCont = $<HTMLInputElement>()

//     const sortClick = (col: string) => {
//         const sd = sortdir[col]
//         if ($$(sortable[col]))
//             if ($$(sd) === '') {
//                 sd('asc')
//                 if (sortorder.indexOf(col) == -1)
//                     sortorder.push(col)
//             }
//             else if ($$(sd) === 'asc') {
//                 sd('desc')
//                 if (sortorder.indexOf(col) == -1)
//                     sortorder.push(col)
//             }
//             else if ($$(sd) === 'desc') {
//                 sd('')
//                 const pos = sortorder.indexOf(col)
//                 sortorder.splice(pos, 1)
//             }

//         const keyValueArray = Object.entries(sortdir).map(([key, value]) => ({ key, value }))
//         const sorts = keyValueArray.filters(k => $$(k.value) !== '')

//         const fb = ft(db, d => !$$(filters) ? true : Object.keys(d).filters(k => $$(filterable[k])).some(k => d[k]?.toString().toLocaleLowerCase().indexOf($$(filters).toLocaleLowerCase()) >= 0))
//         if (sorts.length > 0)
//             data(orderBy(fb, sortorder, sortorder.map(k => $$(sortdir[k])) as any))
//         else
//             data(fb)
//     }
//     useClickAway(inputCont, () => showInput(false))
//     useEffect(() => $$(showInput) && $$(inputRef) && $$(inputRef).focus())
//     useEffect(() => {
//         $$(filters)
//         sortClick("")
//     })
//     const fi = <FilterIcon class='cursor-pointer inline-block' onClick={() => { showInput(true); $$(filters) }} />

//     const { Th, Td, Tr, table } = useTable({ data, class: 'w-1/2' })
//     Th(({ col, }) => <th onClick={() => sortClick(col)}
//         class={['text-[blue] border-[1px] border-solid border-[lightgray] uppercase',
//             () => $$(sortable[col]) ? 'cursor-pointer' : '',
//             // '[&>div]:hidden [&:hover>div]:inline-block'
//         ]}>
//         {col}
//         <div class='float-right'>{() => $$(sortable[col]) ?
//             ($$(sortdir[col]) === 'asc') ? <ExpandLessIcon /> : ($$(sortdir[col]) === 'desc') ? <ExpandMoreIcon /> : <SquareIcon /> : null}</div>
//     </th>)
//     Td(({ col, row, }) => {
//         const edit = $(false)
//         const inp = $<HTMLInputElement>()
//         const ref = $<HTMLTableCellElement>()

//         useEffect(() => $$(inp)?.focus())

//         return <td ref={ref} onClick={() => { edit(true); if (!isObservable(row[col])) row[col] = $(row[col]); useEffect(() => console.log($$(row[col]), data)) }}
//             class={['border-[1px] border-solid border-[lightgray] px-3 hover:bg-[#c4d7f5] w-[150px] p-0', col === 'age' ? 'text-right' : '']}>
//             {useMemo(() => $$(edit) ? <input style={{ width: () => $$(ref)?.offsetWidth }} class='px-2 m-0' ref={inp} onBlur={() => { edit(false); console.log('blur', $$(edit)) }} onChange={e => row[col](e.target.value)} value={row[col]}>{row[col]}</input> : <span class='px-2'>{row[col]}</span>)}
//             {/* <input style={{ width: () => $$(ref)?.offsetWidth }} class='p-0 m-0' ref={inp} onBlur={() => { edit(false); console.log('blur', $$(edit)) }} onChange={e => row[group](e.target.value)} value={row[group]}>{row[group]}</input> */}
//         </td>
//     })
//     Tr(tw('tr')`hover:bg-[#ebf5d5]`)

//     return <>
//         {() => $$(filters) && $$(filters).length > 0 ? <>{fi}<FilterOffIcon class='cursor-pointer inline-block' onClick={() => { showInput(false); filters(null) }} /></> : fi}
//         {
//             () => $$(showInput) ? <div ref={inputCont} class='inline-block'>
//                 <input ref={inputRef} class='border' value={filters} onKeyup={e => { filters(e.target.value); console.log(e.target.value) }} onKeydown={e => { e.keyCode === 13 && (showInput(false), filters($$(changing))) }} />
//                 <span class='bg-[#f8e3fa] border cursor-pointer' onClick={() => { showInput(false); filters(null) }}>✖</span>
//                 <span class='bg-[#f7fae3] border cursor-pointer' onClick={() => { showInput(false) }}>✔</span></div> : null
//         }
//         <ViewColumnIcon class='cursor-pointer inline-block' onClick={() => { showColummn(true) }} />
//         {() => $$(showColummn) ? <></> : <></>}

//         {table}
//     </>
// }
const App = (): JSX.Element => {

    return <>
        <MainTab />
        < br />
        {/* <MainTabHook />
        < br /> */}

        <Table data={groupedData} collapsed class='w-1/2'
            Th={({ col, group }) => <th class='text-[blue] border-[1px] border-solid border-[lightgray]'>{col}</th>}
            Tr={tw('tr')`hover:bg-[#ebf5d5]`}
            Nr={tw('tr')`hover:bg-[#f5d6f0]`}
            Gr={tw('tr')`hover:font-bold cursor-pointer`}
            Gt={(props) => <Table {...props} class={'w-full'} />}
            Gd={({ group, groups, collapse, data }) => { console.log('groups', groups); return <td class='border-[1px] border-solid border-[lightgray]' colSpan={groups.length}><span class={group.length > 1 ? '' : 'pl-2'}>{() => $$(collapse) ? <ExpandMoreIcon /> : <ExpandLessIcon />} {group} {isArray(data) ? <>[{data.length}] Avg: {(sumBy(data, 'age') / data.length).toFixed(0)}</> : ''}</span></td> }}
            preprocessor={(d, k) => {
                // console.log('preprocess', k)
                if (k && k.length === 1 && k[0] === 'USA')
                    return Array.isArray(d) ? chain(d).groupBy((item) => item.name.charAt(0))
                        .mapValues((countryData) =>
                            sortBy(countryData, 'name')
                        )
                        .value() : d
                return d
            }}
        />
        <br />
        <Table data={nestedGroupData} collapsed class='w-1/2'
            Th={({ col, }) => <th class='text-[blue] border-[1px] border-solid border-[lightgray]'>{col}</th>}
            Tr={tw('tr')`hover:bg-[#ebf5d5]`}
            Nr={tw('tr')`hover:bg-[#f5d6f0]`}
            Gr={tw('tr')`hover:font-bold cursor-pointer`}
            preprocessor={(d, k) => (console.log('preprocess', k), d)}
        />
    </>
}

render(<App />, document.body)
