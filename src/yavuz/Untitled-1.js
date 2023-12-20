 // let count = {};
        // treeTemp.forEach(function(i) { count[i] = (count[i]||0) + 1;});
        // console.log(count);
        // let idx=-1;
        // let limit=Number.POSITIVE_INFINITY;
        // if (count[Number.POSITIVE_INFINITY]>1) {
        //     while(count[Number.POSITIVE_INFINITY]>0) {
        //         let index=treeTemp.indexOf(Number.POSITIVE_INFINITY);
        //         let t=[...treeCalcFastest[index]];
        //         let dims=this.getDim(t);
        //         let sum;
        //         dims.forEach((s)=>{sum+=s});
        //         if (sum<limit) {
        //             limit=sum;
        //             idx=index;
        //         }
        //         treeTemp[treeTemp.indexOf(Number.POSITIVE_INFINITY)]="CALC";
        //         count={};
        //         treeTemp.forEach(function(i) { count[i] = (count[i]||0) + 1;});
        //     }
        // } else {
        //     idx=treeTemp.indexOf(val)
        // }

        function Yavuz(idx,game,color) {
            this.game=game;
            this.idx=idx;
            this.init();
            this.color=color
            }
            
            Yavuz.prototype = {
                
                init: function () {
                    this.elo=1000;
                    this.depth=2;
                    this.columns=["1","2","3","4","5","6","7","8"]
                    this.rows=["a","b","c","d","e","f","g","h"]
                    this.types=["p","r","n","b","q","k"]
                    this.movetree=Array();
                    this.decisiontree=Array();
                    this.points={}
                    this.pointsGame={};
                    this.actualMoves=[];
                    this.additionPerMove={};
                    this.WINNER=false;
                    this.DRAW=false;
                    this.LOSER=false;
                    this.opponent=this.color=="w"?"b":"w";
                    this.checkScoreBase=Math.random();
                    this.checkScore=this.checkScoreBase;
                    this.checkMateScore=this.checkScore*2;
                    this.additionCheckScore=Math.random();
                    this.types.forEach((type)=>{
                        var cellPoints=[];
                        var valPerMoves=[]
                        for(var s=0;s<8;s++) {
                            var rowPoints=[];
                            var rowMovePoints=[]
                            for (var i=0;i<8;i++) {
                                rowPoints.push(Math.random());
                                rowMovePoints.push(Math.random());
                                }
                            cellPoints.push(rowPoints);
                            valPerMoves.push(rowMovePoints);
                        }
                        this.points[type]=cellPoints;
                        this.additionPerMove[type]=valPerMoves;
                    });
                    this.pointsGame=JSON.parse(JSON.stringify(this.points));
                    // console.log(this.points);
                    // this.pointsGame["b"][0][0]=5.0;
                    // console.log(this.points);
                    this.piecePoints={p:0.1,r:0.5,n:0.3,b:0.3,k:0.0,q:0.9};
                    this.pieceAdditionPerMove={p:Math.random(),r:Math.random(),n:Math.random(),b:Math.random(),k:Math.random(),q:Math.random()};
                    // this.gpu=new GPU();
                },
                // resetPoints: function() {
                //     this.types.forEach((type)=>{
                //         for(row=0;row<8;row++) {
                //             for(col=0;col<8;col++) {
                //                 this.pointsGame[type][row][col]=this.points[type][row][col];
                //             }
                //         }
                //     })
                // },
                calculateBest: function(gm=this.game,color=this.color) {
                    var value=0;
                    var maxGain=-1000000;
                    var bestMove="";
                    gm.moves().forEach((m)=> {
                            var tempGame=new Chess(gm.fen());
                            tempGame.move(m);
                            if (tempGame.turn()==this.opponent) {
                                if (tempGame.in_check()) value=this.checkScore;
                                if (tempGame.in_checkmate()) value=Number.POSITIVE_INFINITY;
                            }
                            if (tempGame.turn()==this.color) {
                                if (tempGame.in_check()) value=-this.checkScore;
                                if (tempGame.in_checkmate()) value=Number.NEGATIVE_INFINITY;
                            }
                            var col=0;
                            this.pointsGame.p.forEach((rowPoints)=>{
                                var row=0;
                                rowPoints.forEach((point)=>{
                                    var piece=tempGame.get(this.rows[row]+this.columns[col]);
                                    if (piece!=null) {
                                        if (piece.color==color) {
                                            value+=this.piecePoints[piece.type]*this.pointsGame[piece.type][row][col];
                                        } else {
                                            value-=this.piecePoints[piece.type]*this.pointsGame[piece.type][row][col];
                                        }
                                    }
                                    row++;
                                });
                                col++;
                            });
                            if (value>maxGain) {
                                maxGain=value;
                                bestMove=m;
                            }
                        }
                    );
                    return {gain:maxGain,move:bestMove};
                },
                calcGain: function(gm=this.game,color=this.color) {
                    // const calc=this.gpu.createKernel(function(gm,color){
                        var value=0;
                        var tempGame=new Chess(gm.fen());
                        if (tempGame.turn()==this.opponent) {
                            if (tempGame.in_check()) value=this.checkScore;
                            if (tempGame.in_checkmate()) value=Number.POSITIVE_INFINITY;   
                        }
                        if (tempGame.turn()==this.color) {
                            if (tempGame.in_check()) value=-this.checkScore;
                            if (tempGame.in_checkmate()) value=Number.NEGATIVE_INFINITY;   
                        }
                        var col=0;
                            this.pointsGame.p.forEach((rowPoints)=>{
                                var row=0;
                                rowPoints.forEach((point)=>{
                                    var piece=tempGame.get(this.rows[row]+this.columns[col]);
                                    if (piece!=null) {
                                        if (piece.color==color) {
                                            value+=this.piecePoints[piece.type]*this.pointsGame[piece.type][row][col];
                                        } else {
                                            value-=this.piecePoints[piece.type]*this.pointsGame[piece.type][row][col];
                                        }
                                    }
                                    row++;
                                });
                                col++;
                                });
                        return value;
                    // }).setOutput([1,1]);
                    // console.log(tis.game.board());
                    // return calc(gm,color);
                },
                getDim:function(a) {
                    var dim = [];
                    for (;;) {
                        dim.push(a.length);
        
                        if (Array.isArray(a[0])) {
                            a = a[0];
                        } else {
                            break;
                        }
                    }
                    return dim;
                },
                selectMove:function() {
                    // let depth=this.depth+1;
                    // let tr=[...this.movetree];
                    // console.log(this.getDim(tr));
                    while(true) {
                        this.reduceMoveTreeMaxMin();
                        let tree=[...this.movetree];
                        if (this.getDim(tree).length==1) break;
                    }
                    let treeTemp=[...this.movetree];
                    // console.log("points length:",treeTemp.length);
                    this.actualMoves=this.game.moves();
                    // console.log("moves length:",this.actualMoves.length);
                    this.actualMoves.forEach((m,idx)=>{
                        if (m.indexOf("+")!=-1) {
                            treeTemp[idx]+=this.checkScore;
                            // this.checkScore*=2;
                            }
                        if (m.indexOf("#")!=-1) treeTemp[idx]=Number.POSITIVE_INFINITY;
                    });
                    // console.log(tree);
                    let val = treeTemp.reduce(function(a, b) {
                        return Math.max(a, b);
                    }, Number.NEGATIVE_INFINITY);
                    // console.log(val);
                    this.movetree=[];
                    return this.actualMoves[treeTemp.indexOf(val)];
                },
                reduceMoveTreeMaxMin: function(depth=this.depth,tree=this.movetree,parent=[this.movetree]) {
                    // if (depth>=0) {
                    // let c=true;
                    let x=[...tree];
                    if (this.getDim(x).length>1) {
                        tree.forEach((item,idx)=>{
                            if (Array.isArray(item)) {
                                let a=[...item];
                                if (this.getDim(a).length>1) {
                                    this.reduceMoveTreeMaxMin(depth-1,item,tree[idx]);
                                } else {
                                    let val;
                                    if (depth%2==1) {
                                        // item.forEach((i,idx)=>{
                                        //     if (!i) item[idx]=Number.NEGATIVE_INFINITY;
                                        // });
                                        val = item.reduce(function(a, b) {
                                            return Math.min(a, b);
                                        }, Number.POSITIVE_INFINITY);
                                    }
                                    if (depth%2==0) {
                                        // item.forEach((i,idx)=>{
                                        //     if (!i) item[idx]=Number.POSITIVE_INFINITY;
                                        // });
                                        val = item.reduce(function(a, b) {
                                            return Math.max(a, b);
                                        }, Number.NEGATIVE_INFINITY);
                                    }
                                    tree[idx]=val;
                                }   
                            }
                            });
                    }
                    // }
                },
                calcMoves: function(depth=this.depth, gm=this.game, tree=this.movetree) {
                    if (depth>=0) {
                        let tempGame=new Chess(gm.fen());
                        // console.log(tempGame.ascii());
                        /**
                         * MINMAX rule 
                         * first layer is max
                         * 
                         */
                            let moves=tempGame.moves();
                            // if (depth==this.depth) this.actualMoves=[...moves];
                            // console.log(moves);
                            // console.log(moves.length);
                            moves.forEach((move,idx)=>{
        
                                let tempGame2=new Chess(gm.fen());
                                // var color=this.color;
                                tempGame2.move(move);
                                // if (tempGame.game_over()) tree[idx]=100000;
                                if (tree.length<idx+1) {
                                    tree.push([]);
                                }
        
                                if (tempGame2.in_checkmate()) {
                                    let item=tree[idx];
                                    for(let i=(this.depth-depth);i<this.depth-1;i++) {
                                        item.push([]);
                                        item=item[0];
                                    }
                                    item=this.calcGain();
                                }
        
                                if (depth==0) {
                                    tree[idx]=this.calcGain(tempGame2);
                                }
                                // this.movetree.push(tree);
                                // console.log(this.movetree);
                                this.calcMoves(depth-1,tempGame2,tree[idx]);
                                // if (tempGame.in_checkmate()) {
                                //     gain=100000;
                                //     gains.push(gain);
                                //     // break;
                                // }
                                // return this.movetree;
                            });
                    }
                },
                makeMove: function() {
                    if (this.game.in_checkmate()&&this.game.turn()==this.color) {
                        this.WINNER=false;
                        this.LOSER=true;
                        if (this.color=="w") {
                            ais[this.game.plb].WINNER=true;
                            console.log("WINNER:",this.game.plb,"GAME:",games.indexOf(this.game));
                            document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>BLACK WINS</b>";
                        }
                        if (this.color=="b") {
                            ais[this.game.plw].WINNER=true;
                            console.log("WINNER:",this.game.plw,"GAME:",games.indexOf(this.game));
                            document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                        }
                        console.log("LOSER:",this.idx,"GAME:",games.indexOf(this.game));
                        fin[games.indexOf(this.game)]=true;
                        // if (this.game.game_over()) {
                        clearInterval(this.game.thread);
                        return;
                        // }
                    } else if (this.game.in_checkmate()&&this.game.turn()==this.opponent) {
                        this.WINNER=true;
                        this.LOSER=false;
                        if (this.color=="w") {
                            ais[this.game.plb].LOSER=true;
                            document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                        }
                        if (this.color=="b") {
                            ais[this.game.plw].LOSER=true;
                            document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>BLACK WINS</b>";
                        }
                        console.log("WINNER:",this.idx,"GAME:",games.indexOf(this.game));
                        // document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                        fin[games.indexOf(this.game)]=true;
                        clearInterval(this.game.thread);
                        return;
        
                    } else if (this.game.in_draw()||this.game.in_stalemate()||this.game.in_threefold_repetition()) {
                        this.WINNER=false;
                        this.LOSER=false;
                        this.DRAW=true;
                        if (this.color=="w") {
                            ais[this.game.plb].DRAW=true;
                        }
                        if (this.color=="b") {
                            ais[this.game.plw].DRAW=true;
                        }
                        console.log("DRAWN:",this.idx,"GAME:",games.indexOf(this.game));
                        document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>DRAW</b>";
                        fin[games.indexOf(this.game)]=true;
                        clearInterval(this.game.thread);
                        return;
        
                    } else if (!this.game.game_over()&&this.game.turn()==this.color) {
                        this.calcMoves();
                        // console.log(this.movetree);
                        let m=this.selectMove();
                        // console.log(this.movetree);
                        if (m==undefined) {
                            this.DRAW=true;
                            if (this.color=="w") {
                                ais[this.game.plb].DRAW=true;
                            }
                            if (this.color=="b") {
                                ais[this.game.plw].DRAW=true;
                            }
                            fin[games.indexOf(this.game)]=true;
                            clearInterval(this.game.thread);
                            console.log("GAME ERROR:",games.indexOf(this.game),"PLAYER:",this.idx);
                            document.getElementById("info"+games.indexOf(this.game)).innerHTML="ERROR";
                        } else {
                            console.log(m);
                            if (m.indexOf("+")!=-1) this.checkScore*=2;
                            this.game.move(m);
                            this.types.forEach((type) => {
                                for (var row=0;row<8;row++) {
                                    for(var col=0;col<8;col++) {
                                        this.pointsGame[type][row][col]+=this.additionPerMove[type][row][col];
                                    }
                                } 
                                this.piecePoints[type]+=this.pieceAdditionPerMove[type];
                                this.checkScore+=this.checkScoreBase;
                            });
                        }
                    }
                }
                }