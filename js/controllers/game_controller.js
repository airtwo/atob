import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

export default class extends Controller {
  static targets = ["board", "healthBar", "movesLeftBar", "modal", "modalTitle", "modalMessage", "healthDeduction", "movesDeduction"]
  states = { 0: 'blank', 1: 'speeder', 2: 'lava', 3: 'mud' }
  gameOver = false

  connect() {
    this.buildBoard()
    this.setStartingPoint();
    this.setEndingPoint();
    this.setActiveSquare();
    this.setHealth();
    this.setMoves();
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  buildBoard() {
    for (let i = 0; i < 2500; i++) {
      const square = document.createElement('div');
      square.className = 'grid-square';
      square.dataset.id = i
      square.dataset.row = Math.floor(i / 50)
      square.dataset.column = i % 50
      square.dataset.state = this.states[Math.floor(Math.random() * 4)];
      this.boardTarget.appendChild(square);
    }
  }

  setStartingPoint() {
    const firstColumnSquares = Array.from(this.boardTarget.querySelectorAll('[data-column="0"][data-state="blank"]'));
    this.firstColumnSquare = firstColumnSquares[Math.floor(Math.random() * firstColumnSquares.length)];
    this.firstColumnSquare.classList.add('start-square');
  }

  setEndingPoint() {
    const lastColumnSquares = Array.from(this.boardTarget.querySelectorAll('[data-column="49"][data-state="blank"]'));
    this.lastColumnSquare = lastColumnSquares[Math.floor(Math.random() * lastColumnSquares.length)];
    this.lastColumnSquare.classList.add('end-square');
  }

  setActiveSquare() {
    this.firstColumnSquare.dataset.active = true;
    this.firstColumnSquare.classList.add('active-square');
    this.currentSquare = this.firstColumnSquare;
  }

  setHealth() {
    this.maxHealth = 200;
    this.health = this.maxHealth;
    this.healthBarTarget.style.width = `${Math.max(0, (this.health / this.maxHealth) * 100)}%`;
  }

  setMoves() {
    this.movesLeft = 450
    this.movesLeftBarTarget.textContent = this.movesLeft;
  }

  move(e) {
    this.currentSquare.dataset.active = false;
    this.currentSquare.classList.remove('active-square');

    let currentRow = parseInt(this.currentSquare.dataset.row);
    let currentColumn = parseInt(this.currentSquare.dataset.column);

    if (e.key === 'ArrowLeft') {
      if (currentColumn > 0) {
        this.currentSquare = this.currentSquare.previousElementSibling;
      }
    } else if (e.key === 'ArrowRight') {
      if (currentColumn < 49) {
        this.currentSquare = this.currentSquare.nextElementSibling;
      }
    } else if (e.key === 'ArrowUp') {
      if (currentRow > 0) {
        const targetSquare = this.boardTarget.querySelector(`[data-row="${currentRow - 1}"][data-column="${currentColumn}"]`);
        if (targetSquare) {
          this.currentSquare = targetSquare;
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (currentRow < 49) {
        const targetSquare = this.boardTarget.querySelector(`[data-row="${currentRow + 1}"][data-column="${currentColumn}"]`);
        if (targetSquare) {
          this.currentSquare = targetSquare;
        }
      }
    }

    this.currentSquare.dataset.active = true;
    this.currentSquare.classList.add('active-square');
  }

  updateHealth() {
    let deduction = 0;

    switch (this.currentSquare.dataset.state) {
      case 'speeder':
        deduction = 5;
        this.health -= deduction;
        break;
      case 'lava':
        deduction = 50;
        this.health -= deduction;
        break;
      case 'mud':
        deduction = 10;
        this.health -= deduction;
        break;
      default:
        deduction = 0;
        break;
    }

    this.healthBarTarget.style.width = `${Math.max(0, (this.health / this.maxHealth) * 100)}%`;

    if (deduction > 0) {
      this.showHealthDeduction(deduction);
    }
  }

  showHealthDeduction(amount) {
    this.healthDeductionTarget.classList.remove('animate');
    clearTimeout(this.healthDeductionTimeout);

    this.healthDeductionTarget.textContent = `-${amount} health`;

    requestAnimationFrame(() => {
      this.healthDeductionTarget.classList.add('animate');
    });

    this.healthDeductionTimeout = setTimeout(() => {
      this.healthDeductionTarget.classList.remove('animate');
      this.healthDeductionTarget.textContent = '';
    }, 2000);
  }

  showMovesDeduction(amount) {
    this.movesDeductionTarget.classList.remove('animate');
    clearTimeout(this.movesDeductionTimeout);

    const movesText = amount === 1 ? `-${amount} move` : `-${amount} moves`;
    this.movesDeductionTarget.textContent = movesText;

    requestAnimationFrame(() => {
      this.movesDeductionTarget.classList.add('animate');
    });

    this.movesDeductionTimeout = setTimeout(() => {
      this.movesDeductionTarget.classList.remove('animate');
      this.movesDeductionTarget.textContent = '';
    }, 2000);
  }

  updateMoves() {
    let deduction = 0;

    switch (this.currentSquare.dataset.state) {
      case 'speeder':
        deduction = 0;
        console.log("zoom")
        break;
      case 'lava':
        deduction = 10;
        this.movesLeft -= deduction;
        break;
      case 'mud':
        deduction = 5;
        this.movesLeft -= deduction;
        break;
      default:
        deduction = 1;
        this.movesLeft -= deduction;
        break;
    }

    this.movesLeftBarTarget.textContent = this.movesLeft;

    if (deduction > 0) {
      this.showMovesDeduction(deduction);
    }
  }

  checkForDeath() {
    if (this.health <= 0) {
      this.modalTitleTarget.textContent = "Game Over";
      this.modalMessageTarget.textContent = "You've run out of health, and died as a result.";
      this.modalTarget.classList.remove('hidden');
      this.gameOver = true;
    }
    if (this.movesLeft <= 0) {
      this.modalTitleTarget.textContent = "Game Over";
      this.modalMessageTarget.textContent = "You have no moves remaining.";
      this.modalTarget.classList.remove('hidden');
      this.gameOver = true;
    }
  }

  checkForWin() {
    if (this.currentSquare === this.lastColumnSquare) {
      this.modalTitleTarget.textContent = "You won! 🎉";
      this.modalMessageTarget.textContent = "You have traversed the board and successfully reached point B. Congratulations!";
      this.modalTarget.classList.remove('hidden');
      this.gameOver = true;
    }
  }

  handleKeydown(event) {
    if (event.key === 'r') {
      this.restart();
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && !this.gameOver) {
      this.move(event);
      this.updateHealth();
      this.updateMoves();
      this.checkForDeath();
      this.checkForWin();
    }
  }

  restart() {
    window.location.reload();
  }

  disconnect() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
    clearTimeout(this.healthDeductionTimeout);
    clearTimeout(this.movesDeductionTimeout);
  }
} 
