import { $, $$, Observable, ObservableMaybe, useEffect, useMemo } from 'woby'

export const useVirtualizedTable = <T,>(rows: Observable<T[]> = $([]), page_size = 10) => {
    const currentPage = $<number>(1)
    const pageSize = $<number>(page_size)

    const total = useMemo(()=>$$(rows).length)
    const visibleRows = useMemo(() => $$(rows).slice(($$(currentPage) - 1) * $$(pageSize), $$(currentPage) * $$(pageSize)))
    const totalPage = useMemo(() => {
        const tp = ($$(rows).length ?? 1) / ($$(pageSize) ?? 1)
        return Math.ceil(tp < 1 ? 1 : tp)
    })

    return {
        rows,
        visibleRows,
        /** For server count */
        total,
        totalPage,
        currentPage,
        pageSize,
    }
};

