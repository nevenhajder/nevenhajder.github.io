class MarbleMachine {
    constructor() {
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

        this.numField.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                this.generateMarbles();
            }
        });

        this.btnGenerate.addEventListener('click', () => this.generateMarbles());
        this.configToggle.addEventListener('click', () => this.toggleConfig());
        this.slider.addEventListener('change', (e) => this.updateMarbleSize(e));
        this.marbleStyle.addEventListener('change', (e) => this.updateMarbleStyle(e));
        this.displayOrientation.addEventListener('change', (e) => this.updateOrientation(e));

        // Sticky Config
        window.addEventListener('scroll', (e) => this.makeSticky(e));
    }

    getMarbles = (sequence, permutation = []) => {
        if (permutation.length) {
            this.marbleSequences.push([...permutation]);
        }

        if (!sequence) return;

        for (let i = 0; i < sequence.length; i++) {
            permutation.push(sequence[i]);
            let shorterSequence = [...sequence];
            shorterSequence.splice(i, 1);

            this.getMarbles(shorterSequence, permutation);
            permutation.pop();
        }
    }

    generateMarbles = () => {
        let numColors = this.numField.value;
        numColors = this.numField.value;

        if (numColors > 0 && numColors < 6) {
            this.numField.classList.remove('error');
            this.errorMessage.classList.remove('visible');
            this.marbleSequences = [];
            this.getMarbles(this.COLORS.slice(0, numColors));
            this.displayMarbles(this.marbleSequences);
            this.displayResult(this.marbleSequences.length);
        } else {
            this.numField.classList.add('error');
            this.errorMessage.classList.add('visible');
            this.resultMessage.style.display = 'none';
        }
    };

    displayMarbles = (marblesArray) => {
        let allMarbles = '';

        marblesArray.forEach(row => {
            let marbleRow = '<div class="c-marbles__row">';
            row.forEach(color => (marbleRow += `<div class="c-marble ${color}"></div>`));
            marbleRow += '</div>';
            allMarbles += marbleRow;
        });

        this.marbleContainer.innerHTML = allMarbles;
        this.setOrientation();
    }

    displayResult(numResults) {
        this.resultMessage.style.display = 'block';
        this.resultMessage.innerText = `Generated ${numResults} sequence${numResults > 1 ? 's' : ''}.`;
    }

    toggleConfig() {
        this.configToggle.classList.toggle('open');
        this.configDrawer.classList.toggle('open');
    }

    updateMarbleStyle(e) {
        if (e.target.value == 'outline') {
            this.marbleContainer.classList.add('outline');
        } else {
            this.marbleContainer.classList.remove('outline');
        }
    }

    updateMarbleSize(e) {
        this.marbleContainer.classList.remove('twenty');
        this.marbleContainer.classList.remove('forty');
        this.marbleContainer.classList.remove('sixty');

        let size = 'forty';
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

    getOrientation(e) {
        this.currentOrientation = e.target.value;
    }

    setOrientation() {
        if (this.currentOrientation == 'column') {
            this.marbleContainer.classList.remove('row');
            this.marbleContainer.classList.add('column');
        } else {
            this.marbleContainer.classList.add('row');
            this.marbleContainer.classList.remove('column');
        }
    }

    updateOrientation(e) {
        this.getOrientation(e);
        this.setOrientation();
    }

    makeSticky(e) {
        const fromTop = this.marbleContainer.getBoundingClientRect().top;
        if (fromTop < -20) {
            this.config.classList.add('sticky');
            setTimeout(() => {
                this.config.style.transition = 'all 0.25s ease';
                this.config.style.transform = 'translateY(0)';
            }, 10);
        } else {
            this.config.style.transition = '';
            this.config.style.transform = '';
            this.config.classList.remove('sticky');
        }
    }
}

const marbleMachine = new MarbleMachine();