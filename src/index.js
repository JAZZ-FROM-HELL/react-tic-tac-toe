import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
      <button className={"square"} onClick={props.onClick}>
          {props.value}
      </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let i = 0;
        let rows = [];
        for (let row=0; row<3; row++) {
            let cols = [];
            for (let col=0; col<3; col++) {
                cols.push(this.renderSquare(i++));
            }
            rows.push(<div key={row} className="board-row">{cols}</div>);
        }
        return <div>{rows}</div>;
    }
}

class Game extends React.Component {
    static INIT_STATE = {
        history: [{
            squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true,
    };

    constructor(props) {
        super(props);
        this.state = Game.INIT_STATE;
    }

    clear() {
        console.log('Clear');
        this.setState(Game.INIT_STATE);
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i] || calculateWinner(squares)) return;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
           const desc = move ?
            'Go to move #' + move :
            'Go to game start';
           return (
               <li key={move}>
                   <button onClick={() => this.jumpTo(move)}>{desc}</button>
               </li>
           )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div style={{paddingBottom: 15 + 'px'}}>
                    <button onClick={() => this.clear()}>Clear</button>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}