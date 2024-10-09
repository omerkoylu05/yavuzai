import {Chessboard,COLOR, PIECE} from "../cm-chessboard/Chessboard.js";
import {Chess} from "../../node_modules/chess.js/dist/esm/chess.js";
import {Module} from "../../wasm/output.js";
// import { $ } from "../../node_modules/jquery/dist/jquery.js";
// import * as $  from "../../node_modules/jquery/dist/jquery.min.js";
let MEMORY={};
let ready=false;
    //   var Module = {
    //     preRun: [],
    //     postRun: [],
    //     print: (function() {
    //     var element = document.getElementById('output');
    //       if (element) element.value = ''; // clear browser cache
    //       return function(text) {
    //         if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
    //         // These replacements are necessary if you render to raw HTML
    //         //text = text.replace(/&/g, "&amp;");
    //         //text = text.replace(/</g, "&lt;");
    //         //text = text.replace(/>/g, "&gt;");
    //         //text = text.replace('\n', '<br>', 'g');
    //         //console.log(text);
    //         if (element) {
    //           element.value += text + "\n";
    //           element.scrollTop = element.scrollHeight; // focus on bottom
    //         }
    //       };
    //     })(),
    //     // canvas: (function() {
    //     //   var canvas = document.getElementById('canvas');

    //     //   // As a default initial behavior, pop up an alert when webgl context is lost. To make your
    //     //   // application robust, you may want to override this behavior before shipping!
    //     //   // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
    //     //   canvas.addEventListener("webglcontextlost", function(e) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);

    //     //   return canvas;
    //     // })(),
    //     // setStatus: function(text) {
    //     //   if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
    //     //   if (text === Module.setStatus.last.text) return;
    //     //   var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
    //     //   var now = Date.now();
    //     //   if (m && now - Module.setStatus.last.time < 30) return; // if this is a progress update, skip it if too soon
    //     //   Module.setStatus.last.time = now;
    //     //   Module.setStatus.last.text = text;
    //     //   if (m) {
    //     //     text = m[1];
    //     //     progressElement.value = parseInt(m[2])*100;
    //     //     progressElement.max = parseInt(m[4])*100;
    //     //     progressElement.hidden = false;
    //     //     spinnerElement.hidden = false;
    //     //   } else {
    //     //     progressElement.value = null;
    //     //     progressElement.max = null;
    //     //     progressElement.hidden = true;
    //     //     if (!text) spinnerElement.style.display = 'none';
    //     //   }
    //     //   statusElement.innerHTML = text;
    //     // },
    //     // totalDependencies: 0,
    //     // monitorRunDependencies: function(left) {
    //     //   this.totalDependencies = Math.max(this.totalDependencies, left);
    //     //   Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    //     // }
    // //   };
    // //   Module.setStatus('Downloading...');
    // //   window.onerror = function(event) {
    //     // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
    //     // Module.setStatus('Exception thrown, see JavaScript console');
    //     // spinnerElement.style.display = 'none';
    //     // Module.setStatus = function(text) {
    //     //   if (text) Module.printErr('[post-exception status] ' + text);
    //     // };
    //   };
    Module.onRuntimeInitialized = function() {
        Module._set_depth(7);
        //console.log("module loaded...");
    }
    //   //console.log(Module);

