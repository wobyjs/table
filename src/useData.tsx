import '../dist/output.css'
import 'woby-slider/dist/output.css'
import { $$$, ObservantAll, make } from "use-woby"
import { $, $$, render, useEffect, useMemo, type JSX, isObservable, ObservableMaybe, Observable } from 'woby'
import { groupBy, orderBy, filter as ft, chain, sortBy, sumBy, isArray, omit, map } from "lodash-es"
import 'woby-wheeler/dist/output.css'


export type SortDir = 'asc' | 'desc' | ''
export type ToObservable<T, V> = Record<keyof T, ObservableMaybe<V>>
export type SortDirRecord<T> = Record<keyof T, Observable<SortDir>>

export type IData<T> = {
    data: ObservableMaybe<T[]>,
    sortable?: Partial<ToObservable<T, boolean>>
    sortdir?: Partial<SortDirRecord<T>>
    filterable?: Partial<ToObservable<T, boolean>>
    showColumns?: Partial<ToObservable<T, boolean>>

    filter?: ObservableMaybe<string>
    showInput?: ObservableMaybe<boolean>
    showColumn?: ObservableMaybe<boolean>
    orderColummn?: ObservableMaybe<boolean>
}

export const useData = <T,>(props: IData<T>) => {
    const sortable: ToObservable<T, boolean> = {} as ToObservable<T, boolean>
    const sortdir: SortDirRecord<T> = {} as SortDirRecord<T>
    const filterable: ToObservable<T, boolean> = {} as ToObservable<T, boolean>
    const showColumns: ToObservable<T, boolean> = {} as ToObservable<T, boolean>

    Object.keys(props.data[0]).forEach((key/* : keyof T */) => {
        sortable[key] = isObservable(props.sortable?.[key]) ? props.sortable?.[key] : $(props.sortable?.[key] ?? true)
        sortdir[key] = isObservable(props.sortdir?.[key]) ? props.sortdir?.[key] : $<SortDir>($$(props.sortdir?.[key]) ?? '')
        filterable[key] = isObservable(props.filterable?.[key]) ? props.filterable?.[key] : $(props.filterable?.[key] ?? true)
        showColumns[key] = isObservable(props.showColumns?.[key]) ? props.showColumns?.[key] : $(props.showColumns?.[key] ?? true)
    })

    const sortorder: string[] = []
    const { data: db, ...ps } = props
    const { data, filter, showInput, showColumn } = make(Object.assign({ filter: null, showInput: false, showColumn: false }, props))
    const orderColumns = $(Object.keys($$(db)[0]))

    const sortClick = (col: string) => {
        const sd = sortdir[col]
        if ($$(sortable[col]))
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

        const keyValueArray = Object.entries(sortdir).map(([key, value]) => ({ key, value }))
        const sorts = keyValueArray.filter(k => $$(k.value) !== '')

        let fb = ft(db, d => !$$(filter) ? true : Object.keys(d).filter(k => $$(filterable[k])).some(k => (d[k] as any)?.toString().toLocaleLowerCase().indexOf($$(filter).toLocaleLowerCase()) >= 0))
        const hides = Object.keys(showColumns).filter(k => !$$(showColumns[k])).map(k => k)
        if (hides.length)
            //@ts-ignore
            fb = fb.map(r => omit(r, hides))
        if (sorts.length > 0)
            data(orderBy(fb, sortorder, sortorder.filter(r => hides.indexOf(r) < 0).map(k => $$(sortdir[k])) as any) as any)
        else
            data(fb as any)
    }
    useEffect(() => {
        $$(filter)
        sortClick("")
    })

    return { data, filter, sortable, sortdir, filterable, showInput, showColumn, sortClick, showColumns, orderColumns }
}
