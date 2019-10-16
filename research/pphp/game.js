// Declare global variable for setLoadImg the game
var loadContainer = document.getElementById('loadContainer');
var loadImg = document.getElementById("loadImg");
var playerForm = document.getElementById("playerForm");
var loadTimeCD = 3000;
// For model prediction
var camera = document.getElementById("playerCamera");
var bgm = document.getElementById("bgm");
var se = document.getElementById("se");
var canvas = document.getElementById("cameraCap");
var context = canvas.getContext("2d");
// For game control
var closeBtn = document.getElementById("closeBtn");
var startBtn = document.getElementById("start");
var timeImg = document.getElementById("gameTimer");
var rpsImg = document.getElementById("rps");
var timeCD = 3200;
// For game result
var dialog;
var fightTxt = document.getElementById("fightTxt");
var rps = new Array([["铁掌", "形意拳", "弹指神通"],	["绵掌", "武当长拳", "参合指"], ["天罗地网", "大伏魔拳", "一阳指"], ["黯然销魂掌", "空明拳", "拈花指"], ["降龙十八掌", "太极拳", "六脉神剑"]],
					[["铁掌", "形意拳", "弹指神通"],	["化骨绵掌", "太祖长拳", "分筋错骨手"], ["寒冰神掌", "破玉拳", "幻阴指"], ["五毒神掌", "七伤拳", "凝血神爪"], ["玄冥神掌", "灵蛇拳", "九阴白骨爪"]]);
var enemy = new Array([["镖头甲", "豪侠乙", "武师丙"], ["宋青书", "张翠山", "俞莲舟"], ["欧阳克", "岳不群", "左冷禅"], ["裘千仞", "成昆", "丁春秋"], ["欧阳锋", "任我行", "慕容复"], ["东方不败"]],
					  [["镖头甲", "豪侠乙", "武师丙"], ["彭连虎", "沙通天", "灵智上人"], ["周伯通", "丘处机", "洪七公"], ["令狐冲", "虚竹", "张无忌"], ["杨过", "萧峰", "郭靖"], ["张三丰"]]);
var fight = new Array(["砰的一声响，重重打中l胸口，跟着喀喇喇几声，肋骨断了几根。",
					  "l道：“好俊的功夫！”话未说毕，口中一股鲜血跟着直喷了出来。",
					  "w手掌扬处，砰砰两声，l应声倒地",
					  "w一掌拍出，击在l脑袋右侧，登时泥尘纷飞，地下现出一坑"],
					  ["w拳锋尚未相触，已发出噼噼啪啪的轻微爆裂之声",
					  "l吃了一惊，不敢硬接",
					  "l不及阻挡，身受重伤"],
					  ["只听得嗤嗤两响，两粒小石子射将过来，带着破空之声，直冲l穴道",
					  "两指相触，l只觉右臂一震，全身发热，腾腾腾退出五六步"],
					  ["w虽然受伤，仍非片刻之间能被制服",
					  "l凝神拆招，觉得对方不可轻视"]);
var gameHistory = new Array();
var playerID;
var diff;
var stand;
var standShift;
var spy;
var cpu; // the choice made by the computer

var playerHp;
var totPlayerHp;
var enemyHp;
var totEnemyHp;

var enemyLv;
var enemyIndex;

var playerCombo;
var enemyCombo;

var dialogX;
var dialogY;

function switchBtn(str, fun){
	startBtn.src = "img/" + str + ".png";
	document.querySelector('#start').addEventListener('mouseover', function(){
		this.src = 'img/' + str + '_act.png';
	});
	document.querySelector('#start').addEventListener('mouseout', function(){
		this.src = 'img/' + str + '.png';
	});
	startBtn.onclick = fun;
}

// Loading pop up images
function setLoadImg(n){
	loadContainer.style.display = "block";
	if (n == 0){
		closeBtn.style.display="none";
		loadImg.src = "img/loading.gif";
		bgm.pause();
		bgm.src = "bgm/start_bgm.mp3";
		bgm.volume = 0.1;
		bgm.play();
	}
	else if(n == 1){
		closeBtn.style.display="block";
		loadImg.src = "img/lose.jpg";
		bgm.pause();
		bgm.src = "bgm/lose.mp3";
		bgm.play();
	}
	else if(n == 2){
		closeBtn.style.display="block";
		loadImg.src = "img/win.jpg";
		bgm.pause();
		bgm.src = "bgm/win.mp3";
		bgm.play();
	}
}

function closeImg(){
	document.getElementById('loadContainer').style.display='none';
	bgm.pause();
}

function loadCountDown(){
	if (loadTimeCD > 0){
		setTimeout(loadCountDown, 1000);
		console.log(loadTimeCD);
	}
	else {
		loadContainer.style.display = "none";
		playerForm.style.display = "block";
	}
	loadTimeCD -= 1000;
}

// Control difficulty and hp
function setDifficulty(li){
	document.getElementById("diff").value = li.innerHTML;
	document.getElementById("diffTxt").innerHTML = li.innerHTML;
}

