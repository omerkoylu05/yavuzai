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
    $ce_pieceSquareTables=$_POST["ce_pieceSquareTables"];
    $c_mobility=$_POST["c_mobility"];
    $c_kingSafety=$_POST["c_kingSafety"];
    $c_pieceSquareTables=$_POST["c_pieceSquareTables"];
    $c_pawnStructure=$_POST["c_pawnStructure"];
    $c_pieceCoordination=$_POST["c_pieceCoordination"];
    $c_material=$_POST["c_material"];

    $file=fopen("./BackupYavuz/".$id.".txt","w");
    fwrite($file,"ELO:".$elo."\n");
    fwrite($file,"CE_PASSEDPAWNS:".$ce_passedPawns."\n");
    fwrite($file,"CE_PAWNWEAKNESSES:".$ce_pawnWeaknesses."\n");
    fwrite($file,"CE_PIECEACTIVITY:".$ce_pieceActivity."\n");
    fwrite($file,"CE_KINGPAWNSHIELD:".$ce_kingPawnShield."\n");
    fwrite($file,"CE_PIECECOORDINATION:".$ce_pieceCoordination."\n");
    fwrite($file,"CE_MATERIAL:".$ce_material."\n");
    fwrite($file,"C_PIECESQUARETABLES:".$c_pieceSquareTables."\n");
    fwrite($file,"C_MOBILITY:".$c_mobility."\n");
    fwrite($file,"C_KINGSAFETY:".$c_kingSafety."\n");
    fwrite($file,"C_PAWNSTRUCTURE:".$c_pawnStructure."\n");
    fwrite($file,"C_PIECECOORDINATION:".$c_pieceCoordination."\n");
    fwrite($file,"C_MATERIAL:".$c_material."\n");
    
    fclose($file);
    $response="OK";
    $response=json_encode($response);
    echo($response);
}
?>