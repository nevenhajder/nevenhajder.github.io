export class Abacus {
    rows;
    rowDivs;
    MIN_COUNT;
    MAX_COUNT;
    container; // querySelector could return `null` if the element is not found
    numberInput;
    moveDistance;
    constructor(containerId) {
        this.rows = [1, 10, 100, 1000, 10000];
        this.rowDivs = [];
        this.MIN_COUNT = 0;
        this.MAX_COUNT = 111110;
        const containerElement = document.querySelector(containerId);
        if (containerElement) {
            this.container = containerElement;
        }
        else {
            throw new Error(`Element not found using the selector: ${containerId}`);
        }
    }
    createAbacus() {
        const leftSupport = document.createElement('div');
        leftSupport.className = 'support-left';
        this.container.appendChild(leftSupport);
        const rowsDescending = this.rows.sort((a, b) => (a < b ? 1 : -1));
        rowsDescending.forEach((value) => {
            const row = document.createElement('div');
            row.className = `row${value}`;
            this.rowDivs.push(row);
            for (let i = 0; i < 10; i++) {
                const bead = document.createElement('button');
                bead.type = 'button';
                bead.className = 'bead';
                row.appendChild(bead);
            }
            this.container.append(row);
        });
        const rightSupport = document.createElement('div');
        rightSupport.className = 'support-right';
        this.container.appendChild(rightSupport);
    }
    createNumberInput() {
        const form = document.createElement('form');
        form.className = 'display-wrap';
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group input-group-lg';
        const leftButtonWrapper = document.createElement('span');
        leftButtonWrapper.className = 'input-group-btn';
        const leftButton = document.createElement('button');
        leftButton.id = 'lessBtn';
        leftButton.type = 'button';
        leftButton.className = 'btn btn-danger';
        leftButton.textContent = '-';
        leftButtonWrapper.appendChild(leftButton);
        const numberInput = document.createElement('input');
        numberInput.min = String(this.MIN_COUNT);
        numberInput.max = String(this.MAX_COUNT);
        numberInput.type = 'number';
        numberInput.value = '0';
        numberInput.className = 'form-control numDisplay';
        numberInput.autocomplete = 'off';
        this.numberInput = numberInput;
        const rightButtonWrapper = document.createElement('span');
        rightButtonWrapper.className = 'input-group-btn';
        const rightButton = document.createElement('button');
        rightButton.id = 'moreBtn';
        rightButton.type = 'button';
        rightButton.className = 'btn btn-success';
        rightButton.textContent = '+';
        rightButtonWrapper.appendChild(rightButton);
        // Assemble all the pieces and append them to the container
        inputGroup.appendChild(leftButtonWrapper);
        inputGroup.appendChild(numberInput);
        inputGroup.appendChild(rightButtonWrapper);
        formGroup.appendChild(inputGroup);
        form.appendChild(formGroup);
        this.container.appendChild(form);
    }
    bindEventHandlers() {
        // Use the Event Delegation pattern to handle bead clicks
        // https://javascript.info/event-delegation
        this.rowDivs.forEach((row) => {
            row.addEventListener('click', (evt) => {
                const target = evt.target;
                const isBead = target.classList.contains('bead');
                if (!isBead)
                    return;
                this.handleBeadClick(target);
            });
        });
        // Form
        this.container.querySelector('form')?.addEventListener('submit', (evt) => evt.preventDefault());
        // Decrement and Incrememnt buttons
        this.container.querySelector('#lessBtn')?.addEventListener('click', this.handleNumberButtonClick.bind(this, -1));
        this.container.querySelector('#moreBtn')?.addEventListener('click', this.handleNumberButtonClick.bind(this, 1));
        // Number Input
        this.numberInput.addEventListener('input', this.handleNumberInputChange.bind(this));
    }
    handleNumberButtonClick(changeValue) {
        const currentValue = parseInt(this.numberInput.value);
        // Decrement logic
        if (changeValue < 0 && currentValue > this.MIN_COUNT) {
            this.numberInput.value = `${currentValue + changeValue}`;
            this.updateAbacus();
        }
        // Increment logic
        if (changeValue > 0 && currentValue < this.MAX_COUNT) {
            this.numberInput.value = `${currentValue + changeValue}`;
            this.updateAbacus();
        }
    }
    handleNumberInputChange(evt) {
        evt.preventDefault();
        const numberInput = evt.target;
        const newValue = parseInt(numberInput.value);
        // If the value is empty or less than 0
        if (isNaN(newValue) || newValue < this.MIN_COUNT) {
            this.numberInput.value = '0';
        }
        if (newValue > this.MAX_COUNT) {
            this.numberInput.value = String(this.MAX_COUNT);
        }
        this.updateAbacus();
    }
    handleBeadClick(clickedBead) {
        /* Check if the bead has the class 'counted' */
        const isCounted = function (bead) {
            return bead.classList.contains('counted');
        };
        const recursivelyAdjustBeads = (bead) => {
            const nextSibling = bead.nextElementSibling;
            const previousSibling = bead.previousElementSibling;
            /* Move the specified bead */
            this.moveBead(bead);
            // Is the bead already counted or not?
            if (isCounted(bead)) {
                bead.classList.remove('counted');
                // Is there a preceding bead and is it counted?
                if (previousSibling && isCounted(previousSibling)) {
                    recursivelyAdjustBeads(previousSibling);
                }
            }
            else {
                bead.classList.add('counted');
                // Is there a following bead and is it NOT counted?
                if (nextSibling && !isCounted(nextSibling)) {
                    recursivelyAdjustBeads(nextSibling);
                }
            }
        };
        recursivelyAdjustBeads(clickedBead);
        this.updateNumberInput();
    }
    getMoveDistance() {
        let beadWidth;
        const RIGHT_MARGIN = 2;
        const BEADS_PER_ROW = 10;
        const bead = this.container.querySelector('.bead');
        const abacusWidth = this.container.offsetWidth;
        if (!bead) {
            throw new Error(`Element not found using the selector: .bead`);
        }
        beadWidth = bead.offsetWidth;
        this.moveDistance =
            abacusWidth - (beadWidth + RIGHT_MARGIN) * BEADS_PER_ROW;
    }
    moveBead(bead) {
        var dist = this.moveDistance;
        if (bead.classList.contains('counted')) {
            bead.style['transform'] = 'translateX(' + 0 + 'px)';
        }
        else {
            bead.style['transform'] = 'translateX(' + dist + 'px)';
        }
    }
    updateAbacus() {
        let total = parseInt(this.numberInput.value);
        const rowsDescending = this.rows.sort((a, b) => a < b ? 1 : -1);
        /* Do work on each row of the abacus */
        rowsDescending.forEach((rowGroup) => {
            let beadsToCount = Math.floor(total / rowGroup);
            /* In the special case that there are more than 10 beads only count 10 */
            if (beadsToCount > 10) {
                beadsToCount = 10;
            }
            const rowBeads = this.container.querySelector(`.row${rowGroup}`)?.querySelectorAll('button.bead');
            if (!rowBeads) {
                throw new Error('Element not found using the selector: button.bead');
            }
            /* If there are any beads to count in this row */
            if (beadsToCount > 0) {
                /* Move and apply the class 'counted' to the appropriate beads */
                for (var i = 1; i <= beadsToCount; i++) {
                    /* If the bead is not counted, move it and add the class .counted */
                    if (!rowBeads[rowBeads.length - i].classList.contains('counted')) {
                        this.moveBead(rowBeads[rowBeads.length - i]);
                        rowBeads[rowBeads.length - i].classList.add('counted');
                    }
                }
                /* Update total for the next time through */
                total = total - beadsToCount * rowGroup;
            }
            /* Reset the position and class for the rest of the beads */
            for (var i = beadsToCount; i < rowBeads.length; i++) {
                if (rowBeads[rowBeads.length - 1 - i].classList.contains('counted')) {
                    this.moveBead(rowBeads[rowBeads.length - 1 - i]);
                    rowBeads[rowBeads.length - 1 - i].classList.remove('counted');
                }
            }
        });
    }
    updateNumberInput() {
        let total = 0;
        this.rows.forEach((rowNumber) => {
            const countedBeads = this.container.querySelector(`.row${rowNumber}`)?.querySelectorAll('button.counted');
            total = total + (countedBeads?.length ?? 0) * rowNumber;
        });
        this.numberInput.value = `${total}`;
    }
    setup() {
        this.createAbacus();
        this.createNumberInput();
        this.getMoveDistance();
    }
    init() {
        this.setup();
        this.bindEventHandlers();
    }
}
