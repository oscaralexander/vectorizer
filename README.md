# Vectorizer

Vectorizer turns any bitmap image into a vector image by breaking it up into a grid of squares (blocks), and rendering a vector element to represent the brightness of each square. Higher resolution images yield better results, but take longer to process.

## Browser support
Tested in Safari and Chrome, where Safari proves ~300% faster than Chrome. UI is still buggy in Firefox; will fix shortly.

## Parameters
The UI offers a few parameters to modify rendering.

* **Block size** - The size of the squares the image will be divided into, similar to the Mosaic filter in Photoshop.
* **Weight** - Maximum size of the element that will occupy each block, relative to the block size. Value between 0 and 1 recommended.
* **Background color** - Pretty fucking obvious no?
* **Foreground color** - Oh come on.