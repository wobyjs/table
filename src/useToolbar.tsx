import React, { $, $$, render, useEffect, useMemo, type JSX, isObservable, ObservableMaybe, Observable, ObservableReadonly } from 'woby'
import { ToObservable } from './index'
import { useClickAway, } from 'use-woby'
import { Wheeler, useRecordWheeler } from 'woby-wheeler'
import 'woby-wheeler/dist/output.css'

const FilterIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" {...props}><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z" /></svg>
const FilterOffIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" {...props}><path d="M791-55 55-791l57-57 736 736-57 57ZM633-440l-80-80h167v80h-87ZM433-640l-80-80h487v80H433Zm-33 400v-80h160v80H400ZM240-440v-80h166v80H240ZM120-640v-80h86v80h-86Z" /></svg>

const ViewColumnIcon = (props: JSX.SVGAttributes<SVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" {...props}>
    <rect fill="none" height="24" width="24" />
    <path d="M3,5v14h18V5H3z M8.33,17H5V7h3.33V17z M13.67,17h-3.33V7h3.33V17z M19,17h-3.33V7H19V17z" />
</svg>

export const useToolbar = <T,>({ canHide, fullTextSearch, canFilter, shows }:
    { canHide: Observable<boolean>, canFilter: Observable<boolean>, fullTextSearch: Observable<string>, shows: ToObservable<T, boolean> }) => {
    const display = $(false)
    const showFullTextSearch = $(false)
    const inputCont = $<HTMLInputElement>()
    const inputRef = $<HTMLInputElement>()

    const fi = <button title='Filter' class='cursor-pointer inline-block align-middle' onClick={() => { showFullTextSearch(true); $$(canFilter) }}><FilterIcon /></button>

    useEffect(() => $$(showFullTextSearch) && $$(inputRef) && $$(inputRef).focus())
    useClickAway(inputCont, () => showFullTextSearch(false))

    return {
        display,
        toolbar: <div class='py-1'>
            {() => !$$(canHide) ? null : <button title='Show/hide columns' class='cursor-pointer inline-block align-middle' onClick={() => { display(true) }} ><ViewColumnIcon /></button>}
            {() => $$(fullTextSearch) ? <>{fi}<button title='Filter off' class='cursor-pointer inline-block align-middle' onClick={() => { showFullTextSearch(false); fullTextSearch(null) }}><FilterOffIcon /></button></> : fi}
            {
                () => $$(showFullTextSearch) ? <div ref={inputCont} class='inline-block'>
                    <input ref={inputRef} class='border' value={fullTextSearch} onKeyUp={e => { fullTextSearch(e.target.value); console.log(e.target.value) }} onKeyDown={e => { e.keyCode === 13 && (showFullTextSearch(false), fullTextSearch(e.target.value)) }} />
                    <span title='Remove filter' class='bg-[#f8e3fa] border cursor-pointer' onClick={() => { showFullTextSearch(false); fullTextSearch(null) }}>✖</span>
                    <span title='Set filter' class='bg-[#f7fae3] border cursor-pointer' onClick={() => { showFullTextSearch(false) }}>✔</span></div> : null
            }
            <Wheeler {...useRecordWheeler(shows)} open={display} toolbar />
        </div>
    }
}