function setStand(li){
	document.getElementById("stand").value = li.innerHTML;
	document.getElementById("standTxt").innerHTML = li.innerHTML;
}

function healPlayer(){
	if (diff == "无名小卒"){
		playerHp += 15;
	}
	if (diff == "声名鹊起"){
		playerHp += 12;
	}
	if (diff == "技冠群雄"){
		playerHp += 9;
	}
	if (diff == "一代宗師"){
		playerHp += 6;
	}
	if (diff == "震古烁今"){
		playerHp += 3;
	}
	totPlayerHp = playerHp;
}

function setPlayerInfo(){

	playerID = document.getElementById("playerName").value;
	diff = document.getElementById("diff").value;
	stand = document.getElementById("stand").value;
	if (playerID == ''){
		alert("大丈夫行不改姓坐不更名，何需遮遮掩掩！");
		return;
	}
	else {
		if(stand == "嫉恶如仇·侠义典范"){
			stand = 0;
		}
		else if(stand == "率性而为·亦正亦邪"){
			stand = Math.floor(Math.random()*2);
		}
		else if(stand == "魔焰滔天·唯我独尊"){
			stand = 1;
		}
		dialogX = stand * 10;
		healPlayer();
		updateHistory();
	}
	playerForm.style.display = "none";
}

// Load the model and enable start button
async function loadModel(){
	model = await tf.loadModel("https://pphp2019.do.am/model/model.json");
	return "completed";
}

// Compatible functions to initialize the game
function startCamera(){
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream){
			camera.srcObject = stream;
			camera.play();
		});
	}
	else if (navigator.getUserMedia){ // Standard
		navigator.getUserMedia({ video: true }, function(stream){
			camera.src = stream;
			camera.play();
		}, errBack);
	}
	else if (navigator.webkitGetUserMedia){ // WebKit-prefixed
		navigator.webkitGetUserMedia({ video: true }, function(stream){
			camera.src = window.webkitURL.createObjectURL(stream);
			camera.play();
		}, errBack);
	}
	else if (navigator.mozGetUserMedia){ // Mozilla-prefixed
		navigator.mozGetUserMedia({ video: true }, function(stream){
			camera.srcObject = stream;
			camera.play();
		}, errBack);
	}
}

