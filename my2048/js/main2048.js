//游戏逻辑
var board = new Array();
var score = 0;//得分
var hasConfilcted = new Array();//判断叠加次数,原版只能叠加一次

var startx = 0,
    starty = 0,
	endx = 0,
	endy = 0;
	
$(document).ready(function(){
	newgame();
	prepareForMobile();
});

function prepareForMobile(){
	
	if(documentWidth>500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}
	$("#grid-container").css("width",gridContainerWidth-2*cellSpace);
	$("#grid-container").css("height",gridContainerWidth-2*cellSpace)
    $("#grid-container").css("padding",cellSpace);
	$("#grid-container").css("border-radius",0.02*gridContainerWidth);
	
	$(".grid-cell").css("width",cellSideLength);
	$(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02*cellSideLength);
}
function newgame(){
	//初始化棋盘格
	init();
	
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i = 0;i<4;i++){
		for(var j = 0;j<4;j++){
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}
	
	for(var i = 0;i<4;i++){
		board[i]=new Array();
		hasConfilcted[i] = new Array();
		for(var j = 0;j<4;j++)
			board[i][j]=0;
		    hasConfilcted[i][j]=false;
	}
	
	updateBoardView();
	
	score = 0;
}

function updateBoardView(){
	$(".number-cell").remove();
	
	for(var i= 0;i<4;i++)
	for(var j= 0;j<4;j++){
		$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
	    var theNumberCell = $('#number-cell-'+i+'-'+j);
	    
		if(board[i][j]==0){
			theNumberCell.css("width","0px");
			theNumberCell.css("height","0px");
			theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
			theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
		}
		else{
			theNumberCell.css("width",cellSideLength);
			theNumberCell.css("height",cellSideLength);
			theNumberCell.css("top",getPosTop(i,j));
			theNumberCell.css("left",getPosLeft(i,j));
			//背景色
			theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
		    //文字颜色
			theNumberCell.css("color",getNumberColor(board[i][j]));
		    //数字
			theNumberCell.text(board[i][j]);
		}
		
		hasConfilcted[i][j] = false;
	}
	
	 $(".number-cell").css("line-height",cellSideLength+"px");
      $(".number-cell").css("font-size",0.6*cellSideLength+"px");
}
function generateOneNumber(){
	//没有空间生成数字
	if(nospace(board)){
		return false;
	}
	
	//随机一个位置
	var randx = Math.round(Math.random()*3);
	var randy = Math.round(Math.random()*3);
	
	var times = 0;
	//判断生成的随机位置上是否已存在
	while(times<50){
		if(board[randx][randy]==0)
			break;
			
		var randx = Math.round(Math.random()*3);
		var randy = Math.round(Math.random()*3);
		
		times++;
	}
	
	if(times==50){//跳出循环还没有找到这个位置
		for(var  i =0;i<4;i++)
		for(var j=0;j<4;j++){
			if(board[i][j]==0){
				randx = i;
				randy = j;
			}
		}
	}
	 
	//随机一个数字
	var randNumber = Math.random()<0.5?2:4;
	
	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	
	return true;
}

$(document).keydown(function(ev){
	if(ev.which==37){//往左
		if(moveLeft()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
	}
	else if(ev.which==38){//往上
		if(moveUp()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
		
		}
	else if(ev.which==39){//往右
		if(moveRight()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
	}
	else if(ev.which==40){//往下
		if(moveDown()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
	}
	
});

document.addEventListener("touchstart",function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
	
});

document.addEventListener("touchend",function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
    var deltax = endx-startx;
	var deltay = endy - starty;//记录向量
	
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){
			//move right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
		else{
			//move left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}
	//y
	else{
		if(deltay>0){
			//move down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
		else{
			//move up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}

});

function moveLeft(){
	
	if(!canMoveLeft(board)){
		return false;
	}
	//moveLeft
	for(var i  = 0;i<4;i++)
	for(var j = 1 ;j<4;j++){
		if(board[i][j]!=0){
			for(var k  = 0;k<j;k++){//左侧的所有
				if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)&&!hasConfilcted[i][k]){
					//move
					showMoveAnimation(i,j,i,k);
					board[i][k] = board[i][j];
					board[i][j]=0;
					continue;
				}
				else if(board[i][j]==board[i][k]&&noBlockHorizontal(i,k,j,board)){
					//move
					showMoveAnimation(i,j,i,k);
					//add
					board[i][k] += board[i][j];
					board[i][j]=0;
					score += board[i][k];
					updateScore(score);
					hasConfilcted[i][k] = true;
					continue;
				}
			}
			
			
			}
		}
		setTimeout("updateBoardView()",200);
     return true;
}

function moveUp(){
	
	if(!canMoveUp(board)){
		return false;
	}
	//moveUp
	for(var j = 0 ;j<4;j++)
	for(var i = 1;i<4;i++){
		if(board[i][j]!=0){
			for(var k  = 0;k<i;k++){//上侧的所有
				if(board[k][j]==0 && noBlockVertical(j,k,i,board)&&!hasConfilcted[k][j]){
					//move
					showMoveAnimation(i,j,k,j);
					board[k][j] = board[i][j];
					board[i][j]=0;
					continue;
				}
				else if(board[i][j]==board[k][j]&&noBlockVertical(j,k,i,board)){
					//move
					showMoveAnimation(i,j,k,j);
					//add
					board[k][j] += board[i][j];
					board[i][j]=0;
					score += board[k][j];
					updateScore(score);
					hasConfilcted[k][j] = true;
					continue;
				}
			}
			
			
			}
		}
		setTimeout("updateBoardView()",200);
     return true;
}

function moveRight(){
	
	if(!canMoveRight(board)){
		return false;
	}
	//moveRight
	for(var i  = 0;i<4;i++)
	for(var j = 2 ;j>=0;j--){
		if(board[i][j]!=0){
			for(var k  = 3;k>j;k--){//右侧的所有
				if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)&&!hasConfilcted[i][k]){
					//move
					showMoveAnimation(i,j,i,k);
					board[i][k] = board[i][j];
					board[i][j]=0;
					continue;
				}
				else if(board[i][j]==board[i][k]&&noBlockHorizontal(i,k,j,board)){
					//move
					showMoveAnimation(i,j,i,k);
					//add
					board[i][k] += board[i][j];
					board[i][j]=0;
					score += board[i][k];
					updateScore(score);
					hasConfilcted[i][k] = true;
					continue;
				}
			}
			
			
			}
		}
		setTimeout("updateBoardView()",200);
     return true;
}

function moveDown(){
	
	if(!canMoveDown(board)){
		return false;
	}
	//moveDown
	for(var j = 0 ;j<4;j++)
	for(var i = 2;i>=0;i--){
		if(board[i][j]!=0){
			for(var k  = 3;k>i;k--){//下侧的所有
				if(board[k][j]==0 && noBlockVertical(j,i,k,board)&&!hasConfilcted[k][j]){
					//move
					showMoveAnimation(i,j,k,j);
					board[k][j] = board[i][j];
					board[i][j]=0;
					continue;
				}
				else if(board[i][j]==board[k][j]&&noBlockVertical(j,i,k,board)){
					//move
					showMoveAnimation(i,j,k,j);
					//add
					board[k][j] += board[i][j];
					board[i][j]=0;
					score += board[k][j];
					updateScore(score);
					hasConfilcted[k][j] = true;
					continue;
				}
			}
			
			
			}
		}
		setTimeout("updateBoardView()",200);
     return true;
}

function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
	
}

function gameover(){
	alert("game over");
}

