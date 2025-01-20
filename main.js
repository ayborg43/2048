const GRID_SIZE = 4;
    let grid;
    let score = 0;

    function initializeGame() {
      grid = Array.from({ length: GRID_SIZE }, () => 
        Array(GRID_SIZE).fill(0)
      );
      score = 0;
      updateScore();
      addRandomTile();
      addRandomTile();
      renderGrid();
    }

    function addRandomTile() {
      const emptyCells = [];
      grid.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === 0) emptyCells.push([i, j]);
        });
      });

      if (emptyCells.length > 0) {
        const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    function renderGrid() {
      const gridContainer = document.querySelector('.grid');
      gridContainer.innerHTML = '';
      
      grid.forEach(row => {
        row.forEach(cell => {
          const cellElement = document.createElement('div');
          cellElement.classList.add('cell');
          if (cell !== 0) {
            cellElement.textContent = cell;
            cellElement.style.backgroundColor = getTileColor(cell);
          }
          gridContainer.appendChild(cellElement);
        });
      });
    }

    function getTileColor(value) {
      const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
      };
      return colors[value] || '#3c3a32';
    }

    function updateScore() {
      document.getElementById('score').textContent = score;
    }

    function handleSwipe(direction) {
      let moved = false;
      const oldGrid = JSON.parse(JSON.stringify(grid));

      if (direction === 'left') {
        moved = moveLeft();
      } else if (direction === 'right') {
        moved = moveRight();
      } else if (direction === 'up') {
        moved = moveUp();
      } else if (direction === 'down') {
        moved = moveDown();
      }

      if (moved) {
        addRandomTile();
        renderGrid();
        checkGameOver();
      }
    }

    function moveLeft() {
      let moved = false;
      for (let i = 0; i < GRID_SIZE; i++) {
        const row = grid[i];
        const newRow = slideAndMerge(row);
        if (row.toString() !== newRow.toString()) {
          grid[i] = newRow;
          moved = true;
        }
      }
      return moved;
    }

    function slideAndMerge(row) {
      let newRow = row.filter(x => x !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }
      while (newRow.length < GRID_SIZE) {
        newRow.push(0);
      }
      return newRow;
    }

    function moveRight() {
      let moved = false;
      for (let i = 0; i < GRID_SIZE; i++) {
        const row = grid[i];
        const newRow = slideAndMerge(row.reverse()).reverse();
        if (row.toString() !== newRow.toString()) {
          grid[i] = newRow;
          moved = true;
        }
      }
      return moved;
    }

    function moveUp() {
      let moved = false;
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = grid.map(row => row[j]);
        const newColumn = slideAndMerge(column);
        if (column.toString() !== newColumn.toString()) {
          for (let i = 0; i < GRID_SIZE; i++) {
            grid[i][j] = newColumn[i];
          }
          moved = true;
        }
      }
      return moved;
    }

    function moveDown() {
      let moved = false;
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = grid.map(row => row[j]);
        const newColumn = slideAndMerge(column.reverse()).reverse();
        if (column.toString() !== newColumn.toString()) {
          for (let i = 0; i < GRID_SIZE; i++) {
            grid[i][j] = newColumn[i];
          }
          moved = true;
        }
      }
      return moved;
    }

    function checkGameOver() {
      if (!grid.flat().includes(0) && !canMerge()) {
        setTimeout(() => {
          alert(`Game Over! Your score: ${score}`);
          initializeGame();
        }, 100);
      }
    }

    function canMerge() {
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) {
            return true;
          }
          if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) {
            return true;
          }
        }
      }
      return false;
    }

    // Touch controls
    let touchStartX, touchStartY;

    document.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        handleSwipe(dx > 0 ? 'right' : 'left');
      } else {
        handleSwipe(dy > 0 ? 'down' : 'up');
      }
    });

    // Keyboard controls
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft': handleSwipe('left'); break;
        case 'ArrowRight': handleSwipe('right'); break;
        case 'ArrowUp': handleSwipe('up'); break;
        case 'ArrowDown': handleSwipe('down'); break;
      }
    });

    // Restart button
    document.getElementById('restart').addEventListener('click', initializeGame);

    // Initialize game
    initializeGame();
