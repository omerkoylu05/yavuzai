import {Chessboard,COLOR} from "../cm-chessboard/Chessboard.js";
// import * as $  from "../../node_modules/jquery/dist/jquery.min.js";

var games=[];
var boards=[];
var ais=[]
var gp;
let fin=[];
let datasSent=[];
for (let i=0;i<size;i++) fin.push(false);
for (let i=0;i<size;i++) datasSent.push(false);
let tourCount=Math.floor(Math.log2(40))+1;
var size=20;
let MEMORY={};
document.addEventListener('readystatechange', event => { 

    // When HTML/DOM elements are ready:
    // if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
    //     alert("hi 1");
    // }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    // if (event.target.readyState === "complete") {
    //     let table=document.createElement("table");
    //     let tr;
    //     for(var i=0; i<size;i++) {
    //         if (i%5==0) {
    //             tr=document.createElement("tr");
    //             table.appendChild(tr);
    //         }
    //         let td=document.createElement("td");
    //         var boardContainer=document.createElement("div");
    //         var info=document.createElement("div");
    //         info.setAttribute("id","info"+i.toString());
    //         info.innerHTML="Game:"+(i+1).toString();
    //         boardContainer.appendChild(info);
    //         var board=document.createElement("div");
    //         board.setAttribute("id","board"+i.toString());
    //         board.setAttribute("class","board");
    //         boardContainer.appendChild(board);
    //         td.appendChild(boardContainer);
    //         tr.appendChild(td);
    //         const chess = new Chess()
    //         games.push(chess);
    //     }
    //     document.body.appendChild(table);
    // }
    // for(var i=0;i <size;i++) {
    //     const board = new Chessboard(document.getElementById("board"+i.toString()), {
    //     position: games[i].fen(),
    //     sprite: {url: "../assets/images/chessboard-sprite-staunty.svg"},
    //     style: {moveFromMarker: undefined, moveToMarker: undefined}, // disable standard markers
    //     orientation: COLOR.white
    //     })
    //     // board.enableMoveInput(inputHandler, COLOR.white);
    //     boards.push(board);
    // }
    // let compinit1=false;
    // let compinit2=false;
    // let compinitMem=false;
    // games.forEach((game,idx)=>{
    //     var plw=new Yavuz(idx*2,game,"w");
    //     ais.push(plw);
    //     $.ajax({
    //         type: "GET",
    //         url: "./BackupYavuz/"+(idx*2).toString()+".txt",
    //         dataType: "html",
    //         success: function (response,err) {
    //             let elo=response.substr(4,response.indexOf("\n")-4);
    //             response=response.substr(response.indexOf("POINTS"),response.length);
    //             let points=response.substr(7,response.indexOf("\n")-7);
    //             response=response.substr(response.indexOf("ADDITIONPERMOVE"),response.length);
    //             let addPerMove=response.substr(16,response.indexOf("\n")-16);
    //             response=response.substr(response.indexOf("ADDITONPIECE"),response.length);
    //             let addPiecePerMove=response.substr(13,response.indexOf("\n")-13);
    //             response=response.substr(response.indexOf("CHECKSCORE"),response.length);
    //             let checkScore=response.substr(11,response.indexOf("\n")-11);
    //             plw.elo=parseInt(elo);
    //             plw.points=JSON.parse(points);
    //             plw.pointsGame=JSON.parse(JSON.stringify(plw.points));
    //             plw.additionPerMove=JSON.parse(addPerMove);
    //             plw.pieceAdditionPerMove={p:0.1,r:0.5,n:0.3,b:0.3,k:0.0,q:0.9};
    //             // plw.pieceAdditionPerMove=JSON.parse(addPiecePerMove);
    //             // console.log(plw.pieceAdditionPerMove["b"]);
    //             plw.checkScoreBase=parseFloat(checkScore);
    //             plw.checkScore=parseFloat(checkScore);
    //             // console.log(addPerMove);
    //             compinit1=true;
    //         },
    //         error:function (err) {
                
    //         }
    //     });  
        // var plb=new Yavuz((idx*2)+1,game,"b");
        // ais.push(plb);
        // $.ajax({
        //     type: "GET",
        //     url: "./BackupYavuz/"+((idx*2)+1).toString()+".txt",
        //     dataType: "html",
        //     success: function (response,err) {
        //         let elo=response.substr(4,response.indexOf("\n")-4);
        //         response=response.substr(response.indexOf("POINTS"),response.length);
        //         let points=response.substr(7,response.indexOf("\n")-7);
        //         response=response.substr(response.indexOf("ADDITIONPERMOVE"),response.length);
        //         let addPerMove=response.substr(16,response.indexOf("\n")-16);
        //         response=response.substr(response.indexOf("ADDITONPIECE"),response.length);
        //         let addPiecePerMove=response.substr(13,response.indexOf("\n")-13);
        //         response=response.substr(response.indexOf("CHECKSCORE"),response.length);
        //         let checkScore=response.substr(11,response.indexOf("\n")-11);
        //         plb.elo=parseInt(elo);
        //         plb.points=JSON.parse(points);
        //         plb.pointsGame=JSON.parse(JSON.stringify(plb.points));
        //         plb.additionPerMove=JSON.parse(addPerMove);
        //         // plb.pieceAdditionPerMove=JSON.parse(addPiecePerMove);
        //         plb.pieceAdditionPerMove={p:0.1,r:0.5,n:0.3,b:0.3,k:0.0,q:0.9};
        //         plb.checkScoreBase=parseFloat(checkScore);
        //         plb.checkScore=parseFloat(checkScore);
        //         // console.log(checkScore);
        //         compinit2=true;
        //     },
        //     error:function (err) {
                
        //     }
        // });
        $.ajax({
            type:"GET",
            url:"./memory/memory.json",
            dataType:"json",
            success:function (response,err) { 
                MEMORY=response;
                // console.log(MEMORY);

                // yavuz.makeMove();
                // board.setPosition(chess.fen());
                // compinitMem=true;
                }
            });
        // game.plw=ais.indexOf(plw);
        // game.plb=ais.indexOf(plb);
    });

    // ais.forEach((ai)=>{
    //     let vals={
    //         id:ai.idx,
    //         points:JSON.stringify(ai.points),
    //         additionPerMove:JSON.stringify(ai.additionPerMove),
    //         checkScore:ai.checkScore,
    //         elo:ai.elo
    //     };
    //     $.ajax({
    //         type: "POST",
    //         url: "./saveAi.php",
    //         data: vals,
    //         dataType: "json",
    //         success: function (response) {
    //             console.log(response);
    //         }
    //     });
    // });
    // let update=setInterval(()=>{
    //     let finishedCount=0;
    //     games.forEach((game)=>{
    //         if (game.game_over()) finishedCount++; 
    //     });
    //     document.getElementById("playing").innerHTML=finishedCount.toString()+"/"+games.length.toString();
    // },10000);
    // let init=setInterval(()=>{
    //     if (compinit2&&compinit1&&compinitMem) {
    //         let best=0;
    //         let worst=Number.POSITIVE_INFINITY;
    //         ais.forEach((ai)=>{
    //             if (ai.elo>best) best=ai.elo;
    //             if (ai.elo<worst) worst=ai.elo;
    //         });
    //         document.getElementById("belo").innerHTML=best.toString();
    //         document.getElementById("welo").innerHTML=worst.toString();
    //         clearInterval(init);
    //     }
    // },100)
