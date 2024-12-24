import '../dist/output.css'
import 'woby-slider/dist/output.css'
import { $, $$, render, store, useEffect, useMemo, type JSX, isObservable, ObservableMaybe, type Observable, ObservableReadonly } from 'woby'
import { groupBy, orderBy, filter as ft, chain, sortBy, sumBy, isArray, omit, map, filter, includes, some } from "lodash-es"
import 'woby-wheeler/dist/output.css'
import { ToObservable } from './util'

export const useFilter = <T,>(db: ObservableMaybe<T[]>) => {
    const filters = {} as ToObservable<T, string>
    const fullTextSearch = $<string>('')
    const canFilters = store({}) as ToObservable<T, boolean>

    useEffect(() => {
        if (!$$(db)) return

        const ks = Object.keys($$(db)?.[0] ?? {})

        ks.forEach(k => !canFilters[k] && (canFilters[k] = $(true)))
        ks.forEach(k => !filters[k] && (filters[k] = $('')))
    })


    const filtered = useMemo(() => {
        if (!$$(db)) return []

        const searchText = $$(fullTextSearch)?.toLowerCase().split('\n').filter(d => d !== '')
        return !searchText?.length ? $$(db) :
            ft($$(db), item => some(searchText, text =>
                Object.keys(item).some(k => $$(canFilters[k]) && includes(item[k]?.toString().toLowerCase(), text))))
    })

    return {
        filters,
        fullTextSearch,
        filtered
    }
}
