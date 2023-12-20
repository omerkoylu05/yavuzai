let data={};
for(let i=0;i<40;i++) {
    data["elo_"+i]=Math.floor(1000*Math.random());
}
console.log(data);
$.ajax({
    method: "POST",
    url: "status.php",
    data: data
  })
    .done(function( msg ) {
      console.log("Data Saved: " + msg);
    });