function continueDialog(){
	var temp;
	if(enemyLv >= 5){
		temp = 4;
	}
	else{
		temp = enemyLv;
	}
	dialog = new Array([
							// 正道路线
							"游戏玩法介绍：按下此按钮后，将手放在镜头前面并做出石头，剪刀或布的动作，",
  							"在倒数结束后你将和电脑进行比拼。",
  							"谨记：掌法（布）克制拳法（石头），拳法克制指法（剪刀），指法克制掌法。",
							"每次按下战斗的按钮时，底下的hash将会更新。",
							"0为布，1为石頭，2为剪刀，",
							"在電腦結果顯示以後，可以將電腦的選項用md5 encode，",
							"如果結果與先前的hash一樣则可证明电脑并无作弊。",
  							"为了增添趣味性，制作团队引入了连击系统，",
  							"第一次扣一点气血，第二次三倍伤害，第三次气血直接清空，",
  							"请谨慎思考您的策略。",
  							"第一章：无名小卒",
  							"你自幼喜爱习武，勤练武功，至今已有十余年。",
							"你自信凭借家传武学【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】定能在江湖占一席位。",
  							"自古文无第一，武无第二，于是，你决定闯荡江湖，发掘自己的机缘！",
  							"而你首先面对的第一个对手——",
							"curEnemy" + "：行走江湖可不是小孩子过家家，你还是回家吃奶吧！"],

						   ["preEnemy" + "：少侠果然好功夫，是在下眼拙！",
							"在刚才的比武中，你细心观摩对方的招式，习得了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
							"第二章：声名鹊起",
							"击败" + "preEnemy" + "以后，你的名望更上一层楼，周围的好汉都想与你比试。",
							"但你深知，距离你" + document.getElementById("stand").value + "的理想，这不过只是个开始......",
							"curEnemy" + "：少侠颇有名气，不知可否切磋一二？"],

						   ["preEnemy" + "：你这掌法掌势绵绵不绝，留有后劲，似是武当派的绵掌却又有所不同。",
						    "preEnemy" + "：在下武当" + "preEnemy" + "，不知小兄弟这门掌法师承何处，可有名堂？",
 							playerID + "（暗道）：原来刚才的对手是武当中人，莫非我刚才观摩的武功源自武当？",
							"你决定如实相告，",
							"preEnemy" + "：小兄弟你不过与对手交手片刻便学得我派绵掌的三分神髓，可见你天资过人，不若加入我派。",
							"你欣然答应，武当派以侠义著称，与你秉性不谋而合。",
 							"在" + "preEnemy" + "的指导下，你习得了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
 							"第三章：技冠群雄",
 							"击败" + "preEnemy" + "以后，江湖都知道了武当派又出了一名少侠，",
 							"这些年，你以武当少侠的身份除魔卫道，打败不少邪魔外道。",
							"在这时候，你发现了正道中与魔教勾结的内奸。",
							"curEnemy" + "：只要杀了你，那一切都会无人知晓。"],

						   ["你在搜索" + "preEnemy" + "的遗体时意外发现几本正道的武功秘籍，不难联想到这些秘籍的主人已遭杀害了。",
						   "你翻阅了这些秘籍，习得了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
							"第四章：一代宗师",
							"戳破了" + "preEnemy" + "的阴谋以后，你可谓声名大振，江湖上也有了几分薄面。",
							"你处事公正，得到不少名宿的赞许。",
							"今日你独自外出时，被一个人堵住了。",
							"curEnemy" + "：少侠年纪轻轻便武功高强，可惜，可惜非我魔教中人呐。"],

						   ["preEnemy" + "：咳咳！咳！噗......",
 							"对方是魔教名宿，你们二人交战数天仍不分高下，但拳怕少壮，你凭借充沛的体力击败了" + "preEnemy" + "。",
 							"生死搏斗间，你对武功的见解大有精进，创造了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
							"第五章：震古烁今",
							"击败" + "preEnemy" + "以后，你声名远播四海，正道人士皆以你马首是瞻，共推你为武林盟主。",
							"你决意联盟各派，一鼓作气围剿魔教，一时间从者如云，但魔教亦非毫无反击之力。",
							"为免多造杀孽，你约战魔教教主" + "curEnemy" + "于华山之巅，了结江湖恩怨。",
							"curEnemy" + "：生亦何哀，死亦何苦，熊熊圣火，焚我残躯。"],

						   ["战胜魔教后，你的功绩可谓前无古人。",
							"昔日除魔卫道的理想亦得以完成，",
							"你立于华山之巅，似乎一切都完结了。",
							"结局：" + document.getElementById("stand").value],

							// 正道·潜伏路线 06
						   ["对方内功精深，又兼通正邪两派武功，你自不是他的对手。",
							"事实上，在对方准备运功灭杀你之际，你作下了一个决定——",
							playerID + "：大师武功高强，在下愿痛改前非，为我圣教效犬马之劳！",
							"preEnemy" + "：你这人倒也有趣，武当少侠，不过尔尔。",
							"preEnemy" + "：不过你武功平平，这几本秘籍你好好修习，我会再来找你的。",
							"你翻阅了这些秘籍，习得了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
							"第四章：一代宗师",
							"此事之后，你和" + "preEnemy" + "互相掩护，倒是没让旁人看出破绽。",
							"一天，" + "preEnemy" + "找上了你。",
							"preEnemy" + "：我派长老" + "curEnemy" + "早已背叛圣教，",
							"preEnemy" + "：养兵千日，用之一时，你且去为圣教取其首级，",
							"你别无他法，" + "preEnemy" + "拿捏着你的死穴，也只能乖乖听命。",
							"curEnemy" + "：老夫早知圣教欲杀我而后快，但万万没想到堂堂武当大侠竟是魔教走狗！"],

						   ["preEnemy" + "：咳咳！咳！噗......",
 							"对方是魔教名宿，你们二人交战数天仍不分高下，但拳怕少壮，你凭借充沛的体力击败了" + "preEnemy" + "。",
 							"生死搏斗间，你对武功的见解大有精进，创造了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
							"第五章：震古烁今",
							"击败" + "preEnemy" + "以后，你声名远播四海，连白道盟主" + "preBossEnemy" + "也对你信任有加。",
							"其后" + "preBossEnemy" + "决意联盟各派，一鼓作气围剿魔教，一时间从者如云，但魔教亦非毫无反击之力。",
							"为免多造杀孽，" + "preBossEnemy" + "约战魔教教主" + "curEnemy" + "于华山之巅，了结江湖恩怨。",
							"在大战前夕，" + "keyEnemy" + "找到了你。",
							"keyEnemy" + "：你深得" +  "preBossEnemy" + "信任，明日决战之时，你向" +  "preBossEnemy" + "暗下杀手，必能一举成功。",
							"keyEnemy" + "：届时你便是正道声望最德高望重的大侠，正道必以你马首是瞻！你与教主二分江湖，岂不美哉？",
							"你深知盟主死后你便再没有利用价值，",
							"但无奈若勾结魔教之事暴露后你在江湖必然无立足之地，只好虚与委蛇地应下。",
							"你潜伏与山腰处，只觉二人气息渐弱便运起轻功，奔往山顶。",
							"此时，你只见二人功力平分秋色，但均是强弩之末。",
							"preBossEnemy" + "：" + playerID + "，我们二人约战，左右皆不能近以示公正，你为何私自潜伏于此！",
							"preBossEnemy" + "：罢了，我们二人且联手杀了这厮，一鼓作气消灭魔教！",
							"preBossEnemy" + "自顾自地说着，并没有察觉到你悄悄靠近。"],

						   ["preBossEnemy" + "：若非我错信小人！糊涂啊！",
					   		"说完，仰天一啸，双目圆睁，竟是死不眼闭。",
							"这时，你见" + "curEnemy" + "已无复战之力，杀意自生。",
							"curEnemy" + "：呜哇！",
							"只见他凝聚功力，从口中吐出一口血箭，但你只一轻侧便让了过去。",
							playerID + "：现在，只消杀了他，我就可以继续过我的安稳生活了......",
							"......"],

							["......",
							"你伪装一番，假装二人同归于尽，随后你安插在队伍的亲信鼓动义愤填膺的侠客与魔教余孽全面开战！",
							"结束了，正道与魔教实力相仿，高层战力十去其九，已经无人在德望上能与你并驾齐驱；",
							"魔教方面得知你是卧底的人也被你重点击杀，保证不会有人揭穿你的真实身份。",
							"昔日除魔卫道的理想亦得以完成，",
							playerID + "（暗道）：尽管中间发生了点小插曲，但只要结果达到便足够了。",
							"你立于华山之巅，似乎一切都完结了。",
							"结局：道貌岸然·侠义典范"],

							// 邪派路线 10
						   ["游戏玩法介绍：按下此按钮后，将手放在镜头前面并做出石头，剪刀或布的动作，",
  							"在倒数结束后你将和电脑进行比拼。",
  							"谨记：掌法（布）克制拳法（石头），拳法克制指法（剪刀），指法克制掌法。",
  							"为了增添趣味性，制作团队引入了连击系统，",
  							"第一次扣一点气血，第二次三倍伤害，第三次气血直接清空，",
  							"请谨慎思考您的策略。",
  							"第一章：无名小卒",
  							"你自幼喜爱习武，勤练武功，至今已有十余年。",
							"你自信凭借家传武学【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】定能在江湖占一席位。",
  							"自古文无第一，武无第二，于是，你决定闯荡江湖，发掘自己的机缘！",
  							"而你首先面对的第一个对手——",
							"curEnemy" + "：行走江湖可不是小孩子过家家，你还是回家吃奶吧！"],

						   ["你冷哼一声，踩折对方左手后便扬长而去",
							"你知道，行走江湖如果不心狠手辣，又如何服众。",
 							"在刚才的比武中，你细心观摩对方的招式，习得了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
 							"第二章：声名鹊起",
 							"后来，你暗中传扬击败" + "preEnemy" + "的消息，你的名望更上一层楼，不少人都视你为踏脚石。",
 							"你知道，距离你" + document.getElementById("stand").value + "的理想，这不过只是个开始......",
 							"curEnemy" + "：小子，听说你最近很嚣张啊。"],

 						   ["preEnemy" + "：你这掌法不留余地，招招置对手于死地，好招好招。",
 						    "preEnemy" + "：在下圣教" + "preEnemy" + "，不知小兄弟这门掌法师承何处，可有名堂？",
							"其实你身上的武功不过是从刚才的人身上偷学，你对那人的跟脚亦一无所知。",
							"对方看来只是忌惮我背后的门派，若知道我无依无靠，恐怕立下毒手，迫问秘籍。",
							"你只得推脱是江湖一位老前辈的隔代传人。",
 							"preEnemy" + "：难怪小兄弟虽然年纪轻轻，但武功精妙，原来是韦蝙王的传人。",
							playerID + "：小弟阅历不及大哥，且到小弟寒舍让小弟多多请益。",
 							"preEnemy信以为真，有意结交，不想你在茶水下毒，一命呜呼。",
  							"在" + "preEnemy" + "的身上，你找到了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
							"你将这些功夫融会贯通后，谎称自己是魔教一名已故长老的徒弟，",
							"因你使得一手魔门武功，又在与" + "preEnemy" + "闲谈中套出不少魔教的秘密，魔门中人都没有怀疑。",
  							"第三章：技冠群雄",
  							"这些年，你以魔门新秀的身份活跃于江湖，不少正道人士都被你杀害。",
 							"你行事果断，得到不少名宿的赞许。",
 							"今日你独自外出时，被一个人堵住了。",
 							"curEnemy" + "：少侠年纪轻轻便武功高强，可惜，可惜非我正派中人呐。"],

 						   ["preEnemy" + "：咳咳！咳！噗......",
  							"对方是正派的中流砥柱，你们二人交战数天仍不分高下，但拳怕少壮，你凭借充沛的体力击败了" + "preEnemy" + "。",
  							"生死搏斗间，你对武功的见解大有精进，创造了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
 							"第四章：一代宗师",
 							"击败" + "preEnemy" + "以后，你声名远播四海，魔教人士皆以你马首是瞻。",
 							"在这时候，你发现魔教中与那群伪君子勾结的内奸。",
 							"curEnemy" + "：只要杀了你，那一切都会无人知晓。"],

 						   ["你在搜索" + "preEnemy" + "的遗体时意外发现几本魔道的武功秘籍，不难联想到这些秘籍的主人已遭杀害了。",
						    "你翻阅了这些秘籍，习得了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
						    "第五章：震古烁今",
 							"戳破了" + "preEnemy" + "的阴谋以后，魔教对你信任有加，共推你为新一任教主。",
 							"你决意联盟各派，一鼓作气围剿正道，一时间从者如云，但正道亦非毫无反击之力。",
 							"为免多造杀孽，你约战正道盟主" + "curEnemy" + "于华山之巅，了结江湖恩怨。",
 							"curEnemy" + "：若我败了，切莫为难他们。"],

 						   ["战胜正派后，你的功绩可谓前无古人。",
 							"如今的江湖你可谓只手遮天，只一号令，门下无数人为你奔走。",
 							"你立于华山之巅，似乎一切都完结了。",
 							"结局：" + document.getElementById("stand").value],

							// 邪教·潜伏 16
 						   ["对方内功精深，你自不是他的对手。",
 							"就在你以为自己必死无疑之际，对方却停了下来。",
							"preEnemy" + "：我名门大派虽然光明正大，但亦需要一些在魔门办事的走狗...",
							"你听出对方的弦外之音——",
 							playerID + "：大师武功高强，在下愿痛改前非，从此洗心革面！",
 							"preEnemy" + "：孺子可教。",
 							"preEnemy" + "：不过你武功平平，这几本秘籍你好好修习，我会再来找你的。",
 							"你翻阅了这些秘籍，习得了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
 							"第四章：一代宗师",
 							"一天，" + "preEnemy" + "找上了你。",
 							"preEnemy" + "：我派长老" + "curEnemy" + "早已背叛正道，",
 							"preEnemy" + "：养兵千日，用之一时，你且去为正道取其首级，",
 							"你别无他法，" + "preEnemy" + "拿捏着你的死穴，也只能乖乖听命。",
 							"curEnemy" + "：老夫早知正道欲杀我而后快，但万万没想到原来【翻云覆雨】" + playerID + "竟是正道走狗！"],

 						   ["preEnemy" + "：咳咳！咳！噗......",
  							"对方是正派名宿，你们二人交战数天仍不分高下，但拳怕少壮，你凭借充沛的体力击败了" + "preEnemy" + "。",
  							"生死搏斗间，你对武功的见解大有精进，创造了【" + rps[stand][temp][0] + "】，【" + rps[stand][temp][1] + "】，【" + rps[stand][temp][2] + "】。",
 							"第五章：震古烁今",
 							"击败" + "preEnemy" + "以后，你声名远播四海，连魔教教主" + "preBossEnemy" + "也对你信任有加。",
 							"其后" + "preBossEnemy" + "决意联盟各派，一鼓作气围剿正道，一时间从者如云，但正道亦非毫无反击之力。",
 							"为免多造杀孽，" + "preBossEnemy" + "约战正道盟主" + "curEnemy" + "于华山之巅，了结江湖恩怨。",
 							"在大战前夕，" + "keyEnemy" + "找到了你。",
 							"keyEnemy" + "：你深得" +  "preBossEnemy" + "信任，明日决战之时，你向" +  "preBossEnemy" + "暗下杀手，必能一举成功。",
 							"keyEnemy" + "：届时你便是魔教呼声最高的教主候选人，从此你与盟主二分江湖，岂不美哉？",
 							"你深知教主死后你便再没有利用价值，",
 							"但无奈若勾结正派之事暴露后你在江湖必然无立足之地，只好虚与委蛇地应下。",
 							"你潜伏与山腰处，只觉二人气息渐弱便运起轻功，奔往山顶。",
 							"此时，你只见二人功力平分秋色，但均是强弩之末。",
 							"preBossEnemy" + "：" + playerID + "快，我们二人联手杀了这厮，从此你荣华富贵，享之不尽！",
 							"preBossEnemy" + "自顾自地说着，并没有察觉到你悄悄靠近。"],

 						   ["preBossEnemy" + "：若非我错信小人！糊涂啊！",
 					   		"说完，仰天一啸，双目圆睁，竟是死不眼闭。",
 							"这时，你见" + "curEnemy" + "已无复战之力，杀意自生。",
 							"curEnemy" + "：呜哇！",
 							"只见他凝聚功力，从口中吐出一口血箭，但你只一轻侧便让了过去。",
 							playerID + "：现在，只消杀了他，我就可以继续过我的安稳生活了......",
 							"......"],

 							["......",
 							"你伪装一番，假装二人同归于尽，随后你安插在队伍的亲信鼓动义愤填膺的教徒与正派的侠士全面开战！",
 							"结束了，正道与魔教实力相仿，高层战力十去其九，已经无人在德望上能与你并驾齐驱；",
 							"正道方面得知你是卧底的人也被你重点击杀，保证不会有人揭穿你的真实身份。",
  							"如今的江湖你可谓只手遮天，只一号令，门下无数人为你奔走。",
 							playerID + "（暗道）：尽管中间发生了点小插曲，但只要结果达到便足够了。",
 							"你立于华山之巅，似乎一切都完结了。",
 							"结局：两面三刀·唯我独尊"],

							// 死亡 20
						   ["十年生死两茫茫，",
						    "不思量，自难忘。",
						    "千里孤坟，无处话凄凉。"],

							// 真结局
						   ["战胜魔教后，你的功绩可谓前无古人。",
 							"昔日除魔卫道的理想亦得以完成，",
 							"你立于华山之巅，似乎一切都完结了。",
							"第六章：武林神话",
							"？？？：呵呵，" + "preEnemy" + "不过是我放在门面的傀儡，少侠若是认为天下无人能敌，却是小觑了天下英雄。",
							"东方不败：在下圣教教主——东方不败，请出招！"],

						   ["东方不败：没想到少侠武功出神入化，在下心服口服。",
					   		"未及你追击对方，东方不败便运起轻功，连踏数步离去。",
							"你知道，江湖或许不再安宁。",
							"结局：武林神话·独步天下"],

						   ["......",
							"你伪装一番，假装二人同归于尽，随后你安插在队伍的亲信鼓动义愤填膺的侠客与魔教余孽全面开战！",
							"结束了，正道与魔教实力相仿，高层战力十去其九，已经无人在德望上能与你并驾齐驱；",
							"魔教方面得知你是卧底的人也被你重点击杀，保证不会有人揭穿你的真实身份。",
							"昔日除魔卫道的理想亦得以完成，",
							playerID + "（暗道）：尽管中间发生了点小插曲，但只要结果达到便足够了。",
							"你立于华山之巅，似乎一切都完结了。",
							"第六章：武林神话",
							"？？？：老夫虽然已隐居多年，不想武当派竟然多了个大魔头，杀害正道盟主！",
							"张三丰：老夫武当祖师——张三丰，少侠，请。"],

						   ["张三丰：没想到少侠武功出神入化，老夫心服口服。",
 					   		"未及你追击对方，张三丰便运起轻功，连踏数步离去。",
 							"你知道，江湖或许不再安宁。",
 							"结局：武林神话·独步天下"],

						   ["战胜正派后，你的功绩可谓前无古人。",
  							"如今的江湖你可谓只手遮天，只一号令，门下无数人为你奔走。",
							"第六章：武林神话",
							"？？？：老夫虽然已隐居多年，但若然魔教一统江湖，天下恐怕从此多事。",
							"张三丰：老夫武当祖师——张三丰，少侠，请。"],

						   ["张三丰：没想到少侠武功出神入化，老夫心服口服。",
 					   		"未及你追击对方，张三丰便运起轻功，连踏数步离去。",
 							"你知道，江湖或许不再安宁。",
 							"结局：武林神话·独步天下"],

						   ["......",
						   "你伪装一番，假装二人同归于尽，随后你安插在队伍的亲信鼓动义愤填膺的教徒与正派的侠士全面开战！",
						   "结束了，正道与魔教实力相仿，高层战力十去其九，已经无人在德望上能与你并驾齐驱；",
						   "正道方面得知你是卧底的人也被你重点击杀，保证不会有人揭穿你的真实身份。",
						   "如今的江湖你可谓只手遮天，只一号令，门下无数人为你奔走。",
						   playerID + "（暗道）：尽管中间发生了点小插曲，但只要结果达到便足够了。",
						   "第六章：武林神话",
						   "？？？：呵呵，" + "oppoEnemy" + "不过是我放在门面的傀儡，但打狗还需看主人，少侠恐怕有失礼数。",
						   "东方不败：在下圣教教主——东方不败，请出招！"],

						  ["东方不败：没想到少侠武功出神入化，在下心服口服。",
						   "未及你追击对方，东方不败便运起轻功，连踏数步离去。",
						   "你知道，江湖或许不再安宁。",
						   "结局：武林神话·独步天下"]);

	if(dialogY < dialog[dialogX].length){
		if(enemyLv < 6){
			dialog[dialogX][dialogY] = dialog[dialogX][dialogY].replace(/curEnemy/g, enemy[stand][enemyLv][enemyIndex[enemyLv]]);
			dialog[dialogX][dialogY] = dialog[dialogX][dialogY].replace(/preBossEnemy/g, enemy[Math.abs(stand - 1)][enemyLv][enemyIndex[enemyLv]]);
			dialog[dialogX][dialogY] = dialog[dialogX][dialogY].replace(/oppoEnemy/g, enemy[Math.abs(stand - 1)][4][enemyIndex[4]]);
		}
		if(enemyLv > 0){
			dialog[dialogX][dialogY] = dialog[dialogX][dialogY].replace(/preEnemy/g, enemy[stand][enemyLv-1][enemyIndex[enemyLv-1]]);
		}
		if(enemyLv > 1){
			dialog[dialogX][dialogY] = dialog[dialogX][dialogY].replace(/keyEnemy/g, enemy[stand][enemyLv-2][enemyIndex[enemyLv-2]]);
		}
		fightTxt.innerHTML = dialog[dialogX][dialogY++];
	}
	if(dialogY == dialog[dialogX].length) {
		dialogY = 0;
		if(dialogX == 5 || dialogX == 9 || dialogX == 15 || dialogX == 19 || dialogX == 20 || dialogX == 22 || dialogX == 24 || dialogX == 26 || dialogX == 28) {
			switchBtn("restart", startGame);
		}
		else {
			showHp();
			switchBtn("start", restart);
		}
	}
}