//     var threads=[];
//     gp=new gameProcedures();
    
// });

function AiProcedures(yzler) {
    this.ais=ais;
    this.mutateIds=[];
    this.crossoverIds=[];
    this.fitnesses=[];
    this.best=0;
    this.worst=0;
    this.tour=0;
    this.gameCount=0;
}

AiProcedures.prototype = {
    
    sigmoid:function (t) {
        return 1/(1+Math.pow(Math.E, -t));
    },

    inverseSigmoid: function (t) {
        return Math.log(t/(1-t));
    },

    calculateNewPoints: function() {
        this.tour++;
        this.gameCount+=size;
        games.forEach((game)=>{
            let p1=1/(1+Math.pow(10,((this.ais[game.plw].elo-this.ais[game.plb].elo)/400)))
            let p2=1-p1;
            if (this.ais[game.plw].WINNER) {
                this.ais[game.plw].elo+=24*p1;
                this.ais[game.plb].elo-=24*p1;
            } else if (this.ais[game.plb].WINNER) {
                this.ais[game.plb].elo+=24*p2;
                this.ais[game.plw].elo-=24*p2;
            } else {
                this.ais[game.plb].elo+=12*p2;
                this.ais[game.plw].elo+=12*p1;
            }
            this.ais[game.plw].elo=Math.floor(this.ais[game.plw].elo);
            this.ais[game.plb].elo=Math.floor(this.ais[game.plb].elo);
        });  
    },
    classifyFitnesses: function() {
        var ortalama=0;
        let elos=[];
        var max=Number.NEGATIVE_INFINITY;
        var min=Number.POSITIVE_INFINITY;
        this.ais.forEach((ai)=>{
            if (ai.elo>max) max=ai.elo;
            if (ai.elo<min) min=ai.elo;
            elos.push(ai.elo);
            ortalama+=ai.elo;
        });
        console.log("ELO POINTS",elos);
        this.best=max;
        this.worst=min;
        ortalama=ortalama/elos.length;
        var sp=0;
        elos.forEach((p)=>{
            sp+=((p-ortalama)**2);
        });
        sp=sp/(elos.length-1);
        sp=Math.sqrt(sp);

        
        this.fitnesses=[];
        var maxZ=0;
        var minZ=0;
        elos.forEach((p)=>{
            var z_score=(p-ortalama)/sp;
            this.fitnesses.push(z_score);
            if (z_score>maxZ) maxZ=z_score;
            if (z_score<minZ) minZ=z_score;
        });
        this.fitnesses=this.fitnesses.map((z)=>(z-minZ)/(maxZ-minZ));
        
        this.crossoverIds=[];
        this.mutateIds=[];
        this.fitnesses.forEach((fitness,index)=>{
            if (fitness>0.55) {
                this.crossoverIds.push(index);
            } else {
                this.mutateIds.push(index);
            }
        });
    },
    mutateModels: function() {
        let types=["p","r","n","b","k","q"];
        console.log(this.mutateIds);
        this.mutateIds.forEach(idx => {
            let ai=this.ais[idx];
            ai.types.forEach((type)=>{
                for(let row=0;row<8;row++) {
                    for(let col=0;col<8;col++) {
                        if (Math.random()>0.75) {
                            let angle=this.inverseSigmoid(ai.points[type][row][col]);
                            angle+=(Math.random()-0.5);
                            ai.points[type][row][col]=this.sigmoid(angle);
                        }
                        if (Math.random()>0.75) {
                            let angle=this.inverseSigmoid(ai.additionPerMove[type][row][col]);
                            angle+=(Math.random()-0.5);
                            ai.additionPerMove[type][row][col]=this.sigmoid(angle);
                        }
                    }
                }
            });
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.checkScoreBase);
                angle+=(Math.random()-0.5);
                ai.checkScoreBase=this.sigmoid(angle);
                ai.checkScore=ai.checkScoreBase;
                ai.checkMateScore=2*ai.checkScoreBase;
            }
            // types.forEach((type)=>{
            //     if (Math.random()>0.75) {
            //         let angle=this.inverseSigmoid(ai.pieceAdditionPerMove[type]);
            //         angle+=Math.random()-0.5;
            //         ai.pieceAdditionPerMove[type]=this.sigmoid(angle);
            //     }
            // });
        });
        console.log("mutations of models are completed!");
    },
    crossoverModels:function() {
        console.log(this.crossoverIds);
        this.crossoverIds.forEach((idx,index)=>{
            // if (this.crossoverids.length>index+1) {
                if (this.crossoverIds.length>index+1) {
                    for (let row=0;row<8;row++) {
                        this.ais[idx].types.forEach((type)=>{
                            let changeIds=[];
                            while (changeIds.length<4) {
                                let id=Math.floor(Math.random() * 8);
                                if (changeIds.indexOf(id)==-1) {
                                    changeIds.push(id);
                                }
                            }
                            changeIds.forEach((id)=>{
                                let tmp=this.ais[this.crossoverIds[index+1]].points[type][row][id];
                                this.ais[this.crossoverIds[index+1]].points[type][row][id]=this.ais[idx].points[type][row][id];
                                this.ais[idx].points[type][row][id]=tmp;
                            });
                            changeIds=[];
                            while (changeIds.length<4) {
                                let id=Math.floor(Math.random() * 8);
                                if (changeIds.indexOf(id)==-1) {
                                    changeIds.push(id);
                                }
                            }
                            changeIds.forEach((id)=>{
                                let tmp=this.ais[this.crossoverIds[index+1]].additionPerMove[type][row][id];
                                this.ais[this.crossoverIds[index+1]].additionPerMove[type][row][id]=this.ais[idx].additionPerMove[type][row][id];
                                this.ais[idx].additionPerMove[type][row][id]=tmp;
                            });
                        });
                    }
                    if (Math.random()>=0.50) {
                        let temp=this.ais[idx].checkScoreBase;
                        this.ais[idx].checkScoreBase=this.ais[this.crossoverIds[index+1]].checkScoreBase;
                        this.ais[idx].checkScore=this.ais[idx].checkScoreBase;
                        this.ais[this.crossoverIds[index+1]].checkScoreBase=temp;
                        this.ais[this.crossoverIds[index+1]].checkScore=this.ais[this.crossoverIds[index+1]].checkScoreBase;
                    }
                    let types=["p","r","n","b","k","q"];
                    // console.log(types);
                    // types.forEach((type)=>{
                    //     // console.log(this.ais[idx]);
                    //     // console.log(this.ais[idx].pieceAdditionPerMove);
                    //     if (Math.random()>=0.50) {
                    //         let temp=this.ais[idx].pieceAdditionPerMove[type];
                    //         this.ais[idx].pieceAdditionPerMove[type]=this.ais[this.crossoverIds[index+1]].pieceAdditionPerMove[type];
                    //         this.ais[this.crossoverIds[index+1]].pieceAdditionPerMove[type]=temp;
                    //     }
                    // });
                }
            // }
        });
        console.log("Crossover processes are completed!");
    }
}

