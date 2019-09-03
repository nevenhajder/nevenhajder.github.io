"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MarbleMachine =
    /*#__PURE__*/
    function () {
        function MarbleMachine() {
            var _this = this;

            _classCallCheck(this, MarbleMachine);

            _defineProperty(this, "getMarbles", function (sequence) {
                var permutation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

                if (permutation.length) {
                    _this.marbleSequences.push(_toConsumableArray(permutation));
                }

                if (!sequence) return;

                for (var i = 0; i < sequence.length; i++) {
                    permutation.push(sequence[i]);

                    var shorterSequence = _toConsumableArray(sequence);

                    shorterSequence.splice(i, 1);

                    _this.getMarbles(shorterSequence, permutation);

                    permutation.pop();
                }
            });

            _defineProperty(this, "generateMarbles", function () {
                var numColors = _this.numField.value;
                numColors = _this.numField.value;

                if (numColors > 0 && numColors < 6) {
                    _this.numField.classList.remove('error');

                    _this.errorMessage.classList.remove('visible');

                    _this.marbleSequences = [];

                    _this.getMarbles(_this.COLORS.slice(0, numColors));

                    _this.displayMarbles(_this.marbleSequences);

                    _this.displayResult(_this.marbleSequences.length);
                } else {
                    _this.numField.classList.add('error');

                    _this.errorMessage.classList.add('visible');

                    _this.resultMessage.style.display = 'none';
                }
            });

            _defineProperty(this, "displayMarbles", function (marblesArray) {
                var allMarbles = '';
                marblesArray.forEach(function (row) {
                    var marbleRow = '<div class="c-marbles__row">';
                    row.forEach(function (color) {
                        return marbleRow += "<div class=\"c-marble ".concat(color, "\"></div>");
                    });
                    marbleRow += '</div>';
                    allMarbles += marbleRow;
                });
                _this.marbleContainer.innerHTML = allMarbles;

                _this.setOrientation();
            });

            this.COLORS = ['blue', 'green', 'red', 'yellow', 'purple'];
            this.marbleSequences = [];
            this.slider = document.querySelector('.js-sizeSlider');
            this.numField = document.querySelector('.js-numColors');
            this.config = document.querySelector('.js-config');
            this.configToggle = document.querySelector('.js-configToggle');
            this.configDrawer = document.querySelector('.js-configDrawer');
            this.btnGenerate = document.querySelector('.js-generate');
            this.errorMessage = document.querySelector('.js-errorMessage');
            this.resultMessage = document.querySelector('.js-resultMessage');
            this.marbleContainer = document.querySelector('.js-marbleContainer');
            this.marbleStyle = document.querySelector('.js-marbleStyle');
            this.displayOrientation = document.querySelector('.js-displayOrientation');
            this.currentOrientation = 'row';
            this.numField.addEventListener('keyup', function (e) {
                if (e.keyCode === 13) {
                    _this.generateMarbles();
                }
            });
            this.btnGenerate.addEventListener('click', function () {
                return _this.generateMarbles();
            });
            this.configToggle.addEventListener('click', function () {
                return _this.toggleConfig();
            });
            this.slider.addEventListener('change', function (e) {
                return _this.updateMarbleSize(e);
            });
            this.marbleStyle.addEventListener('change', function (e) {
                return _this.updateMarbleStyle(e);
            });
            this.displayOrientation.addEventListener('change', function (e) {
                return _this.updateOrientation(e);
            }); // Sticky Config

            window.addEventListener('scroll', function (e) {
                return _this.makeSticky(e);
            });
        }

        _createClass(MarbleMachine, [{
            key: "displayResult",
            value: function displayResult(numResults) {
                this.resultMessage.style.display = 'block';
                this.resultMessage.innerText = "Generated ".concat(numResults, " sequence").concat(numResults > 1 ? 's' : '', ".");
            }
        }, {
            key: "toggleConfig",
            value: function toggleConfig() {
                this.configToggle.classList.toggle('open');
                this.configDrawer.classList.toggle('open');
            }
        }, {
            key: "updateMarbleStyle",
            value: function updateMarbleStyle(e) {
                if (e.target.value == 'outline') {
                    this.marbleContainer.classList.add('outline');
                } else {
                    this.marbleContainer.classList.remove('outline');
                }
            }
        }, {
            key: "updateMarbleSize",
            value: function updateMarbleSize(e) {
                this.marbleContainer.classList.remove('twenty');
                this.marbleContainer.classList.remove('forty');
                this.marbleContainer.classList.remove('sixty');
                var size = 'forty';

                switch (e.target.value) {
                    case '20':
                        size = 'twenty';
                        break;

                    case '40':
                        size = 'forty';
                        break;

                    case '60':
                        size = 'sixty';
                        break;
                }

                this.marbleContainer.classList.add(size);
            }
        }, {
            key: "getOrientation",
            value: function getOrientation(e) {
                this.currentOrientation = e.target.value;
            }
        }, {
            key: "setOrientation",
            value: function setOrientation() {
                if (this.currentOrientation == 'column') {
                    this.marbleContainer.classList.remove('row');
                    this.marbleContainer.classList.add('column');
                } else {
                    this.marbleContainer.classList.add('row');
                    this.marbleContainer.classList.remove('column');
                }
            }
        }, {
            key: "updateOrientation",
            value: function updateOrientation(e) {
                this.getOrientation(e);
                this.setOrientation();
            }
        }, {
            key: "makeSticky",
            value: function makeSticky(e) {
                var _this2 = this;

                var fromTop = this.marbleContainer.getBoundingClientRect().top;

                if (fromTop < -20) {
                    this.config.classList.add('sticky');
                    setTimeout(function () {
                        _this2.config.style.transition = 'all 0.25s ease';
                        _this2.config.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    this.config.style.transition = '';
                    this.config.style.transform = '';
                    this.config.classList.remove('sticky');
                }
            }
        }]);

        return MarbleMachine;
    }();

var marbleMachine = new MarbleMachine();