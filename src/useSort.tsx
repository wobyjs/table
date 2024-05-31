import '../dist/output.css'
import 'woby-slider/dist/output.css'
import { $, $$, render, useEffect, store, useMemo, type JSX, isObservable, ObservableMaybe, type Observable, ObservableReadonly } from 'woby'
import { groupBy, orderBy, filter as ft, chain, sortBy, sumBy, isArray, omit, map, filter } from "lodash-es"
import 'woby-wheeler/dist/output.css'
import { SortDirRecord, SortDir, ToObservable } from './util'


export function customSort<T>(arr: T[], order: T[]): T[] {
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

export const useSort = <T,>(db: ObservableMaybe<T[]>, shows: ToObservable<T, boolean>) => {
    const sorts = store({}) as SortDirRecord<T>

    useEffect(() => {
        if (!$$(db)) return

        const ks = Object.keys($$(db)?.[0] ?? {})

        ks.forEach(k => !sorts[k] && (sorts[k] = $(SortDir.NoSort)))
    })

    const sortorder: string[] = []
    const ordered = useMemo(() => {
        Object.keys(sorts).map(k => {
            const sd = sorts[k] as Observable<SortDir>
            if (sd) {
                if ($$(sd) === SortDir.Asc) {
                    sd(SortDir.Asc)
                    if (sortorder.indexOf(k) === -1) {
                        sortorder.push(k)
                    }
                } else if ($$(sd) === SortDir.Des) {
                    sd(SortDir.NoSort)
                    const pos = sortorder.indexOf(k)
                    sortorder.splice(pos, 1)
                } else {
                    sd(SortDir.Asc)
                    if (sortorder.indexOf(k) === -1) {
                        sortorder.push(k)
                    }
                }
            }
        })

        if (!sortorder.length)
            return $$(db)
        
        return orderBy($$(db), sortorder, sortorder.filter(r => !!$$(shows[r])).map(k => $$(sorts[k])) as any) as any

    })


    return {
        sorts,
        ordered
    }
}
