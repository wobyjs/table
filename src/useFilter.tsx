import '../dist/output.css'
import 'woby-slider/dist/output.css'
import { $, $$, render, store, useEffect, useMemo, type JSX, isObservable, ObservableMaybe, type Observable, ObservableReadonly } from 'woby'
import { groupBy, orderBy, filter as ft, chain, sortBy, sumBy, isArray, omit, map, filter } from "lodash-es"
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

        const f = $$(fullTextSearch)?.toLowerCase()
        return !f?.length ? $$(db) : ft($$(db), d => Object.keys(d).some(k => $$(canFilters[k]) && d[k]?.toString().toLowerCase().includes(f)))
    })

    return {
        filters,
        fullTextSearch,
        filtered
    }
}
