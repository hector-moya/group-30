# 3815 Tetris Team 30


- pass the config to the game board and next piece to remove the need to inject the config in both components
- I remove the default type in the setPiece just to make it more clear


- create a function that places the piece in the center of the board



Early return technique

   setPiece(piece: Piece, type: string = 'current'): void {
        if (type === 'current') {
            this.piece = piece;
            this.pieceSubject.next(piece);
        } else if (type === 'next') {
            this.nextPiece = piece;
            this.nextPieceSubject.next(piece);
        }
    }
