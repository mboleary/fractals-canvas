# JS Fractal Explorer TODO File

Initial Release:
    [ ] Implement Zooming and Panning using the Cursor (Wheel and click Events)
        - May need to do a Low-resolution Render First before doing a second pass for Higher-resolution
        - https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
            - Inherits from https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
            - Can get Coordinates, as well as wheel delta. Delta value can change Zoom Amount
        - Also have a slider to reset zoom amount
        - Maybe have decimal coordinates to set the coordinates for viewing certain fractal points
    [ ] Implement Fractal using Self-timeouts to allow for message passing (this is mainly a firefox problem)
        - Chunk the Canvas into NxN blocks (some blocks will have less pixels based on size) that are passed into message queue, and update the image information in that range
            - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
            - Allows for writing only part of an image to the canvas
            - May allow for a low-res first pass rendering that may be useful for zooming
            - Need to find a way to estimate how long rendering that chunk will take
                - use Drawing Algorithm to render low-res based on number of chunks
                - Assign priority where faster chunks will be drawn first
        - Implement a progress bar for rendering
            - Bar at top or bottom of screen (div element)
    [ ] Make Control Panel Hideable without using Inspect Element
    [ ] Implement Canvas Resizing resolution
    [ ] Image Export from Canvas
        - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL

Future:
    [ ] Refactor the code to make it more modular
        - Would allow for implementing other Fractals
        - Use Modules and Classes:
            - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
                - Classes will provide interface to produce fractals and draw things on the canvas
                - Should also provide method to populate the control panel (custom element?)
                - Should also provide Color Control Panels
    [ ] Implement Other Coloring algorithms
        - Gradient Editor (number of iterations)
        - https://en.wikipedia.org/wiki/Mandelbrot_set#Histogram_coloring
    [ ] Fully implement the Color Control Panel (Linear, Transform, etc...)
    [ ] Look into adding the ability to adjust the power of the Mandelbrot Set (https://en.wikipedia.org/wiki/File:Mandelbrot_Set_Animation_1280x720.gif)
    [ ] Add https://en.wikipedia.org/wiki/Tricorn_(mathematics)