function startGame(){
	// Load the loading image and bgm
	setLoadImg(0);
	// Add event listeners for playerForm and startBtn
	document.querySelector('#playerFormSubmit').addEventListener('click',function(e){
		e.preventDefault();
	},false);
	switchBtn("continue", continueDialog);
	enemyLv = 0;
	playerHp = 0;
	enemyHp = 3;
	totPlayerHp = 0;
	totEnemyHp = 3;
	enemyIndex = new Array(Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), 0);
	playerCombo = 0;
	enemyCombo = 0;
	loadTimeCD = 3000;
	dialogY = 0;
	gameHistory = new Array();
	standShift = false;
	spy = false;
	hideHp();
	// reset form to default value
	document.getElementById("playerName").value = "";
	document.getElementById("diffTxt").innerHTML = "技冠群雄";
	document.getElementById("diff").value = "技冠群雄";
	document.getElementById("standTxt").innerHTML = "率性而为·亦正亦邪";
	document.getElementById("stand").value = "率性而为·亦正亦邪";
	fightTxt.innerHTML = "华山最大的线上论剑开始了!";

	loadCountDown();
}

// Below are functions to implement rps game"s logic
function startRound(){
	// Main count down logic
	if(timeCD >= 1000){
		setTimeout("startRound()", 1000);
		timeImg.src = "img/time/" + Math.floor(timeCD / 1000) + ".jpg";
	}
	// Buffer time to smooth changes in rps images
	else if (timeCD > 0 && timeCD <= 200){
		setTimeout("startRound()", 200);
		timeImg.src = "img/time/0.jpg";
	}
	// Compute result of the game
	else {
		timeImg.src = "img/vs.jpg";
		rpsImg.src = "img/rps/" + cpu + ".jpg";
		context.drawImage(camera, 0, 0, 300, 150); // ??? not same as specification
		camera.pause();
		showResult(cpu, predict(canvas)); // 0 paper, 1 rock, 2 scissors
		return; // return to avoid predecrement defore countdown
	}
	timeCD -= 1000;
}

