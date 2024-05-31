import '../dist/output.css'
import 'woby-slider/dist/output.css'
import { $$$, ObservantAll, make, } from "use-woby"
import { $, $$, render, useEffect, useMemo, type JSX, isObservable, ObservableMaybe, type Observable, ObservableReadonly } from 'woby'
import { groupBy, orderBy, filter as ft, chain, sortBy, sumBy, isArray, omit, map, filter } from "lodash-es"
import 'woby-wheeler/dist/output.css'


export enum SortDir {
    NoSort = 0,
    Asc = 1,
    Des = 2,
}
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