function Yavuz(idx,game,color) {
    this.game=game;
    this.idx=idx;
    this.init();
    this.color=color;
    this.memData={};
    this.countMoves=0;
    this.sendData=false;
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
        calculateBest: function(move,fen,gm=this.game,color=this.color) {
            var value=0;
            var maxGain=-1000000;
            var bestMove="";
            gm.moves().forEach((m)=> {
                    var tempGame=new Chess(gm.fen());
                    tempGame.move(m);
                    if (tempGame.turn()==this.opponent) {
                        // if (tempGame.in_check()) value=this.checkScore;
                        if (tempGame.in_checkmate()) value=Number.POSITIVE_INFINITY;
                    }
                    if (tempGame.turn()==this.color) {
                        // if (tempGame.in_check()) value=-this.checkScore;
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
        calcGain: function(gm=this.game,color=this.color,move,fen) {
            // const calc=this.gpu.createKernel(function(gm,color){
                var value=0;
                var tempGame=new Chess(gm.fen());
                if (tempGame.turn()==this.opponent) {
                    // if (tempGame.in_check()) value=this.checkScore;
                    if (tempGame.in_checkmate()) {
                        value=Number.POSITIVE_INFINITY;
                        return value;
                    }
                }
                if (tempGame.turn()==this.color) {
                    // if (tempGame.in_check()) value=-this.checkScore;
                    if (tempGame.in_checkmate()) {
                        value=Number.NEGATIVE_INFINITY;
                        return value;
                    } 
                }

                if (MEMORY[fen]!=undefined) {
                    // console.log("fen found");
                    if (MEMORY[fen][move]!=undefined) {
                        // console.log("move found");
                        value+=MEMORY[fen][move];
                    }
                }
                // if (increase) value+=this.checkScore;
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
            // let depth=this.depth;
            // while(true) {
            //     this.reduceMoveTreeMaxMin();
            //     let tree=[...this.movetree];
            //     if (this.getDim(tree).length==1) break;
            // }
            let treeTemp=[...this.movetree];
            // console.log("points length:",treeTemp.length);
            this.actualMoves=this.game.moves();
            // console.log("moves length:",this.actualMoves.length);
            this.actualMoves.forEach((m,idx)=>{
                // if (m.indexOf("+")!=-1) {
                //     treeTemp[idx]+=this.checkScore;
                //     // this.checkScore*=2;
                //     }
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
                                    return Math.max(a, b);
                                }, Number.NEGATIVE_INFINITY);
                            }
                            if (depth%2==0) {
                                // item.forEach((i,idx)=>{
                                //     if (!i) item[idx]=Number.POSITIVE_INFINITY;
                                // });
                                val = item.reduce(function(a, b) {
                                    return Math.min(a, b);
                                }, Number.POSITIVE_INFINITY);
                            }
                            tree[idx]=val;
                        }   
                    }
                    });
            }
            // }
        },

        minMax:function(node=this.game, depth, isMaximizingPlayer, alpha, beta, move, fen) {
            let tempGame=new Chess(node.fen());
            if (depth==0)
                return this.calcGain(tempGame,this.color,move,fen);

            if (isMaximizingPlayer) {
                let bestVal = Number.NEGATIVE_INFINITY; 
                let moves=tempGame.moves();
                moves.forEach((m)=>{
                    let f=tempGame.fen();
                    tempGame.move(m);
                    let value = this.minMax(tempGame, depth-1, false, alpha, beta,m,f);
                    bestVal = Math.max( bestVal, value); 
                    alpha = Math.max( alpha, bestVal);
                    tempGame.load(f);
                    if (beta <= alpha) return;
                });
                return bestVal
            } else {
                let bestVal = Number.POSITIVE_INFINITY; 
                let moves=tempGame.moves();
                moves.forEach((m)=>{
                    let f=tempGame.fen();
                    tempGame.move(m);
                    let value = this.minMax(tempGame, depth-1, true, alpha, beta,m,f);
                    bestVal = Math.min( bestVal, value);
                    beta = Math.min( beta, bestVal);
                    tempGame.load(f);
                    if (beta <= alpha) return;
                });
                    return bestVal
            }
        },

        calcMoves: function(depth=this.depth, gm=this.game, tree=this.movetree) {
            let tempGame=new Chess(gm.fen());
            let moves=tempGame.moves();
            moves.forEach((m,idx)=> {
                let f=tempGame.fen();
                tempGame.move(m);
                let val=this.minMax(tempGame,depth-1,false,Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY,m,f);
                tempGame.load(f);
                if (tree.length<idx+1) tree.push(val);
            });
        },
        makeMove: function() {
            if (this.game.in_checkmate()&&this.game.turn()==this.color) {
                this.WINNER=false;
                this.LOSER=true;
                this.DRAW=false;
                if (this.color=="w") {
                    ais[this.game.plb].WINNER=true;
                    ais[this.game.plb].LOSER=false;
                    ais[this.game.plb].DRAW=false;
                    console.log("WINNER:",this.game.plb,"GAME:",games.indexOf(this.game));
                    document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>BLACK WINS</b>";
                }
                if (this.color=="b") {
                    ais[this.game.plw].WINNER=true;
                    ais[this.game.plw].LOSER=false;
                    ais[this.game.plw].DRAW=false;
                    console.log("WINNER:",this.game.plw,"GAME:",games.indexOf(this.game));
                    document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                }
                console.log("LOSER:",this.idx,"GAME:",games.indexOf(this.game));
                fin[games.indexOf(this.game)]=true;
                // if (this.game.game_over()) {
                this.sendDatatoMemory();
                clearInterval(this.game.thread);
                return;
                // }
            } else if (this.game.in_checkmate()&&this.game.turn()==this.opponent) {
                this.WINNER=true;
                this.LOSER=false;
                this.DRAW=false;
                if (this.color=="w") {
                    ais[this.game.plb].LOSER=true;
                    ais[this.game.plb].WINNER=false;
                    ais[this.game.plb].DRAW=false;
                    document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                }
                if (this.color=="b") {
                    ais[this.game.plw].LOSER=true;
                    ais[this.game.plw].WINNER=false;
                    ais[this.game.plw].DRAW=false;
                    document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>BLACK WINS</b>";
                }
                console.log("WINNER:",this.idx,"GAME:",games.indexOf(this.game));
                // document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                fin[games.indexOf(this.game)]=true;
                this.sendDatatoMemory();
                clearInterval(this.game.thread);
                return;

            } else if (this.game.in_draw()||this.game.in_stalemate()||this.game.in_threefold_repetition()) {
                this.WINNER=false;
                this.LOSER=false;
                this.DRAW=true;
                if (this.color=="w") {
                    ais[this.game.plb].DRAW=true;
                    ais[this.game.plb].WINNER=false;
                    ais[this.game.plb].LOSER=false;
                }
                if (this.color=="b") {
                    ais[this.game.plw].DRAW=true;
                    ais[this.game.plw].WINNER=false;
                    ais[this.game.plw].LOSER=false;
                }
                console.log("DRAWN:",this.idx,"GAME:",games.indexOf(this.game));
                document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>DRAW</b>";
                fin[games.indexOf(this.game)]=true;
                this.sendDatatoMemory();
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
                    // if (m.indexOf("+")!=-1) this.checkScore+=this.checkScoreBase;
                    this.memData["fen"+(this.countMoves+1).toString()]=this.game.fen();
                    // console.log(this.game.fen());
                    this.memData["move"+(this.countMoves+1).toString()]=m;
                    this.countMoves++;
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
        },
        sendDatatoMemory:function () {
            if (!this.sendData) {
                this.memData["WINNER"]=this.WINNER;
                this.memData["LOSER"]=this.LOSER;
                this.memData["DRAW"]=this.DRAW;
                $.ajax({
                    type: "POST",
                    url: "./saveMemory.php",
                    data: this.memData,
                    dataType: "json",
                    success: function (response,err) {
                        console.log(response,err);
                        datasSent[this.idx]=true;
                        this.countMoves=0;
                        this.memData={};
                    }
                });
                this.sendData=true;
                if (this.color=="b") {
                    ais[this.game.plw].sendDatatoMemory();
                }
            }
        }
    }

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function countChr(str,chr) {
    var c=0
    for(var i=0;i<str.length;i++) {
        if (str.charAt(i)==chr) c++;
    }
    return c;
}

