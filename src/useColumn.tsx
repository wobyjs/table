import { $, $$, render, useEffect, useMemo, type JSX, isObservable, ObservableMaybe, type Observable, ObservableReadonly } from 'woby'
import 'woby-wheeler/dist/output.css'
import { ToObservable } from './util'


export const useColumn = <T,>(db: ObservableMaybe<T[]>, show: Partial<ToObservable<T, boolean>>) => {
    const columns = useMemo(() => Object.keys($$(db)?.[0] ?? {}))

    const visibleColumns = useMemo(() => $$(columns).filter(column => !$$(show[column])))

    const haveHide = useMemo(() => $$(columns).some(column => !$$(show[column])))

    const data = useMemo(() => {
        if (!$$(db)) return []

        if (!$$(haveHide))
            return $$(db)
        
        return $$(db).map(row => {
            const filteredRow = {} as Partial<T>

            $$(visibleColumns).forEach(column => {
                filteredRow[column] = row[column]
            })

            return filteredRow
        })
    })

    return {
        visibleColumns,
        haveHide,
        data
    }
}
