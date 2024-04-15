import { $, $$, useEffect, ObservableMaybe, Observable, ObservableReadonly, type JSX, } from 'woby'


/** 
 * Container class: overflow-auto flex-1 [direction:rtl] mx-auto
 * Content class:  
*/
export const useWheelPan = <T extends HTMLElement>(div: Observable<T>) => {
    let startX = 0
    let startY = 0
    let startScroll = false

    useEffect(() => {
        if (!$$(div)) return
        $$(div).scrollTop = 0
        $$(div).scrollLeft = 0
    })
    const handleWheel = e => { $$(div).scrollTop += e.deltaY }

    const handlePointerDown = (event/* :JSX.PointerEventHandler<T>|JSX.MouseEventHandler<T>|JSX.TouchEventHandler<T> */) => {
        // Store the initial pointer position
        startX = event.clientX || event.touches[0].clientX
        startY = event.clientY || event.touches[0].clientY

        startScroll = true
    }

    const handlePointerMove = (event) => {
        if (!startScroll) return
        // Calculate the distance moved horizontally and vertically
        const deltaX = ((event.clientX || event.touches[0].clientX) - startX)
        const deltaY = ((event.clientY || event.touches[0].clientY) - startY)

        // Adjust the scrollLeft and scrollTop properties based on the pointer movement
        $$(div).scrollLeft -= deltaX
        $$(div).scrollTop -= deltaY

        // Update the start positions for the next move event
        startX = event.clientX || event.touches[0].clientX
        startY = event.clientY || event.touches[0].clientY

        // Set the capture to track the pointer move event outside the target
        $$(div).setPointerCapture(event.pointerId)

        // Prevent the default behavior to stop the page from scrolling
        event.preventDefault()
    }

    const handlePointerUp = (event) => {
        startScroll = false
    }

    return { handleWheel, handlePointerDown, handlePointerMove, handlePointerUp }
}
