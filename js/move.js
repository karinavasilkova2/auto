
function RunningLine(selector, options) {
    this.container = document.querySelector(selector);
    this._iterations = 0;
    this._delta = 10;
    this.direction = options.direction || 'left';
    this.iterations = options.iterations || 'infinite';
    this.speed = options.speed || 'average';
    if (!this.container) {
        console.log('Container not found `' + selector + '`');
        return false;
    }
    if (['left', 'right'].indexOf(this.direction) === -1) {
        console.log('Direction `' + this.direction + '` is not supported');
        return false;
    }
    if (['slow', 'average', 'fast'].indexOf(this.speed) === -1) {
        console.log('Direction `' + this.direction + '` is not supported');
        return false;
    }
    this.init();
    this.run();
}

/**
 * Init containers
 */
RunningLine.prototype.init = function() {
    var content = this.container.innerHTML;
    this.container.innerHTML = [
        '<div class="running-line__inner">',
        content,
        '</div>'
    ].join('');
    this.innerContainer = this.container.querySelector('.running-line__inner');
    var self = this;
    this.container.classList.forEach(function(item) {
        if (item === 'running-line--hidden') {
            self.innerContainer.style.display = 'block';
            self.innerContainer.style[self._getProperty()] = self._getStartingPosition() + 'px';
        }
    });
};

/**
 * Run line
 */
RunningLine.prototype.run = function() {
    var self = this;
    var interval = this._getSpeedParams().interval;
    this._interval = setInterval(function() {
        self._changePosition();
        if (self.iterations !== 'infinite' && self._iterations >= self.iterations) {
            self.stop();
        }
    }, interval);
};

/**
 * Stop line running
 */
RunningLine.prototype.stop = function() {
    clearInterval(this._interval);
}

/**
 * Change running line position
 */
RunningLine.prototype._changePosition = function() {
    var change = this._getSpeedParams().change;
    var position = this._getPosition();
    switch (this.direction) {
        case 'left':
            change = -1 * change;
        break;

    }
    if (this._hasReachedScreenEnd(position)) {
        this.innerContainer.style[this._getProperty()] = this._getStartingPosition() + 'px';
        this._iterations += 1;
    } else {
        this.innerContainer.style[this._getProperty()] = (position + change) + 'px';
    }
};

/**
 * Check if line has reached screen end
 * 
 * @returns {Boolean}
 */
RunningLine.prototype._hasReachedScreenEnd = function(position) {
    position = position || this._getPosition();
    var reachedEnd = false;
    switch (this.direction) {
        case 'right':
            return (position > 0 && position > this.container.clientWidth + this._delta);
        case 'left':
            return (position < 0 && Math.abs(position) > this._getInnerContainerSize() + this._delta);
    }
    return reachedEnd;
};

/**
 * Get speed params
 * 
 * @returns {Object}
 */
RunningLine.prototype._getSpeedParams = function() {
    switch (this.speed) {
        case 'slow':
            return {
                interval: 4,
                change: 0.1
            }
        case 'average':
            return {
                interval: 3,
                change: 0.25
            }
        case 'fast':
            return {
                interval: 2,
                change: 0.5
            }
        break;
    }
}

/**
 * Get style property for inner container
 * 
 * @returns {String}
 */
RunningLine.prototype._getProperty = function() {
    switch (this.direction) {
        case 'left':
        case 'right':
            return 'marginLeft';
    }
};

/**
 * Get current line position
 * 
 * @returns {Number}
 */
RunningLine.prototype._getPosition = function() {
    return parseFloat(this.innerContainer.style[this._getProperty()].replace(/px$/, ''), 10) || 0;
};

/**
 * Get starting position of line
 * 
 * @returns {Number}
 */
RunningLine.prototype._getStartingPosition = function() {
    switch (this.direction) {
        case 'left':
            return this.container.clientWidth + this._delta;
        case 'right':
            return -this._getInnerContainerSize() - this._delta;
    }
};

/**
 * Get inner container size
 * 
 * @returns {Number}
 */
RunningLine.prototype._getInnerContainerSize = function() {
    if (!this._innerContainerSize) {
        this._innerContainerSize = getTextWidth(
            this.innerContainer.innerText,
            window.getComputedStyle(this.innerContainer).getPropertyValue('font')
        );
    }
    return this._innerContainerSize;
};


/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}


var line = new RunningLine('#marquee', {
  direction: 'right',
  speed: 'fast',
  iterations: 'infinite'
});