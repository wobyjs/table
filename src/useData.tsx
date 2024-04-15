import '../dist/output.css'
import 'woby-slider/dist/output.css'
import { $$$, ObservantAll, make, } from "use-woby"
import { $, $$, render, useEffect, useMemo, type JSX, isObservable, ObservableMaybe, type Observable, ObservableReadonly } from 'woby'
import { groupBy, orderBy, filter as ft, chain, sortBy, sumBy, isArray, omit, map, filter } from "lodash-es"
import 'woby-wheeler/dist/output.css'


export type SortDir = 'asc' | 'desc' | ''
export type ToObservable<T, V> = Record<keyof T, Observable<V>>
export type SortDirRecord<T> = Record<keyof T, Observable<SortDir>>

export type IData<T> = {
    data: ObservableMaybe<T[]>,
    //sortable?: Partial<ToObservable<T, boolean>>
    //sortdir?: Partial<SortDirRecord<T>>
    //filterable?: Partial<ToObservable<T, boolean>>
    //visible?: Partial<ToObservable<T, boolean>>
    //order?: ObservableMaybe<string[]>

    // canFilter?: ObservableMaybe<string>
    // //showInput?: ObservableMaybe<boolean>
    // canVisible?: ObservableMaybe<boolean>
    // canOrder?: ObservableMaybe<boolean>
}

function customSort<T>(arr: T[], order: T[]): T[] {
    const orderIndex = {} as any

    order.forEach((value, index) => {
        orderIndex[value] = index
    })

    return arr.sort((a, b) => {
        const indexA = orderIndex[a] !== undefined ? orderIndex[a] : order.length
        const indexB = orderIndex[b] !== undefined ? orderIndex[b] : order.length

        return indexA - indexB
    })
}

export const useFlags = <T,>(db: ObservableMaybe<T[]>) => {
    const canSorts = {} as ToObservable<T, boolean>
    const canHides = {} as ToObservable<T, boolean>
    const canFilters = {} as ToObservable<T, boolean>

    const canSort = $(true)
    const canHide = $(true)
    const canFilter = $(true)

    const canOrder = $(true)

    useEffect(() => {
        if (!$$(db)) return

        const ks = Object.keys($$(db)[0])

        ks.forEach(k => {
            !canSorts[k] && (canSorts[k] = $(true))
            !canFilters[k] && (canFilters[k] = $(true))
            !canHides[k] && (canHides[k] = $(true))
        })
    })

    return {
        canSort,
        canHide,
        canFilter,
        canSorts,
        canHides,
        canFilters,
        canOrder
    }
}


export const useData = <T,>(db: ObservableMaybe<T[]>) => {
    const sorts = {} as SortDirRecord<T>
    const shows = {} as ToObservable<T, boolean>
    const filters = {} as ToObservable<T, string>
    /** Full Text Search */
    const fullTextSearch = $<string>('')
    const refresh = $(Math.random())
    const order = $([])
    const data = $<Partial<T>[]>()

    const { canSort, canHide, canFilter, canSorts, canHides, canFilters, canOrder } = useFlags(db)

    const oriData = $<T[]>()
    useEffect(() => { oriData($$(db)) })

    useEffect(() => {
        if (!$$(db)) return

        const ks = Object.keys($$(db)[0])

        ks.forEach(k => {
            !sorts[k] && (sorts[k] = $(''))
            !filters[k] && (filters[k] = $(''))
            !shows[k] && (shows[k] = $(true))
        })
    })

    const allColumns = useMemo(() => Object.keys($$(oriData)?.[0]))
    const columns = useMemo(() => customSort($$(allColumns).filter(k => $$(shows[k]) === undefined || !!$$(shows[k])), $$(order)))

    const sortorder: string[] = []
    const sortClick = (col: string) => {
        const sd = sorts[col]
        if ($$(sd) === '') {
            sd('asc')
            if (sortorder.indexOf(col) == -1)
                sortorder.push(col)
        }
        else if ($$(sd) === 'asc') {
            sd('desc')
            if (sortorder.indexOf(col) == -1)
                sortorder.push(col)
        }
        else if ($$(sd) === 'desc') {
            sd('')
            const pos = sortorder.indexOf(col)
            sortorder.splice(pos, 1)
        }

        const keyValueArray = Object.entries(sorts).map(([key, value]) => ({ key, value }))
        const srts = keyValueArray.filter(k => $$(k.value) !== '')

        // let fb = ft($$(db), d =>
        //     Object.entries(filters).every(([key, filterValue]) =>
        //         ($$(filterValue) === undefined || $$(filterValue) === '') ||
        //         d[key]?.toString().toLowerCase().includes($$(filterValue)?.toString().toLowerCase())
        //     )
        // )

        const f = $$(fullTextSearch)?.toLowerCase()
        let fb = !f?.length ? $$(db) : ft($$(db), d => Object.keys(d).some(k => $$(canFilters[k]) && d[k]?.toString().toLowerCase().includes(f)))

        const hd = Object.keys(shows).filter(key => !$$(shows[key]))

        if (Object.keys(hd).length > 0)
            //@ts-ignore
            fb = fb.map(r => omit(r, hd))

        if (srts.length > 0)
            data(orderBy(fb, sortorder, sortorder.filter(r => !!$$(shows[r])).map(k => $$(sorts[k])) as any) as any)
        else
            data(fb as any)
    }
    useEffect(() => {
        $$(fullTextSearch)
        Object.keys(sorts).forEach(k => useEffect(() => { $$(sorts[k]); refresh(Math.random()) }))
        Object.keys(filters).forEach(k => useEffect(() => { $$(filters[k]); refresh(Math.random()) }))
        $(refresh)
        if ($$(db))
            sortClick("")
    })

    const haveFilters = useMemo(() => !$$(filters) && $$(filters) !== '')
    const haveSort = useMemo(() => Object.keys(sorts).some(k => $$(sorts[k]) !== ''))
    const haveHide = useMemo(() => Object.keys(shows).some(k => !$$(shows[k])))

    return {
        data, filters, sorts, sortClick, order, oriData, columns,
        haveFilters, haveSort, haveHide, shows,
        fullTextSearch,
        // refresh,
        canSort, canHide, canFilter, canSorts, canHides, canFilters, canOrder
    }
}

