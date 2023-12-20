<?php
header('Content-type:application/json;charset=utf-8');
$response="ERROR";
if (!empty($_POST)) {
    $p=0;
    if (isset($_POST["WINNER"])&&$_POST["WINNER"]=="true") {
        $p=1;
    }
    if (isset($_POST["LOSER"])&&$_POST["LOSER"]=="true") {
        $p=-1;
    }
    if (isset($_POST["DRAW"])&&$_POST["DRAW"]=="true") {
        $p=0.5;
    }
    $memData=[];
    $count=0;
    while(true) {
        $count++;
        if (isset($_POST["fen".strval($count)])&&isset($_POST["move".strval($count)])) {
            $fen=$_POST["fen".strval($count)];
            $move=$_POST["move".strval($count)];
            $memData[$fen][$move]=$p;
        } else {
            break;
        }
    }
    $strJsonMem="";
    if (file_exists("./memory/memory.json")) {
        $mem=fopen("./memory/memory.json","r+");
        while(true){
            sleep(1);
            $res=flock($mem, LOCK_EX | LOCK_NB, $wouldblock);
            if ($res&&!$wouldblock) break;
        }
        $blocksize=8192;
        $read=0;
        $total=filesize("./memory/memory.json");
        while($read<$total) {
            $strJsonMem.=fread($mem,$blocksize);
            $read+=$blocksize;
        }
        fseek($mem,0);
        ftruncate($mem,0);

        $ArrMem=[];
        if (!empty($strJsonMem)) $ArrMem=json_decode($strJsonMem,true);
        if (!empty($memData))  {
        foreach ($memData as $arena => $key) {
            foreach ($key as $val => $_p) {
                if (isset($ArrMem[$arena]))
                    if (isset($ArrMem[$arena][$val]))
                        $ArrMem[$arena][$val]+=$p;
                    else $ArrMem[$arena][$val]=$p;
                else $ArrMem[$arena][$val]=$p;
                }
            }   
        }
        
        if (empty($ArrMem)&&!empty($memData)) $ArrMem=$memData;

        if (!empty($ArrMem)) {
            $json=json_encode($ArrMem);
            // $mem=fopen("./memory/memory.json","w");
            // while(true) {
            //     $res=flock($mem,LOCK_EX|LOCK_NB,$wouldblock);
                // if ($res&&!$wouldblock) {
            $response=strlen($json);
            $pieces=str_split($json,8192);
            foreach ($pieces as $piece) {
                fwrite($mem,$piece,strlen($piece));
            }
                    // flock($mem,LOCK_UN);
                    // unlink("./memory/memory.json");
                    // rename("./memory/memoryTemp.json","./memory/memory.json");
                    // break;
                // }
                // sleep(1);
            // }
            // fclose($mem);
        } else {
            $response="EMPTY";
        }
        fflush($mem);
        flock($mem,LOCK_UN);
        fclose($mem);
    }
    // $strJsonMem=file_get_contents("./memory/memory.json");
    $response=json_encode($response);
    echo($response);
}
?>