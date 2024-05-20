<?php
header('Content-type:application/json;charset=utf-8');
if (!empty($_POST)) {
    $id=$_POST["id"];
    // $points=$_POST["points"];
    // $additionPerMove=$_POST["additionPerMove"];
    // $checkScore=$_POST["checkScore"];
    $elo=$_POST["elo"];
    // $addPiece=$_POST["pieceAdditionPerMove"];

    $ce_passedPawns=$_POST["ce_passedPawns"];
    $ce_pawnWeaknesses=$_POST["ce_pawnWeaknesses"];
    $ce_pieceActivity=$_POST["ce_pieceActivity"];
    $ce_kingPawnShield=$_POST["ce_kingPawnShield"];
    $ce_pieceCoordination=$_POST["ce_pieceCoordination"];
    $ce_material=$_POST["ce_material"];
    // $c_pieceSquareTables=$_POST["c_pieceSquareTables"];
    $ce_kingSafety=$_POST["ce_kingSafety"];
    $c_mobility=$_POST["c_mobility"];
    $c_kingSafety=$_POST["c_kingSafety"];
    $c_pieceSquareTables=$_POST["c_pieceSquareTables"];
    $c_pawnStructure=$_POST["c_pawnStructure"];
    $c_pieceCoordination=$_POST["c_pieceCoordination"];
    $c_rookandPawnMovement=$_POST["c_rookandPawnMovement"];
    $c_centerControl=$_POST["c_centerControl"];
    $c_developPieces=$_POST["c_developPieces"];
    $c_material=$_POST["c_material"];
    $c_movecount=$_POST["c_movecount"];

    $file=fopen("./BackupYavuz/".$id.".txt","w");
    fwrite($file,"ELO:".$elo."\n");
    fwrite($file,"CE_PASSEDPAWNS:".$ce_passedPawns."\n");
    fwrite($file,"CE_PAWNWEAKNESSES:".$ce_pawnWeaknesses."\n");
    fwrite($file,"CE_PIECEACTIVITY:".$ce_pieceActivity."\n");
    fwrite($file,"CE_KINGPAWNSHIELD:".$ce_kingPawnShield."\n");
    fwrite($file,"CE_PIECECOORDINATION:".$ce_pieceCoordination."\n");
    fwrite($file,"CE_MATERIAL:".$ce_material."\n");
    fwrite($file,"CE_KINGSAFETY:".$ce_kingSafety."\n");
    fwrite($file,"C_PIECESQUARETABLES:".$c_pieceSquareTables."\n");
    fwrite($file,"C_MOBILITY:".$c_mobility."\n");
    fwrite($file,"C_KINGSAFETY:".$c_kingSafety."\n");
    fwrite($file,"C_PAWNSTRUCTURE:".$c_pawnStructure."\n");
    fwrite($file,"C_PIECECOORDINATION:".$c_pieceCoordination."\n");
    fwrite($file,"C_ROOKANDPAWNMOVEMENT:".$c_rookandPawnMovement."\n");
    fwrite($file,"C_CENTERCONTROL:".$c_centerControl."\n");
    fwrite($file,"C_DEVELOPPIECES:".$c_developPieces."\n");
    fwrite($file,"C_MATERIAL:".$c_material."\n");
    fwrite($file,"C_MOVECOUNT:".$c_movecount."\n");
    
    fclose($file);
    $response="OK";
    $response=json_encode($response);
    echo($response);
}
?>