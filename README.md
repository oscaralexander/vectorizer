# Vectorizer

Vectorizer turns any bitmap image into a vector image by breaking it up into a grid of squares (blocks), and rendering a vector element to represent the brightness of each square. Higher resolution images yield better results, but take longer to process.

## Browser support
Tested in Safari and Chrome, where Safari proves ~300% faster than Chrome. UI is buggy in Firefox, sorry.

## Parameters
The UI provides a few parameters for rendering.

* **Block size** - The size of the squares the image will be divided into, similar to the Mosaic filter in Photoshop.
* **Weight** - Maximum size of the vector element that will occupy each block, relative to the block size. Value between 0 and 1 recommended.
* **Background color** - Pretty fucking obvious, no?
* **Foreground color** - Oh come on.

## Disclaimer
This wasn't designed to be public-facing tool so please bear with any quirks and lack of better documentation. Hope you'll have some fun with it regardless!