function gameProcedures() {
    this.ais=ais;
    this.games=games;
    this.AiProcedures=new AiProcedures();
    this.matchPoints=[];//[1, 2, 2, 0, 1, 1, 1, 0.5, 0, 2, 1.5, 0, 1.5, 1, 0.5, 2, 1.5, 1, 1, 1.5, 2, 0, 0.5, 0, 1, 2, 2, 1, 1, 0, 0.5, 0, 1, 1, 1, 2, 0, 1, 2, 1];
    for(let i=0;i<size*2;i++) {
        this.matchPoints.push(0);
    }
}

gameProcedures.prototype = {

    drawSwitzerland:function () {
        let elosw=[];
        let elosb=[];
        let idsb=[];
        let idsw=[];
        this.ais.forEach((ai)=>{
            // if (ai.WINNER) this.matchPoints[ai.idx]+=1.0;
            // if (ai.DRAW) this.matchPoints[ai.idx]+=0.5;
            if (ai.color=="w") {
                idsw.push(ai.idx);
                elosw.push(this.matchPoints[ai.idx]);
            }
            if (ai.color=="b") {
                idsb.push(ai.idx);
                elosb.push(this.matchPoints[ai.idx]);
            }
            // ids.push(ai.idx);
        });
        // console.log(this.matchPoints);
        let eloswSorted=[...elosw];
        let elosbSorted=[...elosb];
        eloswSorted.sort(function(a, b){return b - a});
        elosbSorted.sort(function(a, b){return b - a});
        let tableNo=0;
        while(idsw.length>0&&idsb.length>0) {
            this.games[tableNo].reset();
            let index=elosb.indexOf(elosbSorted[0]);
            elosb.splice(index,1);
            elosbSorted.splice(0,1);
            let p1=idsb[index];
            this.games[tableNo].plw=p1;
            this.ais[p1].game=this.games[tableNo];
            this.ais[p1].color="w";
            this.ais[p1].opponent="b";
            idsb.splice(index,1)
            index=elosw.indexOf(eloswSorted[0]);
            elosw.splice(index,1);
            eloswSorted.splice(0,1);
            let p2=idsw[index];
            this.games[tableNo].plb=p2;
            this.ais[p2].game=this.games[tableNo];
            this.ais[p2].color="b";
            this.ais[p2].opponent="w";
            idsw.splice(index,1);
            console.log(tableNo,"setted macth");
            console.log(p1,"vs",p2);
            tableNo++;
        }
    },
    
    draw:function() {
        // let idsb=[];
        // let idsw=[];
        let ids=[]
        this.ais.forEach((ai)=>{
            // if (ai.color=="w") idsw.push(ai.idx);
            // if (ai.color=="b") idsb.push(ai.idx);
            ids.push(ai.idx);
        });

        // let idsTemp=[...this.ids];
        // console.log(this.ids);
        // console.log(idsTemp);
        let tableNo=0;
        while(ids.length>0) {//idsw.length>0&&idsb.length>0) {
            console.log(tableNo,"setted macth");
            let index=Math.floor(Math.random()*ids.length);
            this.games[tableNo].reset();
            let p1=ids[index];
            this.games[tableNo].plw=p1;
            this.ais[p1].game=this.games[tableNo];
            this.ais[p1].color="w";
            this.ais[p1].opponent="b";
            ids.splice(index,1);
            index=Math.floor(Math.random()*ids.length)
            let p2=ids[index];
            this.games[tableNo].plb=p2;
            this.ais[p2].game=this.games[tableNo];
            this.ais[p2].color="b";
            this.ais[p2].opponent="w";
            ids.splice(index,1);
            console.log(p1,"vs",p2);
            tableNo++;
        }
    },
    start: function() {
        // ais[games[0].plw].makeMove();
        games.forEach((game,idx)=>{
            console.log("process created",idx);
            game.thread=setInterval(()=>{
                ais[game.plw].makeMove();
                ais[game.plb].makeMove();
                boards[idx].setPosition(game.fen(),false);
            },100);
        });
    },
    finishedAll: function () {
        let finished=true;
        for(let i=0;i<this.games.length;i++){
            if (!fin[i]&&!datasSent[i]) {
                finished=false;
                break;
            }
        }
        return finished;
    },
    run: function() {
        this.draw();
        this.start();
        console.log("started...");
        // console.log(this.AiProcedures.tour);
        setInterval(()=>{
            if (this.finishedAll()) {
                this.AiProcedures.calculateNewPoints();
                this.AiProcedures.classifyFitnesses();
                this.ais.forEach((ai)=>{
                    let vals={
                        id:ai.idx,
                        points:JSON.stringify(ai.points),
                        additionPerMove:JSON.stringify(ai.additionPerMove),
                        pieceAdditionPerMove:JSON.stringify(ai.pieceAdditionPerMove),
                        checkScore:ai.checkScoreBase,
                        elo:ai.elo
                    };
                    // console.log(vals);
                    $.ajax({
                        type: "POST",
                        url: "./saveAi.php",
                        data: vals,
                        dataType: "json",
                        success: function (response) {
                            console.log(response);
                        }
                    });

                    if (ai.WINNER) this.matchPoints[ai.idx]+=1.0;
                    if (ai.DRAW) this.matchPoints[ai.idx]+=0.5;
                    this.pointsGame=JSON.parse(JSON.stringify(ai.points));
                    ai.piecePoints={p:0.1,r:0.5,b:0.3,n:0.3,k:0.0,q:0.9};
                    ai.checkScore=ai.checkScoreBase;
                    ai.sendData=false;
                });
                console.log(this.matchPoints);
                for(let i=0;i<size;i++) {
                    document.getElementById("info"+i.toString()).innerHTML="Game:"+(i+1).toString()
                    fin[i]=false;
                    datasSent[i]=false;
                }
                document.getElementById("gameCount").innerHTML=this.AiProcedures.gameCount;
                document.getElementById("belo").innerHTML=this.AiProcedures.best;
                document.getElementById("welo").innerHTML=this.AiProcedures.worst;
                document.getElementById("tour").innerHTML=this.AiProcedures.tour;
                document.getElementById("playing").innerHTML="0/"+size.toString();
                let shouldContinue=false;
                let val =this.matchPoints.reduce(function(a, b) {
                    return Math.max(a, b);
                }, 0);
                let rec=0;
                this.matchPoints.forEach((p)=>{
                    if (p==val) rec+=1;
                });
                if (rec>1) shouldContinue=true;
                console.log(this.AiProcedures.tour,tourCount,shouldContinue);
                if (this.AiProcedures.tour<tourCount||shouldContinue) {
                    this.AiProcedures.mutateModels();
                    this.AiProcedures.crossoverModels();
                    this.drawSwitzerland();
                    this.start();
                } else {
                    let idx=this.matchPoints.indexOf(val);
                    let elo=this.ais[idx].elo;
                    document.getElementById("gameCount").innerHTML="Tournament Completed!<br>";
                    document.getElementById("gameCount").innerHTML+="Champion:"+idx.toString()+"<br>";
                    document.getElementById("gameCount").innerHTML+="Elo:"+elo.toString();
                }
            }
        },100);
    }
}

// window.start = async function () {
//     gp.run();
// }