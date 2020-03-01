//动画逻辑

function showNumberWithAnimation(i,j,randNumber){
	 var numberCell = $('#number-cell-'+i+'-'+j);
	 //背景色
	 numberCell.css("background-color",getNumberBackgroundColor(randNumber));
	 //文字颜色
	 numberCell.css("color",getNumberColor(randNumber));
	 //数字
	 numberCell.text(randNumber);
	 numberCell.animate({
		 width:cellSideLength,
		 height:cellSideLength,
		 top:getPosTop(i,j),
		 left:getPosLeft(i,j)
	 },50);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	 var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	 numberCell.animate({
		 top:getPosTop(tox,toy),
		 left:getPosLeft(tox,toy)
	 },200);
	
}
function updateScore(score){
	$("#score").text(score);
}