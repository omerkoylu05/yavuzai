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
let tourCount=10;
var size=1;
let MEMORY={};
let contTournament=true;
document.addEventListener('readystatechange', event => { 

    // When HTML/DOM elements are ready:
    // if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
    //     alert("hi 1");
    // }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        let table=document.createElement("table");
        let tr;
        for(var i=0; i<size;i++) {
            if (i%5==0) {
                tr=document.createElement("tr");
                table.appendChild(tr);
            }
            let td=document.createElement("td");
            var boardContainer=document.createElement("div");
            var info=document.createElement("div");
            info.setAttribute("id","info"+i.toString());
            info.innerHTML="Game:"+(i+1).toString();
            boardContainer.appendChild(info);
            var board=document.createElement("div");
            board.setAttribute("id","board"+i.toString());
            board.setAttribute("class","board");
            boardContainer.appendChild(board);
            td.appendChild(boardContainer);
            tr.appendChild(td);
            const chess = new Chess()
            games.push(chess);
        }
        document.body.appendChild(table);
    }
    for(var i=0;i <size;i++) {
        const board = new Chessboard(document.getElementById("board"+i.toString()), {
        position: games[i].fen(),
        sprite: {url: "../assets/images/chessboard-sprite-staunty.svg"},
        style: {moveFromMarker: undefined, moveToMarker: undefined}, // disable standard markers
        orientation: COLOR.white
        })
        // board.enableMoveInput(inputHandler, COLOR.white);
        boards.push(board);
    }
    let compinit1=false;
    let compinit2=false;
    let compinitMem=false;
    games.forEach((game,idx)=>{
        var plw=new Yavuz(idx*2,game,"w");
        ais.push(plw);
        $.ajax({
            type: "GET",
            url: "./BackupYavuzSmart/"+(idx*2).toString()+".txt",
            dataType: "html",
            success: function (response,err) {
                let elo=response.substr(4,response.indexOf("\n")-4);
                response=response.substr(response.indexOf("POINTS"),response.length);
                let points=response.substr(7,response.indexOf("\n")-7);
                response=response.substr(response.indexOf("ADDITIONPERMOVE"),response.length);
                let addPerMove=response.substr(16,response.indexOf("\n")-16);
                response=response.substr(response.indexOf("ADDITONPIECE"),response.length);
                let addPiecePerMove=response.substr(13,response.indexOf("\n")-13);
                response=response.substr(response.indexOf("CHECKSCORE"),response.length);
                let checkScore=response.substr(11,response.indexOf("\n")-11);
                plw.elo=parseInt(elo);
                plw.points=JSON.parse(points);
                plw.pointsGame=JSON.parse(JSON.stringify(plw.points));
                plw.defaultAdditionPerMove=JSON.parse(addPerMove);
                plw.additionPerMove=JSON.parse(addPerMove);
                plw.pieceAdditionPerMove={p:0.1,r:0.5,n:0.3,b:0.3,k:0.0,q:0.9};
                // plw.pieceAdditionPerMove=JSON.parse(addPiecePerMove);
                // console.log(plw.pieceAdditionPerMove["b"]);
                plw.checkScoreBase=parseFloat(checkScore);
                plw.checkScore=parseFloat(checkScore);
                // console.log(addPerMove);
                compinit1=true;
            },
            error:function (err) {
                
            }
        });  
        var plb=new Yavuz((idx*2)+1,game,"b");
        ais.push(plb);
        $.ajax({
            type: "GET",
            url: "./BackupYavuzSmart/"+((idx*2)+1).toString()+".txt",
            dataType: "html",
            success: function (response,err) {
                let elo=response.substr(4,response.indexOf("\n")-4);
                response=response.substr(response.indexOf("POINTS"),response.length);
                let points=response.substr(7,response.indexOf("\n")-7);
                response=response.substr(response.indexOf("ADDITIONPERMOVE"),response.length);
                let addPerMove=response.substr(16,response.indexOf("\n")-16);
                response=response.substr(response.indexOf("ADDITONPIECE"),response.length);
                let addPiecePerMove=response.substr(13,response.indexOf("\n")-13);
                response=response.substr(response.indexOf("CHECKSCORE"),response.length);
                let checkScore=response.substr(11,response.indexOf("\n")-11);
                plb.elo=parseInt(elo);
                plb.points=JSON.parse(points);
                plb.pointsGame=JSON.parse(JSON.stringify(plb.points));
                plb.defaultAdditionPerMove=JSON.parse(addPerMove);
                plb.additionPerMove=JSON.parse(addPerMove);
                // plb.pieceAdditionPerMove=JSON.parse(addPiecePerMove);
                plb.pieceAdditionPerMove={p:0.1,r:0.5,n:0.3,b:0.3,k:0.0,q:0.9};
                plb.checkScoreBase=parseFloat(checkScore);
                plb.checkScore=parseFloat(checkScore);
                // console.log(checkScore);
                compinit2=true;
            },
            error:function (err) {
                
            }
        });
        // $.ajax({
        //     type:"GET",
        //     url:"./memory/memory.json",
        //     dataType:"json",
        //     success:function (response,err) { 
        //         MEMORY=response;
        //         // console.log(MEMORY);

        //         // yavuz.makeMove();
        //         // board.setPosition(chess.fen());
                compinitMem=true;
            //     }
            // });
        game.plw=ais.indexOf(plw);
        game.plb=ais.indexOf(plb);
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
    let update=setInterval(()=>{
        let finishedCount=0;
        games.forEach((game)=>{
            if (game.game_over()) finishedCount++; 
        });
        document.getElementById("playing").innerHTML=finishedCount.toString()+"/"+games.length.toString();
    },10000);
    let init=setInterval(()=>{
        if (compinit2&&compinit1&&compinitMem) {
            let best=0;
            let worst=Number.POSITIVE_INFINITY;
            ais.forEach((ai)=>{
                if (ai.elo>best) best=ai.elo;
                if (ai.elo<worst) worst=ai.elo;
            });
            document.getElementById("belo").innerHTML=best.toString();
            document.getElementById("welo").innerHTML=worst.toString();
            clearInterval(init);
        }
    },100)
    var threads=[];
    gp=new gameProcedures();
    
});

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
    this.color=color;
    this.memData={};
    this.countMoves=0;
    this.sendData=false;
    this.places={};
    this.places.P=["a7","b7","c7","d7","e7","f7","g7","h7"];
    this.places.p=["a2","b2","c2","d2","e2","f2","g2","h2"];
    this.places.R=["a8","h8"];
    this.places.r=["a1","h1"];
    this.places.N=["b8","g8"];
    this.places.n=["b1","g1"];
    this.places.B=["c8","f8"];
    this.places.b=["b1","g1"];
    this.places.Q=["d8"];
    this.places.q=["d1"];
    this.places.K=["e8"];
    this.places.k=["e1"];
    this.init();
    // this.fen=game.fen();
    // this.fens={};
    // this.fen=this.fen.substr(0,this.fen.indexOf("q ")+2);
    this.recCount=0;
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
            this.points={};
            this.defaultAdditionPerMove={};
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
            this.rookCount=0;
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
            this.piecePoints={p:0.100,r:0.500,n:0.320,b:0.330,k:2.0,q:0.900};
            this.pieceAdditionPerMove={p:Math.random(),r:Math.random(),n:Math.random(),b:Math.random(),k:Math.random(),q:Math.random()};
            // this.gpu=new GPU();
        },

        sigmoid:function (t) {
            return 1/(1+Math.pow(Math.E, -t));
        },
    
        inverseSigmoid: function (t) {
            return Math.log(t/(1-t));
        },

        inversePoints: function () {
            // console.log(this.pointsGame);
            Object.keys(this.pointsGame).forEach((k) => {
                // console.log();
                var reversed = this.pointsGame[k].map(function reverse(item) {
                    return Array.isArray(item) && Array.isArray(item[0]) 
                               ? item.map(reverse) 
                               : item.reverse();
                });
                this.pointsGame[k]=reversed;
            });
            Object.keys(this.additionPerMove).forEach((k) => {
                // console.log();
                var reversed = this.additionPerMove[k].map(function reverse(item) {
                    return Array.isArray(item) && Array.isArray(item[0]) 
                               ? item.map(reverse) 
                               : item.reverse();
                });
                this.additionPerMove[k]=reversed;
            });
            console.log(this.pointsGame);
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
        calcGain: function(gm=this.game,color=this.color,move) {
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

                // if (MEMORY[this.fen]!==undefined) {
                //     if (MEMORY[this.fen][move]!==undefined) {
                //         console.log("move found");
                //         value+=MEMORY[this.fen][move];
                //     }
                // } else {
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
                // }

                tempGame.move(move);
                let moves=tempGame.moves();
                let kMoves=0;
                moves.forEach(m=>{
                    if (m.indexOf("k")!=-1||m.indexOf("K")!=-1) {
                        kMoves++;
                    }
                })
                value-=(kMoves/8);
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
        selectMove:function(changeDepth=0) {
            // console.log(changeDepth);
            // let depth=this.depth+1;
            // let tr=[...this.movetree];
            // console.log(this.getDim(tr));
            // let depth=this.depth;
            // while(true) {
            //     this.reduceMoveTreeMaxMin();
            //     let tree=[...this.movetree];
            //     if (this.getDim(tree).length==1) break;
            // }
            if (MEMORY[this.fen]!=undefined) {
                this.actualMoves=Object.keys(MEMORY[this.fen])
                let points=[]
                Object.keys(MEMORY[this.fen]).forEach((move)=>{
                    points.push(MEMORY[this.fen][move]);
                });
                let val = points.reduce(function(a, b) {
                    return Math.max(a, b);
                }, Number.NEGATIVE_INFINITY);
                // console.log(val);
                this.movetree=[];
                for(let i=0;i<changeDepth;i++) {
                    if (this.actualMoves.length>1) {
                        this.actualMoves.splice(points.indexOf(val),1);
                        points.splice(points.indexOf(val),1);
                        val=points.reduce(function(a, b) {
                        return Math.max(a, b);
                        }, Number.NEGATIVE_INFINITY);
                    } else {
                        break;
                    }
                }
                // console.log(this.actualMoves.length);
                if (this.actualMoves.length>=1) return this.actualMoves[points.indexOf(val)];
                else this.calcMoves();
            }

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
            console.log(val);
            this.movetree=[];
            // console.log(this.actualMoves);
            for(let i=0;i<changeDepth;i++) {
                if (this.actualMoves.length>1) {
                    this.actualMoves.splice(treeTemp.indexOf(val),1);
                    treeTemp.splice(treeTemp.indexOf(val),1);
                    val=treeTemp.reduce(function(a, b) {
                    return Math.max(a, b);
                    }, Number.NEGATIVE_INFINITY);
                } else {
                    break;
                }
            }
            console.log(this.actualMoves);
            console.log(treeTemp);
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
                return bestVal;
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
                return bestVal;
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
            this.fen=this.game.fen();
            let idx=this.fen.indexOf(" b ");
            if (idx==-1) idx=this.fen.indexOf(" w ");
            this.fen=this.fen.substr(0,idx);
            // if (this.fen.indexOf("KQkq")!=-1) {
            // if (this.fens[this.fen]!=undefined) this.fens[this.fen]++;
            // else {
            //     this.fens[this.fen]=0;
            // }
            // // }            
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
                // this.sendDatatoMemory();
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
                // this.sendDatatoMemory();
                clearInterval(this.game.thread);
                return;

            } else if (this.game.in_draw()||this.game.in_stalemate()||this.game.in_threefold_repetition()) {//||this.fens[this.fen]>5) {
                console.log(this.game.in_draw());
                console.log(this.game.in_stalemate());
                console.log(this.game.in_threefold_repetition());
                // console.log(this.fens);
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
                //this.sendDatatoMemory();
                clearInterval(this.game.thread);
                return;

            } else if (!this.game.game_over()&&this.game.turn()==this.color) {
                this.calcMoves();
                // console.log(this.movetree);
                // console.log(this.fen);
                let m=this.selectMove();//this.fens[this.fen]);
                if (m.indexOf("o-o")!=-1) this.rookCount+=1;
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
                    let d=this.game.move(m);
                    if (this.color=="w") {
                        this.places[d.piece].push(d.to);
                    } else {
                        this.places[d.piece.toUpperCase()].push(d.to);
                    }
                    // if (this.game.in_threefold_repetition()) {
                    //     this.game.undo();
                    //     console.log("move changed:",m);
                    //     m=this.selectMove(true);
                    //     console.log("new move",m);
                    //     this.game.move(m);
                    // }
                    this.types.forEach((type) => {
                        for (var row=0;row<8;row++) {
                            for(var col=0;col<8;col++) {
                                let val=this.pointsGame[type][row][col];
                                this.pointsGame[type][row][col]=this.sigmoid(this.inverseSigmoid(val)+this.additionPerMove[type][row][col]);
                            }
                        } 
                        // this.piecePoints[type]+=this.pieceAdditionPerMove[type];
                        // this.checkScore+=this.checkScoreBase;
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
            this.ais[p2].inversePoints();
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
            this.ais[p2].inversePoints();
            this.ais[p2].opponent="w";
            ids.splice(index,1);
            console.log(p1,"vs",p2);
            tableNo++;
        }
    },
    start: function() {
        // ais[games[0].plw].makeMove();
        
        games.forEach((game,idx)=>{
            game.reset();
            ais[game.plw].game=game;
            ais[game.plb].game=game;
            console.log(ais[game.plw]);
            console.log(ais[game.plb]);
            console.log("process created",idx);
            game.thread=setInterval(()=>{
                ais[game.plw].makeMove();
                ais[game.plb].makeMove();
                boards[idx].setPosition(game.fen(),false);
            },10);
            this.mainloop=game.thread;
        });
    },
    finishedAll: function () {
        let finished=true;
        for(let i=0;i<this.games.length;i++){
            if (!fin[i]) {
                finished=false;
                break;
            }
        }
        return finished;
    },
    run: function() {
        // this.draw();
        this.start();
        console.log("started...");
        // console.log(this.AiProcedures.tour);
        let mInterval=setInterval(()=>{
            if (this.finishedAll()) {
                for(let i=0;i<this.games.length;i++) {
                    fin[i]=false;
                }
                clearInterval(this.mainloop);
                this.AiProcedures.tour++;
                this.AiProcedures.ais[0].game.reset();
                this.AiProcedures.ais[1].game.reset();
                this.AiProcedures.ais[0].countMoves=0;
                this.AiProcedures.ais[1].countMoves=0;
                // this.AiProcedures.classifyFitnesses();
                Object.keys(this.AiProcedures.ais[0].points).forEach((key)=>{
                    console.log(key);
                    for(let row=0;row<8;row++) {
                        for(let col=0;col<8;col++) {
                            let uKey=key.toUpperCase();
                            if (this.AiProcedures.ais[0].places[key].indexOf(this.AiProcedures.ais[0].rows[row]+this.AiProcedures.ais[0].columns[col])!=-1) {
                                if (this.AiProcedures.ais[0].WINNER==true)
                                    this.AiProcedures.ais[0].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].points[key][row][col])+1);
                                if (this.AiProcedures.ais[0].LOSER==true)
                                    this.AiProcedures.ais[0].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].points[key][row][col])-1);
                                if (this.AiProcedures.ais[0].DRAW==true)
                                    this.AiProcedures.ais[0].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].points[key][row][col])-0.5);
                                if (this.AiProcedures.ais[0].WINNER==true)
                                    this.AiProcedures.ais[0].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].additionPerMove[key][row][col])+1/this.AiProcedures.ais[0].countMoves);
                                if (this.AiProcedures.ais[0].LOSER==true)
                                    this.AiProcedures.ais[0].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].additionPerMove[key][row][col])-1/this.AiProcedures.ais[0].countMoves);
                                if (this.AiProcedures.ais[0].DRAW==true)
                                    this.AiProcedures.ais[0].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].additionPerMove[key][row][col])+0.5);
                            }
                            if (this.AiProcedures.ais[1].places[uKey].indexOf(this.AiProcedures.ais[0].rows[row]+this.AiProcedures.ais[0].columns[col])!=-1) {
                                if (this.AiProcedures.ais[1].WINNER==true)
                                    this.AiProcedures.ais[0].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].points[key][row][col])-1);
                                if (this.AiProcedures.ais[1].LOSER==true)
                                    this.AiProcedures.ais[0].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].points[key][row][col])+1);
                                if (this.AiProcedures.ais[1].DRAW==true)
                                    this.AiProcedures.ais[0].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].points[key][row][col])+0.5);
                                if (this.AiProcedures.ais[1].WINNER==true)
                                    this.AiProcedures.ais[0].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].additionPerMove[key][row][col])-1/this.AiProcedures.ais[0].countMoves);
                                if (this.AiProcedures.ais[1].LOSER==true)
                                    this.AiProcedures.ais[0].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].additionPerMove[key][row][col])+1/this.AiProcedures.ais[0].countMoves);
                                if (this.AiProcedures.ais[1].DRAW==true)
                                    this.AiProcedures.ais[0].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[0].additionPerMove[key][row][col])+0.5);
                            }

                            if (this.AiProcedures.ais[1].places[uKey].indexOf(this.AiProcedures.ais[0].rows[row]+this.AiProcedures.ais[0].columns[col])!=-1) {
                                if (this.AiProcedures.ais[1].WINNER==true)
                                    this.AiProcedures.ais[1].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].points[key][row][col])+1);
                                if (this.AiProcedures.ais[1].LOSER==true)
                                    this.AiProcedures.ais[1].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].points[key][row][col])-1);
                                if (this.AiProcedures.ais[1].DRAW==true)
                                    this.AiProcedures.ais[1].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].points[key][row][col])-0.5);
                                if (this.AiProcedures.ais[1].WINNER==true)
                                    this.AiProcedures.ais[1].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].additionPerMove[key][row][col])+1/this.AiProcedures.ais[1].countMoves);
                                if (this.AiProcedures.ais[1].LOSER==true)
                                    this.AiProcedures.ais[1].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].additionPerMove[key][row][col])-1/this.AiProcedures.ais[1].countMoves);
                                if (this.AiProcedures.ais[1].DRAW==true)
                                    this.AiProcedures.ais[1].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].additionPerMove[key][row][col])+0.5);
                            }
                            if (this.AiProcedures.ais[0].places[key].indexOf(this.AiProcedures.ais[0].rows[row]+this.AiProcedures.ais[0].columns[col])!=-1) {
                                if (this.AiProcedures.ais[0].WINNER==true)
                                    this.AiProcedures.ais[1].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].points[key][row][col])-1);
                                if (this.AiProcedures.ais[0].LOSER==true)
                                    this.AiProcedures.ais[1].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].points[key][row][col])+1);
                                if (this.AiProcedures.ais[0].DRAW==true)
                                    this.AiProcedures.ais[1].points[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].points[key][row][col])-0.5);
                                if (this.AiProcedures.ais[0].WINNER==true)
                                    this.AiProcedures.ais[1].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].additionPerMove[key][row][col])-1/this.AiProcedures.ais[1].countMoves);
                                if (this.AiProcedures.ais[0].LOSER==true)
                                    this.AiProcedures.ais[1].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].additionPerMove[key][row][col])+1/this.AiProcedures.ais[1].countMoves);
                                if (this.AiProcedures.ais[0].DRAW==true)
                                    this.AiProcedures.ais[1].additionPerMove[key][row][col]=this.AiProcedures.ais[0].sigmoid(this.AiProcedures.ais[0].inverseSigmoid(this.AiProcedures.ais[1].additionPerMove[key][row][col])-0.5);
                            }
                        }
                    }
                });
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
                });
                console.log(this.AiProcedures.tour,tourCount);
                if (this.AiProcedures.tour<tourCount) {//||contTournament) {
                    this.start();
                } else {
                    document.getElementById("gameCount").innerHTML="Education Completed!<br>";
                    clearInterval(mInterval);
                }
            }
        },100);
    }
}

window.stopTournament= function () {
    contTournament=false;
}

window.start = async function () {
    gp.run();
}