// Convert image to model input, then predict player's hand pose
async function predict(canvas){
	var img = tf.fromPixels(canvas); // get image
	img = tf.image.resizeBilinear(img, [224, 224]).toFloat(); // resize
	img = tf.scalar(1.0).sub(img.div(tf.scalar(255.0))); // convert to 0-1
	img = img.expandDims(0); // convert to 4D array
	prob = model.predict(img).dataSync();
	return prob.indexOf(Math.max(...prob)); // return a Promise due to async
}

// Update the statistics after each round
function showHp(){
	var opponent;
	if(enemyLv == 4 && standShift || spy && enemyLv == 5){
		opponent = enemy[Math.abs(stand-1)][enemyLv][enemyIndex[enemyLv]];
	}
	else {
		opponent = enemy[stand][enemyLv][enemyIndex[enemyLv]];
	}
	document.getElementById("playerStat").innerHTML="【" + playerID + "】气血: " + playerHp;
	document.getElementById("enemyStat").innerHTML="【" + opponent + "】气血: " + enemyHp;
	document.getElementById("playerBar").style.width = playerHp / totPlayerHp * 100 + "%";
	document.getElementById("enemyBar").style.width = enemyHp / totEnemyHp * 100 + "%";
	document.getElementById("playerProgress").style.display = "block";
	document.getElementById("enemyProgress").style.display = "block";
}

