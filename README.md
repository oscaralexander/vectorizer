![Vectorizer](http://vectorizer.oscaralexander.com/assets/img/vectorizer.png)

# Vectorizer

Vectorizer turns any bitmap image into a vector image by breaking it up into a grid of squares (blocks), and rendering a vector element to represent the brightness of each square. Higher resolution images yield better results, but take longer to process.

### Parameters
The UI provides a few parameters for rendering.

* **Block size** - The size of the squares the image will be divided into, similar to Photoshop's Mosaic filter.
* **Weight** - Maximum size of the vector element that will occupy each block, relative to the block size. Value between 0 and 1 recommended.
* **Background color** - Pretty fucking obvious, no?
* **Foreground color** - Oh come on.

### Browser support
Tested in Chrome, Safari and Firefox, where Safari proved rougly 300% faster than Chrome, and 1000% faster than Firefox.

### Disclaimer
This tool wasn't designed to be public-facing so please bear with any quirks, rough edges and lack of better documentation. Hope you'll have some fun with it regardless!