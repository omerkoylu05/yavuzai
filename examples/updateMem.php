<?php
$memData=$POST["memData"];
$result=$POST["result"];

$memData=json_decode($memData,true);
$string = file_get_contents("./memory/memory.json");
$jsonMem = json_decode($string, true);

$turn=0;
foreach ($memData as $key => $value) {
    $turn++;
    $addition=0;
    if ($result=="1/2-1/2") {
        $addition=0.5;
    }
    if ($result=="1-0") {
        if ($turn%2==1) {
            $addition=1;
        } else {
            $addition=-1;
        }
    }

    if ($result=="0-1") {
        if ($turn%2==1) {
            $addition=-1;
        } else {
            $addition=-1;
        }
    }
    $addition=0;
    if (isset($jsonMem[$key])) {
        if (isset($jsonMem[$key][$value])) {
            $jsonMem[$key][$value]+=$addition;
        } else {
            $jsonMem[$key][$value]=$addition;
        }
    } else {
        $jsonMem[$key]=null;
        $jsonMem[$key][$value]=$addition;
    }
}
$strMem=json_encode($jsonMem,true);
$f=fopen("./memory/memory.json","w");
fwrite($f,$strMem);
fclose($f);

echo "updated memory succesfully!";

?>