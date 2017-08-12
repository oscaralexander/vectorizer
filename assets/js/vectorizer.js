/**
 * If you're looking to experiment with the rendering style
 * see vectorizer.render() on line 148.
 *
 * Have fun. Break things.
 */

var vectorizer = {
    $canvas: document.getElementById('js-canvas'),
    $input: document.getElementById('js-input'),
    $inputBlockSize: document.getElementById('js-inputBlockSize'),
    $inputColorBg: document.getElementById('js-inputColorBg'),
    $inputColorFg: document.getElementById('js-inputColorFg'),
    $inputExportSvg: document.getElementById('js-inputExportSvg'),
    $inputFile: document.getElementById('js-inputFile'),
    $inputFileInput: document.getElementById('js-inputFileInput'),
    $inputFileName: document.getElementById('js-inputFileName'),
    $inputForm: document.getElementById('js-inputForm'),
    $inputReset: document.getElementById('js-inputReset'),
    $inputStyle: document.getElementById('js-inputStyle'),
    $inputWeight: document.getElementById('js-inputWeight'),
    $output: document.getElementById('js-output'),
    blockSize: null,
    colorBg: null,
    colorFg: null,
    ctx: document.getElementById('js-canvas').getContext('2d'),
    img: null,
    isReady: false,
    svg: null,
    weight: null,

    init: function () {
        if (!SVG.supported) {
            alert('SVG file format not supported by your browser.');
        }

        this.$input.addEventListener('submit', this.onInputSubmit.bind(this));
        this.$inputColorBg.addEventListener('blur', this.onInputColorBgBlur.bind(this));
        this.$inputExportSvg.addEventListener('click', this.onInputExportSvgClick.bind(this));
        this.$inputFileInput.addEventListener('change', this.onInputFileInputChange.bind(this));
        this.$inputReset.addEventListener('click', this.onInputReset.bind(this));
    },

    getBlockDensity: function (data) {
        var count;
        var i;
        var length;
        var rgb;
        var white;

        count = 0;
        rgb = {r: 0, g: 0, b: 0};

        for (i = 0; i < data.length; i += 4) {
            ++count;
            rgb.r += data[i];
            rgb.g += data[i + 1];
            rgb.b += data[i + 2];
        }

        // Get RGB average
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        // Get white value
        white =  ~~((rgb.r + rgb.g + rgb.b) / 3);

        // Return density
        return white / 255;
    },

    onFileReaderLoad: function (e) {
        this.img = new Image();
        this.img.onload = this.onImageLoad.bind(this);
        this.img.src = e.target.result;
    },

    onImageLoad: function (e) {
        this.$canvas.height = this.img.height;
        this.$canvas.width = this.img.width;
        this.ctx.drawImage(this.img, 0, 0);
        this.run();
    },

    onInputColorBgBlur: function (e) {
        document.body.style.backgroundColor = '#' + this.$inputColorBg.value.replace('#', '');
    },

    onInputExportSvgClick: function (e) {
        var file;

        e.preventDefault();

        if (this.isReady) {
            // Use FileSaver.js to download the file
            file = new File([this.svg.svg()], 'vectorizer.svg', {type: 'image/svg+xml;charset=utf-8'});
            saveAs(file);
        }
    },

    onInputFileInputChange: function (e) {
        var file;

        if (!this.$inputFileInput.files.length) {
            return;
        }

        file = this.$inputFileInput.files[0];
        this.$inputFileName.innerHTML = file.name.toLowerCase();
        this.$input.classList.add('has-file');
    },

    onInputReset: function (e) {
        e.preventDefault();

        // Reset UI
        this.$input.classList.remove('has-file');
        this.$input.classList.remove('is-busy');
        this.$input.classList.remove('is-ready');
        this.$inputForm.reset();
        this.$output.innerHTML = '';

        // Reset values
        this.img = null;
        this.svg = null;
    },

    onInputSubmit: function (e) {
        var file;
        var fileReader;

        // Prevent form submit
        e.preventDefault();

        if (!this.$inputFileInput.files.length) {
            alert('No image selected.');
            return false;
        }

        // Read selected file
        file = this.$inputFileInput.files[0];
        fileReader = new FileReader();
        fileReader.onload = this.onFileReaderLoad.bind(this);
        fileReader.readAsDataURL(file);
    },

    render: function (x, y, density) {
        switch (this.$inputStyle.value) {
            case 'dots':
                this.renderDot(x, y, density);
                break;

            case 'lines':
                this.renderLine(x, y, density);
                break;

            case 'squares':
                this.renderSquare(x, y, density);
                break;
        }
    },

    renderDot: function (x, y, density) {
        var diameter;

        diameter = this.weight * density;
        offset = (this.blockSize - diameter) * 0.5;
        this.svg.circle(diameter).fill(this.colorFg).move(x + offset, y + offset);
    },

    renderLine: function (x, y, density) {
        var width;

        width = density * this.weight;

        // Draw line with a minor overlap to avoid rendering gaps
        this.svg.line(-0.5, (this.blockSize + 0.5), (this.blockSize + 0.5), -0.5).move(x, y).stroke({
            color: this.colorFg,
            width: width,
        });
    },

    renderSquare: function (x, y, density) {
        this.svg.rect(this.blockSize, this.blockSize).attr({fill: this.colorFg})
            .move(x, y)
            .transform({rotation: (45 * density)})
            .transform({scale: density + 0.1});
    },

    run: function () {
        var block;
        var blocks;
        var cols;
        var data;
        var density;
        var rows;
        var x;
        var y;

        // Apply settings
        this.colorBg = '#' + this.$inputColorBg.value.replace('#', '');
        this.colorFg = '#' + this.$inputColorFg.value.replace('#', '');
        this.blockSize = Math.abs(parseInt(this.$inputBlockSize.value, 10));
        this.weight = Math.abs(parseInt(this.$inputWeight.value, 10));

        // Calculate grid colums and rows
        cols = Math.floor(this.img.width / this.blockSize);
        rows = Math.floor(this.img.height / this.blockSize);
        block = 0;
        blocks = cols * rows;

        // Update UI
        this.$input.classList.add('is-busy');
        this.$input.classList.remove('is-ready');
        this.isReady = false;

        // Clear old SVG
        this.svg = null;
        this.$output.innerHTML = '';

        // Create new SVG
        this.svg = SVG('js-output').size(cols * this.blockSize, rows * this.blockSize);
        this.svg.rect(cols * this.blockSize, rows * this.blockSize).attr({fill: this.colorBg});

        // Set a small timeout so the UI update gets painted
        setTimeout(function () {
            for (row = 0; row < rows; row++) {
                for (col = 0; col < cols; col++) {
                    x = col * this.blockSize;
                    y = row * this.blockSize;

                    // Get pixel color values for grid block
                    data = this.ctx.getImageData(x, y, this.blockSize, this.blockSize).data;

                    // Calculate grid block color density (between 0 and 1)
                    density = this.getBlockDensity(data);

                    // Render shape for grid bock
                    this.render(x, y, density);

                    // Display progress to console
                    console.log('Processing: ' + Math.round((++block / blocks) * 100) + '%');
                }
            }

            // Update UI
            this.$input.classList.remove('is-busy');
            this.$input.classList.add('is-ready');
            this.isReady = true;
        }.bind(this), 100);
    }
};

vectorizer.init();