function hideHp(){
	document.getElementById("playerStat").innerHTML="";
	document.getElementById("enemyStat").innerHTML="";
	document.getElementById("playerProgress").style.display = "none";
	document.getElementById("enemyProgress").style.display = "none";
}

function updateHistory(cpu, player){
	var historyHtml = "";
	var historyCount = gameHistory.length;
	if (historyCount <= 5){
		for (i = historyCount - 1; i >= 0; i--){
			historyHtml += gameHistory[i] + "<br>";
		}
	}
	document.getElementById("history").innerHTML = historyHtml;
	if(historyCount == 5){
		// remove the earliest record
		for (i = 1; i < historyCount; i++){
			gameHistory[i - 1] = gameHistory[i];
		}
	}
}

function checkProceed(){
	if(enemyLv == 5 && enemyHp <= 0){
		setLoadImg(2); //player win
	}
	if(enemyLv == 4 && enemyHp <= 0){
		if(standShift){ // 潜伏路线
			se.src="se/levelUp.mp3";
			standShift = false;
			spy = true;
			enemyHp = 15;
			totEnemyHp = enemyHp;
			healPlayer();
			dialogX += 1;
		}
		else if (document.getElementById("diff").value == "震古烁今"){ // true ending
			se.src="se/levelUp.mp3";
			playerHp = 20;
			enemyHp = 20;
			totEnemyHp = enemyHp;
			if(!spy && stand == 0){
				dialogX = 21;
			}
			else if(spy && stand == 0){
				dialogX = 23;
			}
			else if(!spy && stand == 1){
				dialogX = 25;
			}
			else {
				dialogX = 27;
			}
			enemyLv += 1;
		}
		else {
			setLoadImg(2); //player win
			dialogX += 1;
		}
		playerCombo = 0;
		enemyCombo = 0;
		hideHp();
		switchBtn("continue", continueDialog);
	}
	else if(enemyHp <= 0 || (playerHp <= 0 && enemyLv == 2)){ //player proceed to next round
		se.src="se/levelUp.mp3";
		playerCombo = 0;
		enemyCombo = 0;
		hideHp();
		if(enemyHp <= 0){
			dialogX += 1;
			switchBtn("continue", continueDialog);
			healPlayer();
		}
		else {
			standShift = true;
			switchBtn("continue", continueDialog);
			if(stand == 1){
				dialogX = 16;
			}
			else {
				dialogX = 6;
			}
			playerHp = 12;
			totPlayerHp = 12;
		}
		enemyLv += 1;
		enemyHp = 3 + enemyLv * 3;
		totEnemyHp = enemyHp;
	}
	// player die
	else if (playerHp <= 0){
		setLoadImg(1);
		hideHp();
		switchBtn("continue", continueDialog);
		dialogX = 20;
	}
}