var games=[];
var boards=[];
var ais=[]
var gp;
let fin=[];
let datasSent=[];
let tourCount=Math.floor(Math.log2(40))+1;
var size=250;
for (let i=0;i<size;i++) fin.push(false);
for (let i=0;i<size;i++) datasSent.push(false);
// let MEMORY={};
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
            const chess = new Chess();
            // chess.setPosition("1b1B4/5P2/7R/6PB/R3N1Pk/r7/1q1rnPPp/3bK1NQ");
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
        // var plb=new Yavuz(idx*2+1,game,"b");
        // ais.push(plb);
        $.ajax({
            type: "GET",
            url: "./BackupYavuz/"+(idx*2).toString()+".txt",
            dataType: "html",
            success: function (response,err) {
                let elo=response.substr(4,response.indexOf("\n")-4);
                response=response.substr(response.indexOf("CE_PASSEDPAWNS"),response.length);
                let ce_passedPawns2=response.substr(15,response.indexOf("\n")-15);
                //console.log(ce_passedPawns2);
                response=response.substr(response.indexOf("CE_PAWNWEAKNESSES"),response.length);
                let ce_pawnWeaknesses=response.substr(18,response.indexOf("\n")-18);
                response=response.substr(response.indexOf("CE_PIECEACTIVITY"),response.length);
                let ce_pieceActivity=response.substr(17,response.indexOf("\n")-17);
                response=response.substr(response.indexOf("CE_KINGPAWNSHIELD"),response.length);
                let ce_kingPawnShield=response.substr(18,response.indexOf("\n")-18);
                response=response.substr(response.indexOf("CE_PIECECOORDINATION"),response.length);
                let ce_pieceCoordination=response.substr(21,response.indexOf("\n")-21);
                response=response.substr(response.indexOf("CE_MATERIAL"),response.length);
                let ce_material=response.substr(12,response.indexOf("\n")-12);
                response=response.substr(response.indexOf("CE_KINGSAFETY"),response.length);
                let ce_kingsafety=response.substr(14,response.indexOf("\n")-14);
                response=response.substr(response.indexOf("C_PIECESQUARETABLES"),response.length);
                let ce_pieceSquareTables=response.substr(20,response.indexOf("\n")-20);
                response=response.substr(response.indexOf("C_MOBILITY"),response.length);
                let c_mobility=response.substr(11,response.indexOf("\n")-11);
                response=response.substr(response.indexOf("C_KINGSAFETY"),response.length);
                let c_kingSafety=response.substr(13,response.indexOf("\n")-13);
                response=response.substr(response.indexOf("C_PAWNSTRUCTURE"),response.length);
                let c_pawnStructure=response.substr(16,response.indexOf("\n")-16);
                response=response.substr(response.indexOf("C_PIECECOORDINATION"),response.length);
                let c_pieceCoordination=response.substr(20,response.length-20);
                response=response.substr(response.indexOf("C_ROOK"),response.length);
                let c_rook=response.substr(7,response.length-7);
                response=response.substr(response.indexOf("CE_ROOK"),response.length);
                let ce_rook=response.substr(8,response.length-8);
                response=response.substr(response.indexOf("C_CENTERCONTROL"),response.length);
                let c_centerControl=response.substr(16,response.length-16);
                response=response.substr(response.indexOf("C_DEVELOPPIECES"),response.length);
                let c_developPieces=response.substr(16,response.length-16);
                response=response.substr(response.indexOf("C_MATERIAL"),response.length);
                let c_material=response.substr(11,response.length-11);
                response=response.substr(response.indexOf("C_MOVECOUNT"),response.length);
                let c_movecount=response.substr(12,response.length-12);
                response=response.substr(response.indexOf("C_PAWNMOVEMENT"),response.length);
                let c_pawnmovement=response.substr(15,response.length);
                plw.elo=parseInt(elo);
                plw.ce_passedPawns2=parseFloat(ce_passedPawns2);
                //console.log(ce_passedPawns2);
                plw.ce_pawnWeaknesses=parseFloat(ce_pawnWeaknesses);
                //console.log(ce_pawnWeaknesses);
                plw.ce_pieceActivity=parseFloat(ce_pieceActivity);
                //console.log(ce_pieceActivity);
                plw.ce_kingPawnShield=parseFloat(ce_kingPawnShield);
                //console.log(ce_kingPawnShield);
                plw.ce_pieceCoordination=parseFloat(ce_pieceCoordination);
                //console.log(ce_pieceCoordination);
                plw.ce_material=parseFloat(ce_material);
                //console.log(ce_material);
                plw.ce_kingsafety=parseFloat(ce_kingsafety);
                plw.ce_pieceSquareTables=parseFloat(ce_pieceSquareTables);
                //console.log(ce_pieceSquareTables);

                plw.c_mobility=parseFloat(c_mobility);
                //console.log(c_mobility);
                plw.c_kingSafety=parseFloat(c_kingSafety);
                //console.log(c_kingSafety);
                plw.c_pawnStructure=parseFloat(c_pawnStructure);
                //console.log(c_pawnStructure);
                plw.c_pieceCoordination=parseFloat(c_pieceCoordination);
                //console.log(ce_pieceCoordination);
                plw.c_rook=parseFloat(c_rook);
                plw.ce_rook=parseFloat(ce_rook);

                //console.log(c_rookandPawnMovement);
                plw.c_centerControl=parseFloat(c_centerControl);
                //console.log(c_centerControl);
                plw.c_developPieces=parseFloat(c_developPieces);
                //console.log(c_developPieces);
                plw.c_material=parseFloat(c_material);
                plw.c_movecount=parseFloat(c_movecount);
                plw.c_pawnmovement=parseFloat(c_pawnmovement);
                //console.log(c_material);// plw.defaultPoints=JSON.parse(points);
                // let opoints={...plw.points};
                // plw.inversePoints(opoints);
                // plw.opoints=opoints;
                // plw.opointsGame={...opoints};
                // plw.pointsGame=JSON.parse(JSON.stringify(plw.points));
                // plw.defaultAdditionPerMove=JSON.parse(addPerMove);
                // plw.additionPerMove=JSON.parse(addPerMove);
                // let oadditionPerMove={...plw.additionPerMove};
                // plw.oadditionPerMove=oadditionPerMove;
                // plw.inversePoints(plw.oadditionPerMove);
                // plw.pieceAdditionPerMove={p:1.0,r:1.0,n:1.0,b:1.0,k:1.0,q:1.0};
                // plw.pieceAdditionPerMove=JSON.parse(addPiecePerMove);
                // //console.log(plw.pieceAdditionPerMove["b"]);
                // plw.checkScoreBase=parseFloat(checkScore);
                // plw.checkScore=parseFloat(checkScore);
                // //console.log(addPerMove);
                compinit1=true;
            },
            error:function (err) {
                
            }
        });  
        var plb=new Yavuz((idx*2)+1,game,"b");
        ais.push(plb);
        $.ajax({
            type: "GET",
            url: "./BackupYavuz/"+((idx*2)+1).toString()+".txt",
            dataType: "html",
            success: function (response,err) {
                let elo=response.substr(4,response.indexOf("\n")-4);
                response=response.substr(response.indexOf("CE_PASSEDPAWNS"),response.length);
                let ce_passedPawns2=response.substr(15,response.indexOf("\n")-15);
                //console.log(ce_passedPawns2);
                response=response.substr(response.indexOf("CE_PAWNWEAKNESSES"),response.length);
                let ce_pawnWeaknesses=response.substr(18,response.indexOf("\n")-18);
                response=response.substr(response.indexOf("CE_PIECEACTIVITY"),response.length);
                let ce_pieceActivity=response.substr(17,response.indexOf("\n")-17);
                response=response.substr(response.indexOf("CE_KINGPAWNSHIELD"),response.length);
                let ce_kingPawnShield=response.substr(18,response.indexOf("\n")-18);
                response=response.substr(response.indexOf("CE_PIECECOORDINATION"),response.length);
                let ce_pieceCoordination=response.substr(21,response.indexOf("\n")-21);
                response=response.substr(response.indexOf("CE_MATERIAL"),response.length);
                let ce_material=response.substr(12,response.indexOf("\n")-12);
                response=response.substr(response.indexOf("CE_KINGSAFETY"),response.length);
                let ce_kingsafety=response.substr(14,response.indexOf("\n")-14);
                response=response.substr(response.indexOf("C_PIECESQUARETABLES"),response.length);
                let ce_pieceSquareTables=response.substr(20,response.indexOf("\n")-20);
                response=response.substr(response.indexOf("C_MOBILITY"),response.length);
                let c_mobility=response.substr(11,response.indexOf("\n")-11);
                response=response.substr(response.indexOf("C_KINGSAFETY"),response.length);
                let c_kingSafety=response.substr(13,response.indexOf("\n")-13);
                response=response.substr(response.indexOf("C_PAWNSTRUCTURE"),response.length);
                let c_pawnStructure=response.substr(16,response.indexOf("\n")-16);
                response=response.substr(response.indexOf("C_PIECECOORDINATION"),response.length);
                let c_pieceCoordination=response.substr(20,response.length-20);
                response=response.substr(response.indexOf("C_ROOK"),response.length);
                let c_rook=response.substr(7,response.length-7);
                response=response.substr(response.indexOf("CE_ROOK"),response.length);
                let ce_rook=response.substr(8,response.length-8);
                response=response.substr(response.indexOf("C_CENTERCONTROL"),response.length);
                let c_centerControl=response.substr(16,response.length-16);
                response=response.substr(response.indexOf("C_DEVELOPPIECES"),response.length);
                let c_developPieces=response.substr(16,response.length-16);
                response=response.substr(response.indexOf("C_MATERIAL"),response.length);
                let c_material=response.substr(11,response.length-11);
                response=response.substr(response.indexOf("C_MOVECOUNT"),response.length);
                let c_movecount=response.substr(12,response.length-12);
                response=response.substr(response.indexOf("C_PAWNMOVEMENT"),response.length);
                let c_pawnmovement=response.substr(15,response.length);
                plb.elo=parseInt(elo);
                plb.ce_passedPawns2=parseFloat(ce_passedPawns2);
                //console.log(ce_passedPawns2);
                plb.ce_pawnWeaknesses=parseFloat(ce_pawnWeaknesses);
                //console.log(ce_pawnWeaknesses);
                plb.ce_pieceActivity=parseFloat(ce_pieceActivity);
                //console.log(ce_pieceActivity);
                plb.ce_kingPawnShield=parseFloat(ce_kingPawnShield);
                //console.log(ce_kingPawnShield);
                plb.ce_pieceCoordination=parseFloat(ce_pieceCoordination);
                //console.log(ce_pieceCoordination);
                plb.ce_material=parseFloat(ce_material);
                //console.log(ce_material);
                plb.ce_kingsafety=parseFloat(ce_kingsafety);
                plb.ce_pieceSquareTables=parseFloat(ce_pieceSquareTables);
                //console.log(ce_pieceSquareTables);

                plb.c_mobility=parseFloat(c_mobility);
                //console.log(c_mobility);
                plb.c_kingSafety=parseFloat(c_kingSafety);
                //console.log(c_kingSafety);
                plb.c_pawnStructure=parseFloat(c_pawnStructure);
                //console.log(c_pawnStructure);
                plb.c_pieceCoordination=parseFloat(c_pieceCoordination);
                //console.log(ce_pieceCoordination);
                plb.c_rook=parseFloat(c_rook);
                plb.ce_rook=parseFloat(ce_rook);
                //console.log(c_rookandPawnMovement);
                plb.c_centerControl=parseFloat(c_centerControl);
                //console.log(c_centerControl);
                plb.c_developPieces=parseFloat(c_developPieces);
                //console.log(c_developPieces);
                plb.c_material=parseFloat(c_material);
                plb.c_movecount=parseFloat(c_movecount);
                plb.c_pawnmovement=parseFloat(c_pawnmovement);
                //console.log(c_material);

                // plb.points=JSON.parse(points);
                // plb.defaultPoints=JSON.parse(points);
                // plb.pointsGame={...plb.points};
                // plb.opoints={...plb.points};
                // plb.inversePoints(plb.opoints);
                // plb.pointsGame=JSON.parse(JSON.stringify(plb.points));
                // plb.defaultAdditionPerMove=JSON.parse(addPerMove);
                // plb.oadditionPerMove=JSON.parse(addPerMove);
                // plb.additionPerMove={...plb.oadditionPerMove};
                // plb.inversePoints(plb.additionPerMove);
                // // plb.pieceAdditionPerMove=JSON.parse(addPiecePerMove);
                // plb.pieceAdditionPerMove={p:0.1,r:0.5,n:0.3,b:0.3,k:0.0,q:0.9};
                // plb.checkScoreBase=parseFloat(checkScore);
                // plb.checkScore=parseFloat(checkScore);
                // //console.log(checkScore);
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
        //         // //console.log(MEMORY);

                // yavuz.makeMove();
                // board.setPosition(chess.fen());
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
    //             //console.log(response);
    //         }
    //     });
    // });
    let update=setInterval(()=>{
        let finishedCount=0;
        games.forEach((game)=>{
            if (game.isGameOver()) finishedCount++; 
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
            let p1=1/(1+Math.pow(10,((this.ais[game.plb].elo-this.ais[game.plw].elo)/400)))
            let p2=1/(1+Math.pow(10,((this.ais[game.plw].elo-this.ais[game.plb].elo)/400)))
            if (this.ais[game.plw].WINNER) {
                this.ais[game.plw].elo+=(24*(1-p1));
                this.ais[game.plb].elo+=(24*(0-p2));
            } else if (this.ais[game.plb].WINNER) {
                this.ais[game.plb].elo+=(24*(1-p2));
                this.ais[game.plw].elo+=(24*(0-p1));
            } else {
                // if (this.ais[game.plb].elo>this.ais[game.plw].elo) {
                //     let K=(((this.ais[game.plb].elo-this.ais[game.plw].elo)/10)-1)*12;

                //     this.ais[game.plb].elo-=12*p2;
                //     this.ais[game.plw].elo+=12*p1;
                // }
                // if (this.ais[game.plb].elo<this.ais[game.plw].elo) {
                //     this.ais[game.plb].elo+=12*p2;
                //     this.ais[game.plw].elo-=12*p1;
                // }
                this.ais[game.plb].elo+=(12*(0.5-p2));
                this.ais[game.plw].elo+=(12*(0.5-p1));
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
        //console.log("ELO POINTS",elos);
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
        let idsObj=[];
        this.fitnesses.forEach((fitness,index)=>{
            let item={
                idx:index,
                ftn:fitness
            };
            idsObj.push(item);
        });
        idsObj.sort(function(a,b){
            return a.ftn-b.ftn;
        });
        idsObj.forEach((item)=>{
            if (item.ftn>0.55) {
                this.crossoverIds.push(item.idx);
            } else {
                this.mutateIds.push(item.idx);
            }
        });
    },
    mutateModels: function() {
        // let types=["p","r","n","b","k","q"];
        //console.log(this.mutateIds);
        this.mutateIds.forEach(idx => {
            let ai=this.ais[idx];
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_passedPawns2);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_passedPawns2=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_pawnWeaknesses);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_pawnWeaknesses=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_pieceActivity);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_pieceActivity=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_kingPawnShield);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_kingPawnShield=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_pieceCoordination);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_pieceCoordination=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_material);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_material=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_pieceSquareTables);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_pieceSquareTables=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_mobility);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_mobility=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_passedPawns);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_passedPawns=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_kingSafety);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_kingSafety=angle;
            }
            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_pawnStructure);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_pawnStructure=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_pieceCoordination);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_pieceCoordination=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_rook);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_rook=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_rook);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_rook=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_centerControl);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_centerControl=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_pawnmovement);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_pawnmovement=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_developPieces);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_developPieces=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_material);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_material=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.ce_kingSafety);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.ce_kingSafety=angle;
            }

            if (Math.random()>0.75) {
                let angle=this.inverseSigmoid(ai.c_movecount);
                angle+=(Math.random()-0.5)*0.1;
                angle=this.sigmoid(angle);
                angle>0.9999999999999999?angle=0.9999999999999999:angle=angle;
                angle<0?angle=0.0000000000000001:angle=angle;
                ai.c_movecount=angle;
            }
            // ai.types.forEach((type)=>{
            //     for(let row=0;row<8;row++) {
            //         for(let col=0;col<8;col++) {
            //             if (Math.random()>0.75) {
            //                 let angle=this.inverseSigmoid(ai.defaultPoints[type][row][col]);
            //                 angle+=((Math.random()/10)-0.05);
            //                 if (this.sigmoid(angle)>0.9999999999999999) 
            //                     ai.defaultPoints[type][row][col]=0.9999999999999999;
            //                 else if (this.sigmoid(angle)<0.0000000000000001) 
            //                     ai.defaultPoints[type][row][col]=0.0000000000000001;
            //                 else 
            //                     ai.defaultPoints[type][row][col]=this.sigmoid(angle);
            //             }
            //             if (Math.random()>0.75) {
            //                 let angle=this.inverseSigmoid(ai.defaultAdditionPerMove[type][row][col]);
            //                 angle+=((Math.random()*0.1)-0.05);
            //                 if (this.sigmoid(angle)>0.9999999999999999)   {
            //                     ai.defaultAdditionPerMove[type][row][col]=0.9999999999999999;
            //                 } else if (this.sigmoid(angle)<0.0000000000000001) {
            //                     ai.defaultAdditionPerMove[type][row][col]=0.0000000000000001;
            //                 } else {
            //                     ai.defaultAdditionPerMove[type][row][col]=this.sigmoid(angle);
            //                 }
            //             }
            //         }
            //     }
            // });
            // if (Math.random()>0.75) {
            //     let angle=this.inverseSigmoid(ai.checkScoreBase);
            //     angle+=(Math.random()-0.5);
            //     ai.checkScoreBase=this.sigmoid(angle);
            //     ai.checkScore=ai.checkScoreBase;
            //     ai.checkMateScore=2*ai.checkScoreBase;
            // }
            // // types.forEach((type)=>{
            // //     if (Math.random()>0.75) {
            // //         let angle=this.inverseSigmoid(ai.pieceAdditionPerMove[type]);
            // //         angle+=Math.random()-0.5;
            // //         ai.pieceAdditionPerMove[type]=this.sigmoid(angle);
            // //     }
            // // });
            // this.ais[idx].points=JSON.parse(JSON.stringify(this.ais[idx].defaultPoints));
            // this.ais[idx].additionPerMove=JSON.parse(JSON.stringify(this.ais[idx].defaultAdditionPerMove));
            // let oadditionPerMove=JSON.parse(JSON.stringify(this.ais[idx].additionPerMove));
            // this.ais[idx].inversePoints(oadditionPerMove);
            // this.ais[idx].oadditionPerMove=oadditionPerMove;
            // let opoints=JSON.parse(JSON.stringify(this.ais[idx].points));
            // this.ais[idx].inversePoints(opoints);
            // this.ais[idx].oadditionPerMove=opoints;
            // // //console.log(this.ais[idx].points);
        });
        //console.log("mutations of models are completed!");
    },
    crossoverModels:function() {
        //console.log(this.crossoverIds);
        this.crossoverIds.forEach((idx,index)=>{
            // if (this.crossoverids.length>index+1) {
                if (this.crossoverIds.length>index+1) {
                    let tmp=0.0;
                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_passedPawns2;
                        this.ais[idx].ce_passedPawns2=this.ais[this.crossoverIds[index+1]].ce_passedPawns2;
                        this.ais[this.crossoverIds[index+1]].ce_passedPawns2=tmp;

                    }
                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_pawnWeaknesses;
                        this.ais[idx].ce_pawnWeaknesses=this.ais[this.crossoverIds[index+1]].ce_pawnWeaknesses;
                        this.ais[this.crossoverIds[index+1]].ce_pawnWeaknesses=tmp;

                    }
                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_pieceActivity;
                        this.ais[idx].ce_pieceActivity=this.ais[this.crossoverIds[index+1]].ce_pieceActivity;
                        this.ais[this.crossoverIds[index+1]].ce_pieceActivity=tmp;

                    }
                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_kingPawnShield;
                        this.ais[idx].ce_kingPawnShield=this.ais[this.crossoverIds[index+1]].ce_kingPawnShield;
                        this.ais[this.crossoverIds[index+1]].ce_kingPawnShield=tmp;

                    }
                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_pieceCoordination;
                        this.ais[idx].ce_pieceCoordination=this.ais[this.crossoverIds[index+1]].ce_pieceCoordination;
                        this.ais[this.crossoverIds[index+1]].ce_pieceCoordination=tmp;

                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_material;
                        this.ais[idx].ce_material=this.ais[this.crossoverIds[index+1]].ce_material;
                        this.ais[this.crossoverIds[index+1]].ce_material=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_pieceSquareTables;
                        this.ais[idx].c_pieceSquareTables=this.ais[this.crossoverIds[index+1]].c_pieceSquareTables;
                        this.ais[this.crossoverIds[index+1]].c_pieceSquareTables=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_mobility;
                        this.ais[idx].c_mobility=this.ais[this.crossoverIds[index+1]].c_mobility;
                        this.ais[this.crossoverIds[index+1]].c_mobility=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_kingSafety;
                        this.ais[idx].c_kingSafety=this.ais[this.crossoverIds[index+1]].c_kingSafety;
                        this.ais[this.crossoverIds[index+1]].c_kingSafety=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_pawnStructure;
                        this.ais[idx].c_pawnStructure=this.ais[this.crossoverIds[index+1]].c_pawnStructure;
                        this.ais[this.crossoverIds[index+1]].c_pawnStructure=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_pieceCoordination;
                        this.ais[idx].c_pieceCoordination=this.ais[this.crossoverIds[index+1]].c_pieceCoordination;
                        this.ais[this.crossoverIds[index+1]].c_pieceCoordination=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_rook;
                        this.ais[idx].c_rook=this.ais[this.crossoverIds[index+1]].c_rook;
                        this.ais[this.crossoverIds[index+1]].c_rook=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_rook;
                        this.ais[idx].ce_rook=this.ais[this.crossoverIds[index+1]].ce_rook;
                        this.ais[this.crossoverIds[index+1]].ce_rook=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_pawnmovement;
                        this.ais[idx].c_pawnmovement=this.ais[this.crossoverIds[index+1]].c_pawnmovement;
                        this.ais[this.crossoverIds[index+1]].c_pawnmovement=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_centerControl;
                        this.ais[idx].c_centerControl=this.ais[this.crossoverIds[index+1]].c_centerControl;
                        this.ais[this.crossoverIds[index+1]].c_centerControl=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_developPieces;
                        this.ais[idx].c_developPieces=this.ais[this.crossoverIds[index+1]].c_developPieces;
                        this.ais[this.crossoverIds[index+1]].c_developPieces=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_material;
                        this.ais[idx].c_material=this.ais[this.crossoverIds[index+1]].c_material;
                        this.ais[this.crossoverIds[index+1]].c_material=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].ce_kingSafety;
                        this.ais[idx].ce_kingSafety=this.ais[this.crossoverIds[index+1]].ce_kingSafety;
                        this.ais[this.crossoverIds[index+1]].ce_kingSafety=tmp;
                    }

                    if (Math.random()>0.75) {
                        tmp=this.ais[idx].c_movecount;
                        this.ais[idx].c_movecount=this.ais[this.crossoverIds[index+1]].c_movecount;
                        this.ais[this.crossoverIds[index+1]].c_movecount=tmp;
                    }
                    // for (let row=0;row<8;row++) {
                    //     this.ais[idx].types.forEach((type)=>{
                    //         let changeIds=[];
                    //         while (changeIds.length<4) {
                    //             let id=Math.floor(Math.random() * 8);
                    //             if (changeIds.indexOf(id)==-1) {
                    //                 changeIds.push(id);
                    //             }
                    //         }
                    //         changeIds.forEach((id)=>{
                    //             let tmp=this.ais[this.crossoverIds[index+1]].defaultPoints[type][row][id];
                    //             this.ais[this.crossoverIds[index+1]].defaultPoints[type][row][id]=this.ais[idx].defaultPoints[type][row][id];
                    //             this.ais[idx].defaultPoints[type][row][id]=tmp;
                    //         });
                    //         changeIds=[];
                    //         while (changeIds.length<4) {
                    //             let id=Math.floor(Math.random() * 8);
                    //             if (changeIds.indexOf(id)==-1) {
                    //                 changeIds.push(id);
                    //             }
                    //         }
                    //         changeIds.forEach((id)=>{
                    //             let tmp=this.ais[this.crossoverIds[index+1]].defaultAdditionPerMove[type][row][id];
                    //             this.ais[this.crossoverIds[index+1]].defaultAdditionPerMove[type][row][id]=this.ais[idx].defaultAdditionPerMove[type][row][id];
                    //             this.ais[idx].defaultAdditionPerMove[type][row][id]=tmp;
                    //         });
                    //     });
                    // }
                    // if (Math.random()>=0.50) {
                    //     let temp=this.ais[idx].checkScoreBase;
                    //     this.ais[idx].checkScoreBase=this.ais[this.crossoverIds[index+1]].checkScoreBase;
                    //     this.ais[idx].checkScore=this.ais[idx].checkScoreBase;
                    //     this.ais[this.crossoverIds[index+1]].checkScoreBase=temp;
                    //     this.ais[this.crossoverIds[index+1]].checkScore=this.ais[this.crossoverIds[index+1]].checkScoreBase;
                    // }
                    // let types=["p","r","n","b","k","q"];
                    // // //console.log(types);
                    // // types.forEach((type)=>{
                    // //     // //console.log(this.ais[idx]);
                    // //     // //console.log(this.ais[idx].pieceAdditionPerMove);
                    // //     if (Math.random()>=0.50) {
                    // //         let temp=this.ais[idx].pieceAdditionPerMove[type];
                    // //         this.ais[idx].pieceAdditionPerMove[type]=this.ais[this.crossoverIds[index+1]].pieceAdditionPerMove[type];
                    // //         this.ais[this.crossoverIds[index+1]].pieceAdditionPerMove[type]=temp;
                    // //     }
                    // // });
                }
            // }
            this.ais[idx].points=JSON.parse(JSON.stringify(this.ais[idx].defaultPoints));
            this.ais[idx].additionPerMove=JSON.parse(JSON.stringify(this.ais[idx].defaultAdditionPerMove));
            let oadditionPerMove=JSON.parse(JSON.stringify(this.ais[idx].additionPerMove));
            this.ais[idx].inversePoints(oadditionPerMove);
            this.ais[idx].oadditionPerMove=oadditionPerMove;
            let opoints=JSON.parse(JSON.stringify(this.ais[idx].points));
            this.ais[idx].inversePoints(opoints);
            this.ais[idx].oadditionPerMove=opoints;
        });
        //console.log("Crossover processes are completed!");
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
    // this.fen=game.fen();
    this.fens={};
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
            this.piecePoints={p:1.0,r:1.0,n:1.0,b:1.0,k:1.0,q:1.0};
            this.pieceValues={p:0.1,r:0.5,n:0.32,b:0.33,k:1.0,q:0.9};
            this.movetree=Array();
            this.decisiontree=Array();
            this.points={};
            this.opoints={};
            this.defaultAdditionPerMove={};
            this.defaultPoints={};
            this.pointsGame={};
            this.opointsGame={};
            this.actualMoves=[];
            this.additionPerMove={};
            this.oadditionPerMove={};
            this.WINNER=false;
            this.DRAW=false;
            this.LOSER=false;
            this.opponent=this.color=="w"?"b":"w";
            this.checkScoreBase=Math.random();
            this.checkScore=this.checkScoreBase;
            this.checkMateScore=this.checkScore*2;
            this.additionCheckScore=Math.random();
            this.rookCount=0;
            
            //midgame coefs...
            this.ce_passedPawns2=0.5//Math.random();
            this.ce_pawnWeaknesses=0.5;
            this.ce_pieceActivity=0.5;
            this.ce_kingPawnShield=0.5;
            this.ce_pieceCoordination=0.5;
            this.c_material=0.5;
            this.ce_material=0.5;
            this.ce_kingSafety=0.5;
            this.c_pieceSquareTables=0.5;
            this.c_mobility=0.5;
            this.c_kingSafety=0.5;
            this.c_pawnStructure=0.5;
            // this.c_rookandPawnMovement=0.5;
            this.c_centerControl=0.5;
            this.c_developPieces=0.5;
            this.c_pieceCoordination=0.5;
            this.c_movecount=0.5;
            this.c_rook=0.5;
            this.ce_rook=0.5;
            this.c_pawnmovement=0.5;
            

            
            this.types.forEach((type)=>{
                var cellPoints=[];
                var valPerMoves=[]
                for(var s=0;s<8;s++) {
                    var rowPoints=[];
                    var rowMovePoints=[]
                    for (var i=0;i<8;i++) {
                        rowPoints.push(this.pieceValues[type]*0.999)//Math.random()); //randomlar kaldırıldı
                        rowMovePoints.push(0.001);//Math.random());
                        }
                    cellPoints.push(rowPoints);
                    valPerMoves.push(rowMovePoints);
                }
                this.points[type]=cellPoints;
                this.additionPerMove[type]=valPerMoves;
            });
            this.defaultPoints=JSON.parse(JSON.stringify(this.points));
            this.pointsGame=JSON.parse(JSON.stringify(this.points));
            this.defaultAdditionPerMove=JSON.parse(JSON.stringify(this.additionPerMove));
            this.opointsGame=JSON.parse(JSON.stringify(this.points));
            this.inversePoints(this.opointsGame);
            this.opoints=JSON.parse(JSON.stringify(this.points));
            this.inversePoints(this.opoints);
            this.oadditionPerMove=JSON.parse(JSON.stringify(this.additionPerMove));
            this.inversePoints(this.oadditionPerMove);
            // //console.log(this.points);
            // this.pointsGame["b"][0][0]=5.0;
            // //console.log(this.points);
            this.pieceAdditionPerMove={p:Math.random(),r:Math.random(),n:Math.random(),b:Math.random(),k:Math.random(),q:Math.random()};
            // this.gpu=new GPU();
        },

        sigmoid:function (t) {
            return 1/(1+Math.pow(Math.E, -t));
        },
    
        inverseSigmoid: function (t) {
            return Math.log(t/(1-t));
        },

        inversePoints: function (ps) {
            // //console.log(this.pointsGame);
            // //console.log(ps);
            let types=["p","n","b","r","q","k"];
            if (ps=!{}) {
            types.forEach(type=>{
                for(let i=0;i<8;i++) {
                    let temp=ps[type][7-i];
                    ps[type][7-i]=ps[type][i];
                    ps[type][i]=temp;
                }
            });          
            } 
            // Object.keys(this.pointsGame).forEach((k) => {
            //     // //console.log();
            //     var reversed = this.pointsGame[k].map(function reverse(item) {
            //         return Array.isArray(item) && Array.isArray(item[0]) 
            //                    ? item.map(reverse) 
            //                    : item.reverse();
            //     });
            //     this.pointsGame[k]=reversed;
            // });
            // Object.keys(this.additionPerMove).forEach((k) => {
            //     // //console.log();
            //     var reversed = this.additionPerMove[k].map(function reverse(item) {
            //         return Array.isArray(item) && Array.isArray(item[0]) 
            //                    ? item.map(reverse) 
            //                    : item.reverse();
            //     });
            //     this.additionPerMove[k]=reversed;
            // });
            // //console.log(this.pointsGame);
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
        material: function(gm=this.game,movesme,movesopp) {
        let val=0;
        let cols="abcdefgh";
        let rows="12345678";
        [...rows].forEach(row=> {
            [...cols].forEach(col=> {
                let cell=gm.get(col+row);
                    switch (cell.type) {
                        case "r":
                            cell.color==this.color?val+=50:val-=50;
                            break;
                        case "b":
                            cell.color==this.color?val+=33:val-=33;
                            break;
                        case "n":
                            cell.color==this.color?val+=32:val-=32;
                        case "q":
                            cell.color==this.color?val+=90:val-=90;
                            break;
                        case "p":
                            cell.color==this.color?val+=10:val-=10;
                            break;
                        default:
                            break;
                    }
                });
        //         // gm.isAttacked(col+row,this.color)?val++:val==val;
        //         // gm.isAttacked(col+row,this.opponent)?val--:val==val;
            
            });
            return val;
        },

        safety: function(gm=this.game,movesme,movesopp) {
            let val=0;
            let cols="abcdefgh";
            let rows="12345678";
            [...rows].forEach(row=> {
            [...cols].forEach(col=> {
                let cell=gm.get(col+row);
                if (cell) {
                    cell.color==this.color?val++:val--;
                    // if (cell.color==this.color) {
        //                 // //console.log(gm.moves({square:col+row}).length);
                        val+=movesme.filter(item=>{
                            if (item.to==col+row) return item;
                        }).length;
                    // } else {
                        val-=movesopp.filter(item=>{
                            if (item.to==col+row) return item;
                        }).length;
                    // }
                }
            });
            
            });
            return val;
        },

        kingProtection: function(gm=this.game,color=this.color,move,fen,movesme,movesopp) {
            let val=0;
         /** 
                 3. Protect your king: Make sure your king is safe and not vulnerable to attacks from your opponent's pieces.
            **/
            const get_piece_positions = (game, piece) => {
            return [].concat(...game.board()).map((p, index) => {
                if (p !== null && p.type === piece.type && p.color === piece.color) {
                return index
                }
            }).filter(Number.isInteger).map((piece_index) => {
                const row = 'abcdefgh'[piece_index % 8]
                const column = Math.ceil((64 - piece_index) / 8)
                return row + column
            })
            }
            let king={
                type:"k",
                color:this.color
            }

            let kingo= {
                type:"k",
                color:this.opponent
            }

            let posK=get_piece_positions(gm,king)[0];
            let posKo=get_piece_positions(gm,kingo)[0];
            
            let cols=["a","b","c","d","e","f","g","h"];
            let rows=["1","2","3","4","5","6","7","8"];

            let sqArroundKing=[];

            
            if (cols[cols.indexOf(posK[0])-1]) sqArroundKing.push(cols[cols.indexOf(posK[0])-1]+posK[1]);
            if (cols[cols.indexOf(posK[0])+1]) sqArroundKing.push(cols[cols.indexOf(posK[0])+1]+posK[1]);
            
            if (rows[rows.indexOf(posK[1])-1]&&cols[cols.indexOf(posK[0])-1]) sqArroundKing.push(cols[cols.indexOf(posK[0])-1]+rows[rows.indexOf(posK[1])-1]);
            if (rows[rows.indexOf(posK[1])-1]) sqArroundKing.push(posK[0]+rows[rows.indexOf(posK[1])-1]);
            if (rows[rows.indexOf(posK[1])-1]&&cols[cols.indexOf(posK[0])+1]) sqArroundKing.push(cols[cols.indexOf(posK[0])+1]+rows[rows.indexOf(posK[1])-1]);

            if (rows[rows.indexOf(posK[1])+1]&&cols[cols.indexOf(posK[0])-1]) sqArroundKing.push(cols[cols.indexOf(posK[0])-1]+rows[rows.indexOf(posK[1])+1]);
            if (rows[rows.indexOf(posK[1])+1]) sqArroundKing.push(posK[0]+rows[rows.indexOf(posK[1])+1]);
            if (rows[rows.indexOf(posK[1])+1]&&cols[cols.indexOf(posK[0])+1]) sqArroundKing.push(cols[cols.indexOf(posK[0])+1]+rows[rows.indexOf(posK[1])+1]);

            sqArroundKing.push(posK);

            let sqArroundOpponentKing=[];

            if (cols[cols.indexOf(posKo[0])-1]) sqArroundKing.push(cols[cols.indexOf(posKo[0])-1]+posKo[1]);
            if (cols[cols.indexOf(posKo[0])+1]) sqArroundKing.push(cols[cols.indexOf(posKo[0])+1]+posKo[1]);
            
            if (rows[rows.indexOf(posKo[1])-1]&&cols[cols.indexOf(posKo[0])-1]) sqArroundKing.push(cols[cols.indexOf(posKo[0])-1]+rows[rows.indexOf(posKo[1])-1]);
            if (rows[rows.indexOf(posKo[1])-1]) sqArroundKing.push(posKo[0]+rows[rows.indexOf(posKo[1])-1]);
            if (rows[rows.indexOf(posKo[1])-1]&&cols[cols.indexOf(posKo[0])+1]) sqArroundKing.push(cols[cols.indexOf(posKo[0])+1]+rows[rows.indexOf(posKo[1])-1]);

            if (rows[rows.indexOf(posKo[1])+1]&&cols[cols.indexOf(posKo[0])-1]) sqArroundKing.push(cols[cols.indexOf(posKo[0])-1]+rows[rows.indexOf(posKo[1])+1]);
            if (rows[rows.indexOf(posKo[1])+1]) sqArroundKing.push(posKo[0]+rows[rows.indexOf(posKo[1])+1]);
            if (rows[rows.indexOf(posKo[1])+1]&&cols[cols.indexOf(posKo[0])+1]) sqArroundKing.push(cols[cols.indexOf(posKo[0])+1]+rows[rows.indexOf(posKo[1])+1]);

            sqArroundOpponentKing.push(posKo);

            // let mvs=movesme.filter((obj)=>{return obj.to});

            sqArroundKing.forEach((sq)=>{
                let p=gm.get(sq);
                if (p&&p.color==this.color) val++;
                if (p&&p.color==this.opponent) val--;
                val+=movesme.filter((item)=>{
                    if (item.to==sq) return item;
                }).length;
                val-=movesopp.filter((item)=>{
                    if (item.to==sq) return item;
                }).length;
                // if (gm.isAttacked(sq,this.opponent)) val--;

            });

            sqArroundOpponentKing.forEach((sq)=>{
                let p=gm.get(sq);
                if (p&&p.color==this.color) val++;
                if (p&&p.color==this.opponent) val--;
                val+=movesme.filter((item)=>{
                    if (item.to==sq) return item;
                }).length;
                val-=movesopp.filter((item)=>{
                    if (item.to==sq) return item;
                }).length;
            //     // if (gm.isAttacked(sq,this.opponent)) val--;

            });
            return val;
        },

        centerControl: function (gm=this.game,movesme,movesopp) {
            /**
             *Certainly! Here are some of the best criteria to consider for the beginning of a chess game:
                1. Control the center of the board: This is key in the opening, as it allows you to limit your opponent's options and increase your own.
                **/
                let val=0;
                let center=["d4","d5","e4","e5"]
                // let movesme=gm.moves({verbose:true});
                // let movesopp=before.moves({verbose:true});
                let centerForce=0;
                center.forEach((item)=>{
                    gm.get(item).color==this.color&&gm.get(item).type=="p"?centerForce++:centerForce=centerForce;
                    gm.get(item).color==this.color?centerForce++:centerForce=centerForce;
                    // gm.isAttacked(item,this.color)?val++:val=val;
                    gm.get(item).color==this.opponent&&gm.get(item).type=="p"?centerForce--:centerForce=centerForce;
                    gm.get(item).color==this.opponent?centerForce--:centerForce=centerForce;
                    // gm.isAttacked(item,this.opponent)?val--:val=val;
                    let v1=movesme.filter((move)=>{
                        if (move.to==item) return move;
                    }).length;
                    let v2=movesopp.filter((move)=>{
                        if (move.to==item) return move;
                    }).length;
                    centerForce+=v1;
                    centerForce-=v2;
                });
    
                // val+=(2*centerForce); //2 is the weight1
                return centerForce;
        },

        developPieces: function (gm=this.game) {
          let val=0;
          /**
                2. Develop your pieces: Get your pieces out of their starting positions and into the game as quickly as possible. This will help you control more of the board and create more opportunities for tactical play.
            */
            function nthIndexOf(s,needle,n,idx=0) {
                    if (n==1) return s.indexOf(needle,idx+1);
                    return nthIndexOf(s,needle,n-1,s.indexOf(needle,idx+1));
                }
            function findDiff(str1, str2){ 
                let diff= 0;
                    str2.split(',').forEach(function(val, i){
                      if (val != str1.toString().split(',')[i])
                        diff++ ;         
                    });
                    return diff;
                }
            let bStartPos="rnbqkbnr/pppppppp";
            let wStartPos="PPPPPPPP/RNBQKBNR"

            let f=gm.fen();
            let idx=nthIndexOf(f,"/",6);

            let bPos=f.slice(0,nthIndexOf(f,"/",2));
            // //console.log(bPos);
            let wPos=f.slice(idx+1,f.indexOf(" "));
            // //console.log(wPos);
            let wp=[...wPos];
            wPos=[];
            wp.forEach(c=>{
                if (parseInt(c)&&c!="/") {
                    for(let i=0;i<parseInt(c);i++) wPos.push("0");
                } else wPos.push(c);
            });
            let bp=[...bPos];
            bPos=[];
            bp.forEach(c=>{
                if (parseInt(c)&&c!="/") {
                    for(let i=0;i<parseInt(c);i++) bPos.push("0");
                } else bPos.push(c);
            });
            let difw=findDiff(wPos,wStartPos);
            let difb=findDiff(bPos,bStartPos);

            this.color=="w"?val+=difw:val-=difw;
            this.color=="b"?val+=difb:val-=difb;
            return val;  
        },

        rookandPawnMovement: function(gm=this.game,m) {
                         /**
                    4. Don't make too many pawn moves: While it's important to get your pieces out, be careful not to move too many pawns early on. This can weaken your pawn structure and make it harder to defend your pieces later in the game.
                **/
               let val=0;
                    let hist=this.game.history();
                    // //console.log(hist);
                    hist.push(m);
                    
                    let me=0;
                    if (this.color=="b") me=1;
                    let s=-2;
                    let s1=-2;
                    s+=hist.filter((it,index)=>{
                        if (index%2==me&&!it.match("^[kqrnbKQRNB]x?[a-h]([1-8]?)x?([a-h]?)([1-8]?)")) {
                            return it;   
                        }
                    }).length;
                    s1+=hist.filter((it,index)=>{
                        if (index%2==(1-me)&&!it.match("^[kqrnbKQRNB]x?[a-h]([1-8]?)x?([a-h]?)([1-8]?)")) {
                            return it;   
                        }
                    }).length;
                    val-=s;
                    val+=s1;
                    // //console.log(s);
                    // //console.log(s1);
                    if (m=="O-O"||m=="O-O-O") {
                        gm.turn()==this.color?val++:val--;
                    }
                    return val;
        },

        midgameEval: function(gm=this.game,color,move,fen,movesme,movesopp) {
            
        let val=0;
        // val+=1*this.kingActivity(movesme,movesopp);
        // //console.log(this.c_centerControl);
        // //console.log(this.c_developPieces);
        // //console.log(this.c_kingProtection);
        // //console.log(this.c_rookandPawnMovement);
        // //console.log(this.c_material);
        // //console.log(this.c_safety);
        // //console.log(this.ce_kingActivity);
        // //console.log(this.ce_material);
        // //console.log(this.ce_passedPawns);
        // //console.log(this.ce_safety);
        // //console.log(this.ce_kingProtection);
        val+=this.c_centerControl*this.centerControl(gm,movesme,movesopp);
        val+=this.c_developPieces*this.developPieces(gm);
        val+=this.c_kingProtection*this.kingProtection(gm,this.color,move,fen,movesme,movesopp);
        val+=this.c_rookandPawnMovement*this.rookandPawnMovement(gm,move);
        val+=this.c_material*this.material(gm,movesme,movesopp);
        val+=this.c_safety*this.safety(gm,movesme,movesopp);
           
        return val;

        },

        kingActivity: function (movesme, movesop) {
            /**
             * 
            1. King activity: In the end game, the king becomes a powerful piece that can help control the board and support your other pieces. Make sure your king is active and not stuck on one side of the board.
            */
            let val=0;
            val+=movesme.filter(p=>p.type=="k").length;
            // gm.move(move);
            val-=movesop.filter(p=>p.type=="k").length;
            return val;
        },

        passedPawns: function (gm=this.game,movesme,movesop) {
          /**   3. Piece coordination: In the end game, the coordination of your pieces becomes even more important. Make sure your pieces are working together effectively and are supporting each other.
            */
           let val=0;
           let columns="abcdefgh";
           let rows="12345678";
            [...columns].forEach(col=>{
                [...rows].forEach(row=>{
                    let sq=gm.get(col+row);
                    if (sq) {
                        if (sq.type=="p"&&sq.color=="w") {
                            let a=0;
                            for (let i=row;i<=8;i++) {
                                if (!gm.get(col+i)) a=1; else {
                                    a=0;
                                    break;
                                }
                            }
                            this.color=="w"?val+=a:val-=a;
                        }

                        if (sq.type=="p"&&sq.color=="b") {
                            let a=0;
                            for (let i=row;i>0;i--) {
                                if (!gm.get(col+i)) a=1;
                                else {
                                    a=0;
                                    break;
                                }
                            }
                            this.color=="b"?val+=a:val-=a;
                        }
                    val+=movesme.filter(m=>m.to==col+row).length;
                    val-=movesop.filter(m=>m.to==col+row).length;
                    }
                })
            });
            return val;
        },

        endgameEval: function(gm=this.game,color=this.color,move,fen,movesme,movesop) {
            
            let val=0;
            val+=this.ce_kingActivity*this.kingActivity(movesme,movesop);
            val+=this.ce_kingProtection*this.kingProtection(gm,this.color,move,fen,movesme,movesop);
            val+=this.ce_passedPawns*this.passedPawns(gm,movesme,movesop);
            val+=this.ce_material*this.material(gm,movesme,movesop);
            val+=this.ce_safety*this.safety(gm,movesme,movesop);
            return val;

        },

        calculateBest: function(move,fen,gm=this.game,color=this.color) {
            var value=0;
            var maxGain=-1000000;
            var bestMove="";
            gm.moves().forEach((m)=> {
                    var tempGame=new Chess(gm.fen());
                    tempGame.move(m);
                    if (tempGame.turn()==this.opponent) {
                        // if (tempGame.in_check()) value=this.checkScore;
                        if (tempGame.isCheckmate()) value=Number.POSITIVE_INFINITY;
                    }
                    if (tempGame.turn()==this.color) {
                        // if (tempGame.in_check()) value=-this.checkScore;
                        if (tempGame.isCheckmate()) value=Number.NEGATIVE_INFINITY;
                    }
                    // var col=0;
                    // this.pointsGame.p.forEach((rowPoints)=>{
                    //     var row=0;
                    //     rowPoints.forEach((point)=>{
                    //         var piece=tempGame.get(this.rows[row]+this.columns[col]);
                    //         if (piece!=null) {
                    //             if (piece.color==color) {
                    //                 value+=this.piecePoints[piece.type]*this.pointsGame[piece.type][row][col];
                    //             } else {
                    //                 value-=this.piecePoints[piece.type]*this.pointsGame[piece.type][row][col];
                    //             }
                    //         }
                    //         row++;
                    //     });
                    //     col++;
                    // });
                    value=this.midgameEval();
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
                    if (tempGame.isCheckmate()) {
                        value=Number.POSITIVE_INFINITY;
                        return value;
                    }
                }
                if (tempGame.turn()==this.color) {
                    // if (tempGame.in_check()) value=-this.checkScore;
                    if (tempGame.isCheckmate()) {
                        value=Number.NEGATIVE_INFINITY;
                        return value;
                    } 
                }

                // if (MEMORY[this.fen]!==undefined) {
                //     if (MEMORY[this.fen][move]!==undefined) {
                //         //console.log("move found");
                //         value+=MEMORY[this.fen][move];
                //     }
                // } else {
                // if (increase) value+=this.checkScore;
                // var col=0;
                //     this.pointsGame.p.forEach((rowPoints)=>{
                //         var row=0;
                //         rowPoints.forEach((point)=>{
                //             var piece=tempGame.get(this.rows[row]+this.columns[col]);
                //             if (piece) {
                //                 if (piece.color==color) {
                //                     value+=this.piecePoints[piece.type]*this.pointsGame[piece.type][row][col];
                //                 } else {
                //                     value-=this.piecePoints[piece.type]*this.opointsGame[piece.type][row][col];
                //                 }
                //             }
                //             row++;
                //         });
                //         col++;
                //         });
                // }

                // tempGame.move(move);
                // let moves=tempGame.moves();
                // let kMoves=0;
                // moves.forEach(m=>{
                //     if (m.indexOf("k")!=-1||m.indexOf("K")!=-1) {
                //         kMoves++;
                //     }
                // })
                // value-=(kMoves/8);
                value=this.midgameEval();
                return value;
            // }).setOutput([1,1]);
            // //console.log(tis.game.board());
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
            //console.log(changeDepth);
            // let depth=this.depth+1;
            // let tr=[...this.movetree];
            // //console.log(this.getDim(tr));
            // // let depth=this.depth;
            // while(true) {
            //     this.reduceMoveTreeMaxMin();
            //     let tree=[...this.movetree];
            //     if (this.getDim(tree).length==1) break;
            // }
            // if (MEMORY[this.fen]!=undefined) {
            //     this.actualMoves=Object.keys(MEMORY[this.fen])
            //     let points=[];
            //     Object.keys(MEMORY[this.fen]).forEach((move)=>{
            //         points.push(MEMORY[this.fen][move]);
            //     });
            //     let val = points.reduce(function(a, b) {
            //         return Math.max(a, b);
            //     }, Number.NEGATIVE_INFINITY);
            //     // //console.log(val);
            //     this.movetree=[];
            //     for(let i=0;i<changeDepth;i++) {
            //         if (this.actualMoves.length>1) {
            //             this.actualMoves.splice(points.indexOf(val),1);
            //             points.splice(points.indexOf(val),1);
            //             val=points.reduce(function(a, b) {
            //             return Math.max(a, b);
            //             }, Number.NEGATIVE_INFINITY);
            //         } else {
            //             break;
            //         }
            //     }
            //     // //console.log(this.actualMoves.length);
            //     if (this.actualMoves.length>=1) return this.actualMoves[points.indexOf(val)];
            //     else 
                this.calcMoves();
            // }

            let treeTemp=[...this.movetree];
            // //console.log("points length:",treeTemp.length);
            this.actualMoves=this.game.moves();
            // //console.log("moves length:",this.actualMoves.length);
            this.actualMoves.forEach((m,idx)=>{
                // if (m.indexOf("+")!=-1) {
                //     treeTemp[idx]+=this.checkScore;
                //     // this.checkScore*=2;
                //     }
                if (m.indexOf("#")!=-1) treeTemp[idx]=Number.POSITIVE_INFINITY;
            });
            // //console.log(tree);
            let val = treeTemp.reduce(function(a, b) {
                return Math.max(a, b);
            }, Number.NEGATIVE_INFINITY);
            // //console.log(val);
            this.movetree=[];
            // //console.log(this.actualMoves);
            for(let i=0;i<changeDepth;i++) {
                if (this.actualMoves.length>1) {
                    this.actualMoves.splice(treeTemp.indexOf(val),1);
                    treeTemp.splice(treeTemp.indexOf(val),1);
                    val=treeTemp.reduce(function(a, b) {
                    return Math.max(a, b);
                    }, Number.NEGATIVE_INFINITY);
                } 
                else {
                    break;
                }
            }
            //console.log(this.actualMoves);
            //console.log(treeTemp);
            //console.log(val);
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

        evaluate: function(gm=this.game,color=this.color,move,fen) {
            let movesme;
            let movesopp;
            let before=new Chess(fen);

            if (gm.turn()==this.color) {
                movesme=gm.moves({verbose:true});
                movesopp=before.moves({verbose:true});   
            } else {
                movesopp=gm.moves({verbose:true});
                movesme=before.moves({verbose:true});   
            }
            let val=0;
            let moveCount=(this.game.history().length+1)/2;
            let coefmidGame=(1-(moveCount/64));
            let coefendGame=(moveCount/64);
            // //console.log(this.midgameEval(gm=this.game,color=this.color,move,fen));
            // //console.log(this.endgameEval(gm=this.game,color=this.color,move,fen));
            // //console.log(coefEndGame);
            // //console.log(coefmidGame);
            // let kingpoint=this.kingProtection(gm,color,move,fen,movesme,movesopp)*0.01;
            // //console.log(kingpoint);
            // let mat=this.materialandSafety(gm,movesme,movesopp);
            // //console.log(coefmidGame);
            val+=(coefmidGame*(this.midgameEval(gm,color,move,fen,movesme,movesopp)));
            val+=(coefendGame*(this.endgameEval(gm,color,move,fen,movesme,movesopp)));
            //(coefendGame*this.endgameEval(gm=this.game,color=this.color,move,fen));
            // //console.log(val);
            return val;
        },

        minMax:function(node=this.game, depth, isMaximizingPlayer, alpha, beta, move, fen) {
            let tempGame=new Chess(node.fen());

            if (this.game.isCheckmate()&&isMaximizingPlayer) return Number.POSITIVE_INFINITY;
            if (this.game.isCheckmate()&&!isMaximizingPlayer) return Number.NEGATIVE_INFINITY;

            if (depth==0)
                return this.evaluate(tempGame,this.color,move,fen);

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
                function coef(a,b) {
                    if (b===0) return 1;
                    if (b===1)
                        return a;
                    else return a*coef(a,b-1);
                }
                let val=this.minMax(tempGame,depth-1,false,Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY,m,f);
                let moveCount=(this.game.history().length+1)/2;
                let coefmidGame=(1-(moveCount/64));
                if (this.color=="w") {
                    if (m.piece=="k"&&m.from=="e1"&&(m.to=="g1"||m.to=="c1")) val+=(1*this.c_rookandPawnMovement*coefmidGame);
                    this.rookCount++;
                }
                else {
                    if (m.piece=="k"&&m.from=="e8"&&(m.to=="g8"||m.to=="c8")) val+=(1*this.c_rookandPawnMovement*coefmidGame);
                    this.rookCount++;
                }
                // //console.log(hist);
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
            if (this.fens[this.fen]!=undefined) this.fens[this.fen]++;
            else {
                this.fens[this.fen]=0;
            }
            // }            
            if (this.game.isCheckmate()&&this.game.turn()==this.color) {
                this.WINNER=false;
                this.LOSER=true;
                this.DRAW=false;
                if (this.color=="w") {
                    ais[this.game.plb].WINNER=true;
                    ais[this.game.plb].LOSER=false;
                    ais[this.game.plb].DRAW=false;
                    //console.log("WINNER:",this.game.plb,"GAME:",games.indexOf(this.game));
                    document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>BLACK WINS</b>";
                }
                if (this.color=="b") {
                    ais[this.game.plw].WINNER=true;
                    ais[this.game.plw].LOSER=false;
                    ais[this.game.plw].DRAW=false;
                    //console.log("WINNER:",this.game.plw,"GAME:",games.indexOf(this.game));
                    document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                }
                //console.log("LOSER:",this.idx,"GAME:",games.indexOf(this.game));
                fin[games.indexOf(this.game)]=true;
                // if (this.game.isGameOver()) {
                // this.sendDatatoMemory();
                clearInterval(this.game.thread);
                return;
                // }
            } else if (this.game.isCheckmate()&&this.game.turn()==this.opponent) {
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
                //console.log("WINNER:",this.idx,"GAME:",games.indexOf(this.game));
                // document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>WHITE WINS</b>";
                fin[games.indexOf(this.game)]=true;
                // this.sendDatatoMemory();
                clearInterval(this.game.thread);
                return;

            } else if (this.game.isDraw()||this.game.isStalemate()||this.game.isThreefoldRepetition()||this.fens[this.fen]>5) {
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
                //console.log("DRAWN:",this.idx,"GAME:",games.indexOf(this.game));
                document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="<b>DRAW</b>";
                fin[games.indexOf(this.game)]=true;
                // this.sendDatatoMemory();
                clearInterval(this.game.thread);
                return;

            } else if (!this.game.isGameOver()&&this.game.turn()==this.color) {
                // if (MEMORY[this.fen]==undefined) this.calcMoves();
                // //console.log(this.movetree);
                // //console.log(this.fen);
                // let m=this.selectMove(this.fens[this.fen]);
                // //console.log(Module);
                if (this.game.history()[this.game.history().length-1]=="o-o"||this.game.history()[this.game.history().length-1]=="o-o-o")
                    Module._enemyRooked();
                if (this.game.history()[this.game.history().length-1]=="O-O"||this.game.history()[this.game.history().length-1]=="O-O-O")
                    Module._enemyRooked();
                //console.log("game index:",games.indexOf(this.game));
                let side=0;
                if (this.color=="b") side=1;
                Module._set_side(side);
                Module._set_Coefs(this.ce_passedPawns2,this.ce_pawnWeaknesses,this.ce_pieceActivity,this.ce_kingPawnShield,
                    this.ce_pieceCoordination,this.ce_material,this.c_pieceSquareTables,this.c_mobility,this.c_kingSafety,
                    this.c_pawnStructure,this.c_pieceCoordination,this.c_material,this.c_rook, this.c_centerControl,this.c_developPieces,this.ce_kingSafety,this.c_movecount, this.ce_rook, this.c_pawnmovement);
                //console.log("moveCount:",this.game.fen(),Math.ceil(this.game.history().length/2));
                let m=Module.ccall("selectBest","string",["string","number"],[this.game.fen(),Math.ceil(this.game.history().length/2)]);
                //console.log(m);
                let mdata={from:m.substring(0,2),to:m.substring(2,4)};
                if (m.length==5) mdata.promotion=m.charAt(4);
                //console.log(m);
                let x=this.game.move(mdata);
                // if (this.color=="w") {
                //     if (m.piece=="k"&&m.from=="e1"&&(m.to=="g1"||m.to=="c1")) this.rookCount++;
                // }
                // else {
                //     if (m.piece=="k"&&m.from=="e8"&&(m.to=="g8"||m.to=="c8")) this.rookCount++;
                // }
                // // if (m.indexOf("o-o")!=-1) this.rookCount+=1;
                // // //console.log(this.movetree);
                // if (m==undefined) {
                //     this.DRAW=true;
                //     if (this.color=="w") {
                //         ais[this.game.plb].DRAW=true;
                //     }
                //     if (this.color=="b") {
                //         ais[this.game.plw].DRAW=true;
                //     }
                //     fin[games.indexOf(this.game)]=true;
                //     clearInterval(this.game.thread);
                //     //console.log("GAME ERROR:",games.indexOf(this.game),"PLAYER:",this.idx);
                //     document.getElementById("info"+games.indexOf(this.game).toString()).innerHTML="ERROR";
                // } else {

                //     // //console.log(m);
                //     // if (m.indexOf("+")!=-1) this.checkScore+=this.checkScoreBase;
                //     this.memData["fen"+(this.countMoves+1).toString()]=this.game.fen();
                //     // //console.log(this.game.fen());
                //     this.memData["move"+(this.countMoves+1).toString()]=m;
                //     this.countMoves++;
                //     this.game.move(m);
                //     // if (this.game.isThreefoldRepetition()) {
                //     //     this.game.undo();
                //     //     //console.log("move changed:",m);
                //     //     m=this.selectMove(true);
                //     //     //console.log("new move",m);
                //     //     this.game.move(m);
                //     // }
                //     this.types.forEach((type) => {
                //         for (var row=0;row<8;row++) {
                //             for(var col=0;col<8;col++) {
                //                 let val1=this.pointsGame[type][row][col];
                //                 let val2=this.opointsGame[type][row][col];
                //                 this.pointsGame[type][row][col]=this.sigmoid(this.inverseSigmoid(val1)+this.additionPerMove[type][row][col]);
                //                 this.opointsGame[type][row][col]=this.sigmoid(this.inverseSigmoid(val2)+this.oadditionPerMove[type][row][col]);
                //             }
                //         } 
                //         // this.piecePoints[type]+=this.pieceAdditionPerMove[type];
                //         // this.checkScore+=this.checkScoreBase;
                //     });
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
                        //console.log(response,err);
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
        // let mpw=[];
        // let mpb=[];
        // let idsb=[];
        // let idsw=[];
        // let elosw=[];
        // let elosb=[];
        // this.ais.forEach((ai)=>{
        //     // if (ai.WINNER) this.matchPoints[ai.idx]+=1.0;
        //     // if (ai.DRAW) this.matchPoints[ai.idx]+=0.5;
        //     ai.game.reset();
        //     if (ai.color=="w") {
        //         idsw.push(ai.idx);
        //         mpw.push(this.matchPoints[ai.idx]);
        //         elosw.push(ai.elo);
        //     }
        //     if (ai.color=="b") {
        //         idsb.push(ai.idx);
        //         mpb.push(this.matchPoints[ai.idx]);
        //         elosb.push(ai.elo);
        //     }
        //     // ids.push(ai.idx);
        // });
        // // //console.log(this.matchPoints);
        // let mpwSorted=[...mpw];
        // let mpbSorted=[...mpb];
        // let eloswSorted=[...elosw];
        // let elosbSorted=[...elosb];
        // mpwSorted.sort(function(a, b){return b - a});
        // mpbSorted.sort(function(a, b){return b - a});
        // elosbSorted.sort(function(a, b){return b - a});
        // eloswSorted.sort(function(a, b){return b - a});
        let lst=[...this.ais];
        lst.sort((a,b)=>{return this.matchPoints[b.idx]-this.matchPoints[a.idx]||b.elo-a.elo;});
        // //console.log(lst);
        let mp=[...this.matchPoints];
        mp.sort((a,b)=>{return b-a;});
        let lstfordrawW=[];
        let lstfordrawB=[];
        let lastX=null;
        let tempW=[];
        let tempB=[];
        mp.forEach((x,i)=>{
            if (lastX==null||x!=lastX) {
                lastX=x;
                if (tempW.length>0) {
                    lstfordrawW.push(tempW);
                }
                if (tempB.length>0) {
                    lstfordrawB.push(tempB);
                }
                tempW=[];
                tempB=[];
            }
            if (x==lastX) {
                lst[i].mp=x;
                lst[i].color=="w"?tempW.push(lst[i]):tempB.push(lst[i]);
            }
            if (i==mp.length-1) {
                lstfordrawW.push(tempW);
                lstfordrawB.push(tempB);
            }
        });
        let tableNo=0;
        // // while(idsw.length>0&&idsb.length>0) {
        //     this.games[tableNo].reset();
            
        //     let index=mpb.indexOf(mpbSorted[0]);
        //     mpb.splice(index,1);
        //     mpbSorted.splice(0,1);
        //     let p1=idsb[index];
        //     this.games[tableNo].plw=p1;
        //     this.ais[p1].game=this.games[tableNo];
        //     this.ais[p1].color="w";
        //     this.ais[p1].opponent="b";
        //     idsb.splice(index,1);

        //     index=mpw.indexOf(mpwSorted[0]);
        //     mpw.splice(index,1);
        //     mpwSorted.splice(0,1);
        //     let p2=idsw[index];
        //     this.games[tableNo].plb=p2;
        //     this.ais[p2].game=this.games[tableNo];
        //     this.ais[p2].color="b";
        //     this.ais[p2].opponent="w";
        //     idsw.splice(index,1);
        //     //console.log(tableNo,"setted macth");
        //     //console.log(p1,"vs",p2);
        //     // this.ais[p2].pointsGame=JSON.parse(JSON.stringify(this.ais[p2].points));
        //     // this.ais[p2].inversePoints(this.ais[p2].pointsGame);
        //     // this.ais[p2].opointsGame=JSON.parse(JSON.stringify(this.ais[p2].pointsGame));
        //     // this.ais[p2].inversePoints(this.ais[p2].opointsGame);
        //     // this.ais[p2].additionPerMove=JSON.parse(JSON.stringify(this.ais[p2].additionPerMove));
        //     // this.ais[p2].inversePoints(this.ais[p2].additionPerMove);
        //     // this.ais[p2].oadditionPerMove=JSON.parse(JSON.stringify(this.ais[p2].additionPerMove));
        //     // this.ais[p2].inversePoints(this.ais[p2].oadditionPerMove);
        //     // this.ais[p1].pointsGame=JSON.parse(JSON.stringify(this.ais[p1].points));
        //     // this.ais[p1].inversePoints(this.ais[p1].pointsGame);
        //     // this.ais[p1].opointsGame=JSON.parse(JSON.stringify(this.ais[p1].pointsGame));
        //     // this.ais[p1].inversePoints(this.ais[p1].opointsGame);
        //     // this.ais[p1].additionPerMove=JSON.parse(JSON.stringify(this.ais[p1].additionPerMove));
        //     // this.ais[p1].inversePoints(this.ais[p1].additionPerMove);
        //     // this.ais[p1].oadditionPerMove=JSON.parse(JSON.stringify(this.ais[p1].additionPerMove));
        //     // this.ais[p1].inversePoints(this.ais[p1].oadditionPerMove);
        //     tableNo++;
        // }
        let index=0;
        lstfordrawW.sort((a,b)=>{return a.elo-b.elo||a.mp-b.mp});
        lstfordrawW.forEach((item,i)=>{
            if (item.length%2!=0) {
                lstfordrawW[i+1].unshift(item[item.length-1]);
                lstfordrawW[i].splice(item.length-1,1);
            }
        });
        lstfordrawB.forEach((item,i)=>{
            if (item.length%2!=0) {
                lstfordrawB[i+1].unshift(item[item.length-1]);
                lstfordrawB[i].splice(item.length-1,1);
            }
        });
        lstfordrawW=lstfordrawW.flat(Infinity);
        lstfordrawB=lstfordrawB.flat(Infinity);
        // //console.log(lstfordrawB);
        for(let i=0;i<size;i++) {
                this.games[tableNo].reset();
                // //console.log(i);
                              
                let p1=lstfordrawB[i].idx;
                // lstfordrawB.splice(index,1);
                this.games[tableNo].plw=p1;
                this.ais[p1].game=this.games[tableNo];
                this.ais[p1].color="w";
                this.ais[p1].opponent="b";
                // idsb.splice(index,1);

                // index=mpw.indexOf(mpwSorted[0]);
                // mpw.splice(index,1);
                // mpwSorted.splice(0,1);
                let p2=lstfordrawW[i].idx;
                // lstfordrawW.splice(i,1);
                this.games[tableNo].plb=p2;
                this.ais[p2].game=this.games[tableNo];
                this.ais[p2].color="b";
                this.ais[p2].opponent="w";
                // idsw.splice(index,1);
                //console.log(tableNo,"setted macth");
                //console.log(p1,"vs",p2);
                tableNo++;
            }
            lstfordrawW=[];
            lstfordrawB=[];
    },
    
    draw:function() {
        // let idsb=[];
        // let idsw=[];
        let ids=[]
        let lst=[...this.ais];
        lst.sort((a,b)=>{return a.elo-b.elo;});
        lst.forEach((ai)=>{
            // if (ai.color=="w") idsw.push(ai.idx);
            // if (ai.color=="b") idsb.push(ai.idx);
            ids.push(ai.idx);
        });

        // let idsTemp=[...this.ids];
        // //console.log(this.ids);
        // //console.log(idsTemp);
        let tableNo=0;
        let index=0;
        while(ids.length>0) {//idsw.length>0&&idsb.length>0) {
            //console.log(tableNo,"setted macth");
            // let index=Math.floor(Math.random()*ids.length);
            this.games[tableNo].reset();
            let p1=ids[index];
            this.games[tableNo].plw=p1;
            this.ais[p1].game=this.games[tableNo];
            this.ais[p1].color="w";
            this.ais[p1].opponent="b";
            ids.splice(index,1);
            let index2=(ids.length-1)-index;
            let p2=ids[index2];
            this.games[tableNo].plb=p2;
            this.ais[p2].game=this.games[tableNo];
            this.ais[p2].color="b";
            this.ais[p2].inversePoints(this.ais[p2].points);
            this.ais[p2].opponent="w";
            ids.splice(index2,1);
            //console.log(p1,"vs",p2);
            tableNo++;
        }
    },
    start: function() {
        // ais[games[0].plw].makeMove();
        games.forEach((game,idx)=>{
            // //console.log("process created",idx);
            // clearInterval(game.thread);
            game.thread=setInterval(()=>{
                ais[game.plw].makeMove();
                ais[game.plb].makeMove();
                boards[idx].setPosition(game.fen(),false);
            },100);
        });
        this.checkForFinish();
    },
    finishedAll: function () {
        let finished=true;
        for(let i=0;i<this.games.length;i++){
            if (!fin[i]) {//&&!datasSent[i]) {
                finished=false;
                break;
            }
        }
        return finished;
    },

    run: function() {
        this.drawSwitzerland();
        this.start();
        // this.checkForFinish();
        //console.log("started...");
        // //console.log(this.ais[0].points);
        // //console.log(this.AiProcedures.tour);
    },
    
    checkForFinish: function () {
        let checkFinish=setInterval(()=>{
            if (this.finishedAll()) {
                this.AiProcedures.calculateNewPoints();
                this.AiProcedures.classifyFitnesses();
                this.ais.forEach((ai)=>{
                    let vals={
                        id:ai.idx,
                        // points:JSON.stringify(ai.defaultPoints),
                        ce_passedPawns:ai.ce_passedPawns2,
                        ce_pawnWeaknesses:ai.ce_pawnWeaknesses,
                        ce_pieceActivity:ai.ce_pieceActivity,
                        ce_kingPawnShield:ai.ce_kingPawnShield,
                        ce_pieceCoordination:ai.ce_pieceCoordination,
                        ce_material:ai.ce_material,
                        ce_kingSafety:ai.ce_kingSafety,
                        c_pieceSquareTables:ai.c_pieceSquareTables,
                        c_mobility:ai.c_mobility,
                        c_kingSafety:ai.c_kingSafety,
                        c_pawnStructure:ai.c_pawnStructure,
                        c_pieceCoordination:ai.c_pieceCoordination,
                        c_rook:ai.c_rook,
                        c_developPieces:ai.c_developPieces,
                        c_centerControl:ai.c_centerControl,
                        c_material:ai.c_material,
                        c_movecount:ai.c_movecount,
                        c_pawnmovement:ai.c_pawnmovement,
                        ce_rook:ai.ce_rook,
                        // additionPerMove:JSON.stringify(ai.defaultAdditionPerMove),
                        // pieceAdditionPerMove:JSON.stringify(ai.pieceAdditionPerMove),
                        // checkScore:ai.checkScoreBase,
                        elo:ai.elo
                    };
                    // //console.log(vals);
                    $.ajax({
                        type: "POST",
                        url: "./saveAi.php",
                        data: vals,
                        dataType: "json",
                        success: function (response) {
                            //console.log(response);
                        }
                    });

                    if (ai.WINNER) this.matchPoints[ai.idx]+=1.0;
                    if (ai.DRAW) this.matchPoints[ai.idx]+=0.5;
                    // this.pointsGame=JSON.parse(JSON.stringify(ai.defaultPoints));
                    // this.additionPerMove=JSON.parse(JSON.stringify(ai.defaultAdditionPerMove));
                    // this.points=JSON.parse(JSON.stringify(ai.defaultPoints));
                    // ai.piecePoints={p:1.0,r:1.0,b:1.0,n:1.0,k:1.0,q:1.0};
                    // ai.checkScore=ai.checkScoreBase;
                    ai.sendData=false;
                    ai.fens={};
                });
                //console.log(this.matchPoints);
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
                //console.log(this.AiProcedures.tour,tourCount,shouldContinue);
                if (this.AiProcedures.tour<tourCount||shouldContinue||contTournament) {//||contTournament) {
                    this.AiProcedures.mutateModels();
                    this.AiProcedures.crossoverModels();
                    // this.ais.forEach(ai=>{
                    //     //console.log(ai.c_centerControl);
                    //     //console.log(ai.c_developPieces);
                    //     //console.log(ai.c_kingProtection);
                    //     //console.log(ai.c_materialandSafety);
                    //     //console.log(ai.c_rookandPawnMovement);
                    //     //console.log(ai.ce_kingActivity);
                    //     //console.log(ai.ce_kingProtection);
                    //     //console.log(ai.ce_materialandSafety);
                    //     //console.log(ai.ce_passedPawns);
                    // });
                    this.drawSwitzerland();
                    // this.draw();
                    let data={};
                    
                    this.ais.forEach((ai,idx)=>{
                        data["elo_"+idx]=ai.elo;
                    });

                    // this.matchPoints.sort((a,b)=>{ return b-a; });

                    $.ajax({
                        method: "POST",
                        url: "../src/yavuz/status.php",
                        data: data
                      })
                        .done(function( msg ) {
                          //console.log("Data Saved: " + msg);
                        });
                        
                    this.start();
                } else {
                    let idx=this.matchPoints.indexOf(val);
                    let elo=this.ais[idx].elo;
                    let rookcount=this.ais[idx].rookCount;
                    document.getElementById("gameCount").innerHTML="Tournament Completed!<br>";
                    document.getElementById("gameCount").innerHTML+="Champion:"+idx.toString()+"<br>Rook Count:"+rookcount.toString()+"<br>";
                    document.getElementById("gameCount").innerHTML+="Elo:"+elo.toString();
                }
                clearInterval(checkFinish);
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