function describeFight(winner, loser, rps){
	r = Math.floor(Math.random()*fight[rps].length);
	txt = fight[rps][r].replace("w", winner);
	txt = txt.replace("l", loser);
	return txt;
}

function showResult(cpu, promise) {
	promise.then(function (player){
		var situation = "NaN";
		var opponent;
		if(enemyLv == 4 && standShift){
			opponent = enemy[Math.abs(stand-1)][enemyLv][enemyIndex[enemyLv]];
		}
		else {
			opponent = enemy[stand][enemyLv][enemyIndex[enemyLv]];
		}
		if (cpu == player){
			situation = describeFight(playerID, opponent, 3);
			playerCombo = 0;
			enemyCombo = 0;
			se.src="se/fight0.mp3";
		}
		else if ((cpu - player == 1) || (player - cpu == 2)){
			situation = describeFight(playerID, opponent, player);
			playerCombo += 1;
			enemyCombo = 0;
			if(playerCombo >= 3){
				enemyHp = 0;
			}
			else if(playerCombo == 2){
				enemyHp -= 3;
			}
			else {
				enemyHp -= 1;
			}
			se.src="se/fight" + playerCombo + ".mp3";
		}
		else{
			situation = describeFight(opponent, playerID, cpu);
			enemyCombo += 1;
			playerCombo = 0;
			if(enemyCombo >= 3){
				playerHp = 0;
			}
			else if(enemyCombo == 2){
				playerHp -= 3;
			}
			else {
				playerHp -= 1;
			}
			se.src="se/fight" + enemyCombo + ".mp3";
		}
		var fightHtml = "<span style=\"float: left; margin: auto auto auto 20px;\">" +
						playerID + ": " + numToRps(0, player) + "</span>" +
						"<span>" + situation + "</span>" +
						"<span style=\"float: right; margin: auto 20px auto auto;\">" +
						opponent + ": " + numToRps(1, cpu) + "</span>";
		fightTxt.innerHTML = fightHtml;
		if(gameHistory.length == 5){
			gameHistory[4] = fightHtml;
		}
		else {
			gameHistory[gameHistory.length] = fightHtml;
		}
		showHp();
		updateHistory(cpu, player);
		checkProceed();
		se.play();
		timeCD = 3200; // reset timer
	})
}

function restart(){
	if (timeCD == 3200){
		rpsImg.src= "img/rps/rps.gif";
		camera.play();
		cpu = Math.floor(Math.random()*3);
		document.getElementById("hash").innerHTML = "hash: " + md5(cpu);
		startRound();
	}
}

function numToRps(role, n){
	if(enemyLv == 5){
		if(role == 0 || enemyLv == 1 || enemyLv == 4 && standShift){
			return rps[stand][enemyLv-1][n];
		}
		return rps[Math.abs(stand-1)][enemyLv-1][n];
	}
	else{
		if(role == 0 || enemyLv == 1 || enemyLv == 4 && standShift){
			return rps[stand][enemyLv][n];
		}
		return rps[Math.abs(stand-1)][enemyLv][n];
	}
}

// Load the model to start the game
x = loadModel();
x.then(function (){
	startGame();
	startCamera();
	fightTxt.innerHTML = "华山最大的线上论剑开始了!";
})
