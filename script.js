
$(function() {

	var currentView = 'home';//'home','note-view','trash-view','archive-view'
	var currentNote = -1;
	var notes = new Array();
	var archive = new Array(); //for storing archived notes
	var notesIds = new Array(); //store the list of curent ids in the notes
	var trash = new Array();
	var openMenu = 0; //0=none;1=addMenu,2=moremenu
	var tagName = [false,'addMenu','moreMenu'];
	var NoteColor ={
		'default': '#383737',
		'red':'#7d1919',
		'purple':'#7d1976',
		'blue':'#19587d',
		'green':'#197d21',
		'yellow':'#7d7619'
	};
	var hex2Str = {
		'#383737':'default',
		'#7d1919':'red',
		'#7d1976':'purple',
		'#19587d':'blue',
		'#197d21':'green',
		'#7d7619':'yellow'
	};
	var currentNoteBuffer = {
		'archStat':false,
		'color': NoteColor.default
	}
	
	var months = ["January", "February", "March", "April", "May", "June",
	 "July", "August", "September", "October", "November", "December"];
	

	function Note(){
		this.title = new String();
		this.content = new String();
		this.created = new Date();
		this.edited = new Date();
		this.archStat = false;
		this.color = NoteColor.default;
		}


	var lorem ='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quia eveniet assumenda';
	lorem += ' quo ullam aliquid excepturi ratione aut, itaque nam veritatis ducimus nostrum?';
	lorem += ' Beatae temporibus laudantium consequuntur rem ea aliquid.'

	var sidenavHtml = '<div id="mySidenav" class="sidenav">';
	sidenavHtml +='<a href="javascript:void(0)" class="closebtn">&times;</a>';
  	sidenavHtml +='<a id="homelink" href="#">Notes</a><a id="archivelink" href="#">Archives</a>';
  	sidenavHtml +='<a id="trashlink" href="#">Trash</a>';
  	sidenavHtml += '<a id="fblink" href="#">Feedback</a><a id="abtlink" href="#">About</a></div>';
	
	var searchbarHtml = '<li class="search">';
	searchbarHtml += '<a class="menu" style="cursor:pointer" href="#"><img src="menu.svg"></a>';
	searchbarHtml += '</li>';

	var circleBtnHtml = '<li><div class="circleBtn"><a href="#">+</a></div></li>';

	var addMenuDropUp = '<div id="addMenu" class="dropUp">';
  	addMenuDropUp += '<a id="add-take-photo" href="#"><i class="fi-camera inline-logo"></i>Take a photo</a>';
  	addMenuDropUp += '<a id="add-add-image" href="#"><i class="fi-photo inline-logo"></i>Add image</a>';
  	addMenuDropUp += '<a id="add-drawing" href="#"><i class="fi-pencil inline-logo"></i>Drawing</a>';
 	addMenuDropUp += '<a id="add-record" href="#"><i class="fi-microphone inline-logo"></i>Record</a>';
 	addMenuDropUp += '<a id="add-checkbox" href="#"><i class="fi-checkbox inline-logo"></i>CheckBox</a></div>';
		
	var	moreDropUp = '<div id="moreMenu" class="dropUp">';
	moreDropUp += '<a id="more-delete" href="#"><i class="fi-trash inline-logo"></i>Delete</a>';
  	moreDropUp += '<a id="more-duplicate" href="#"><i class="fi-page-copy inline-logo"></i>Make a copy</a>';
  	moreDropUp += '<a id="more-archive" href="#"><i class="fi-archive inline-logo"></i>archive</a>';
 	moreDropUp += '<span class="colorCircle default" data-color="default" ></span>';
 	moreDropUp += '<span class="colorCircle red" data-color="red" ></span>';
 	moreDropUp += '<span class="colorCircle purple" data-color="purple" ></span>';
 	moreDropUp += '<span class="colorCircle blue" data-color="blue" ></span>';
 	moreDropUp += '<span class="colorCircle green" data-color="green" ></span>';
 	moreDropUp += '<span class="colorCircle yellow" data-color="yellow" ></span></div>';

 	var dropUpContainer = '<div class="dropUpContainer">'+addMenuDropUp + moreDropUp +'</div>';

	var	noteviewhtml = dropUpContainer; 
	noteviewhtml += '<ul id="note-view"	class="flex-col"><li class="top nav" class="flex-row">';
	noteviewhtml +='<a class="back" href="#"><img src="back.svg"></a><a class="trash" href="#"><img src="trash.svg"></a></li>';
	noteviewhtml += '<li id="note-form"><form><input type="text" name="title" placeholder="Title">';
	noteviewhtml += '<textarea name="note" placeholder="enter note" spellcheck="false"></textarea></form></li>';
	noteviewhtml += '<li class="bottom nav"><a class="add" href="#"><img src="plus.svg"></a>';
	noteviewhtml += '<span class="last-mod">Edtied 00:00</span>';
	noteviewhtml +='<a class="more" href="#"><img src="dots.svg"></a></li></ul>';

	
	function Note(){
		this.title = new String();
		this.content = new String();
		this.created = new Date();
		this.edited = new Date();
		this.archStat = false;
		this.color = NoteColor.default;
		}
	
	
	/* for the 3 functions below
	the parameter is a note object that contains the following parameters
	title,note,archived,labels,color,timestamp
	title ,note - Strings
	archived- boolean
	labels = array of stings
	color = string of rgba color value
	timestamp - date object
		}*/

	function creatNewNote(noteObj){
		//this function is called only if one of title or content exists
		var newNote = new Note();
		newNote.title = noteObj.title;
		newNote.content = noteObj.content;
		newNote.created = noteObj.timestamp;
		newNote.edited = noteObj.timestamp;
		newNote.archStat = noteObj.archStat;
		newNote.color = noteObj.color;
		notes.push(newNote);

	}

	function deleteNote(currNoteId){
		var temp = duplicator(notes[currNoteId],true);
		notes.splice(currNoteId,1);
		trash.push(temp);
	}

	function updateNote(noteObj,currNoteId){
		notes[currNoteId].title = noteObj.title;
		notes[currNoteId].content = noteObj.content;
		notes[currNoteId].edited = noteObj.timestamp;
	}

	function makeListItem(instance,i) {
		var title,content,noteColor,feeditem;
		title = instance.title;
		content = instance.content;
		noteColor = instance.color;
		feeditem ='<li id="'+(i+1)+'" class="note" style="background-color:'+noteColor+'"><h6>'+title+'</h6><p>';
		feeditem += content +'</p></li>';
		return feeditem;
	}

	function makeFeed(viewArray){
		//view name can be home,archive,trash
		var ulCode,id,newArray;
		ulCode = '<li class="feed-container"><ul class="feed">';

		if(viewArray.length>0){
			if(currentView == 'home'){
				for(var i = viewArray.length-1 ;i >= 0 ; i--){
					var instance = viewArray[i];
					if(!instance.archStat){
						ulCode += makeListItem(instance,i);
					}
				}
			}
			if(currentView == 'archive-view'){
				for(var i = viewArray.length-1 ;i >= 0 ; i--){
					var instance = viewArray[i];
					if(instance.archStat){
						ulCode += makeListItem(instance,i);
					}
				}
			}
			if(currentView == 'trash-view'){
				for(var i = viewArray.length-1 ;i >= 0 ; i--){
					var instance = viewArray[i];
					ulCode += makeListItem(instance,i);
				}
			}
		}
		else{
			if(currentView == 'home'){
				ulCode += '<li class="note"><h6>Welcome to <span style="color:#11B0D3;">Z</span> Note.</h6><p></p></li>';
			}
			else{
				ulCode += '<li class="note"><h6>This is Empty.</h6><p></p></li>';
			}
		}
		ulCode += '</ul></li>';
		return ulCode;
	}

	function makehomeView(){
		var homeViewHmtl = '<ul id="home-view" class="flex-col">';
		homeViewHmtl += searchbarHtml;
		homeViewHmtl += makeFeed(notes);
		homeViewHmtl += circleBtnHtml;
		homeViewHmtl += '</ul>'
		return homeViewHmtl;
	}

	function makeHome(){
		var $main = $('.main');
		if($main.children()){
				$main.children().remove();

		}
		currentView = 'home';
		var homehtml = '<div class="home">';
		homehtml += sidenavHtml;
		homehtml += makehomeView();
		homehtml += '</div>'
		$main.append(homehtml);
		currentNote = -1;
		$main.hide().fadeIn();
	}
	
	function makeNoteView(noteId){
		var $main = $('.main');
		if($main.children()){
				$main.children().remove();
		}
		$main.append(noteviewhtml);
		currentView = 'note-view';
		if(noteId){
			currentNote = noteId-1;
			var editedObj,editedStr;
			var $textarea = $('textarea');
			var winHight = $(window).height();
			winHight *=0.8;
			$('input:text').val(notes[currentNote].title);
			$textarea.val(notes[currentNote].content); 
			$textarea.css({'height':winHight});
			
			// changing color
			$('form').css({'background-color':notes[currentNote].color});

			//chhanging the archive button to unarch in the more
			if(currentNote != -1 && notes[currentNote].archStat == true){
				$('#more-archive').html('<i class="fi-archive inline-logo"></i>unarchive');
			}
			//changing the last edited
			editedObj = notes[currentNote].edited
			
			editedStr = "Edited "+ editedObj.getHours()+':'+editedObj.getMinutes()+":";
				editedStr += editedObj.getSeconds();
			$('span.last-mod').html(editedStr);
		}
		$main.hide().fadeIn();	
	}

	function makeArchView(){
		var $main = $('.main');
		if($main.children()){
				$main.children().remove();
		}
		currentView = 'archive-view';
		var archhtml = '<div class="archive">';
		archhtml += '<ul id="archive-view" class="flex-col">';
		archhtml +='<li class="top nav" class="flex-row"><a class="back" href="#">';
		archhtml +='<img src="back.svg"></a><a href="#">Archive</a></li>';
		archhtml +=makeFeed(notes);
		archhtml += '</div>'
		$main.append(archhtml);
		//body
		$main.hide().fadeIn();	
	}

	function makeTrashView() {
		var $main = $('.main');
		if($main.children()){
				$main.children().remove();
		}
		currentView = 'trash-view';
		var trashhtml = '<div class="trash">';
		trashhtml += '<ul id="trash-view" class="flex-col">';
		trashhtml +='<li class="top nav" class="flex-row"><a class="back" href="#">';
		trashhtml +='<img src="back.svg"></a><a href="#">Trash</a></li></li>';
		trashhtml +=makeFeed(trash);
		trashhtml += '</div>'
		$main.append(trashhtml);
		$main.hide().fadeIn();	

	}

	function makeAbtView() {
		var $main = $('.main');
		if($main.children()){
				$main.children().remove();
		}
		currentView = 'aout-view';
		var abouthtml = '<div>';
		abouthtml += '<ul id="about-view" class="flex-col">';
		abouthtml +='<li class="top nav" class="flex-row"><a class="back" href="#">';
		abouthtml +='<img src="back.svg"></a></li>';
		abouthtml += '<li><ul class="feed"><li><p class="about" >Made by shahzan sadick</p></li></ul></li>'
		abouthtml += '</div>'
		$main.append(abouthtml);
		$main.hide().fadeIn();	
	}

	function validate(){
		var $title,$note,timestamp,noteObj,$archStat,$color,noteData;
		timestamp = new Date();
		noteData = new Object();

		$title = $('input:text').val();
		$note = $('textarea').val();

		if(currentNote == -1){
			$archStat = currentNoteBuffer.archStat;
			$color = currentNoteBuffer.color;
		}
		
		noteData = {
			'title' : $title,
			'content' : $note,
			'timestamp' : timestamp,
			'archStat' : $archStat,
			'color': $color
		};
		
		//create an new note obect to be used for argument
		
		if(currentNote == -1){
			if($title != "" || $note != ""){
				creatNewNote(noteData);
			}
		}
		if(currentNote != -1){
			if($title == "" && $note == ""){
				deleteNote(currentNote);
			}
			else{
				updateNote(noteData,currentNote);
			}
		}

		//clearing the buffer
		currentNoteBuffer.archStat = false;
		currentNoteBuffer.labels = [];
		currentNoteBuffer.color = NoteColor.default;

	}


	//the note view drop up
	function openDropUp(identifier){
		if(tagName[openMenu]){
			closeDropUp(openMenu);
		}
		$('.dropUpContainer').css({'display':'block'});
		var tag = '#'+tagName[identifier];
		$(tag).animate({
			'height':'+=218px'
		});
		openMenu = identifier;
		//setting color
		if(currentNote == -1){
			$('.default').addClass('currentColor');
		}
		else{
			$('.'+hex2Str[notes[currentNote].color]).addClass('currentColor');
		}
		
	}

	function closeDropUp(identifier){
		if(tagName[openMenu]){
			var tag = '#'+tagName[identifier];
			$(tag).animate({
				'height':'0'
			});
		}
		$('.dropUpContainer').css({'display':'none'});
		openMenu = 0;
	}

	function duplicator(noteObj,clone) {
		var duplicate = new Note();
		duplicate.title = noteObj.title;
		duplicate.content = noteObj.content;
		duplicate.archStat = noteObj.archStat;
		duplicate.color = noteObj.color;
			if(clone){
				duplicate.created = new Date(notes[currentNote].created.getTime());
				duplicate.edited = new Date(notes[currentNote].edited.getTime());
			}
			else{
				var birthTime = new Date();
				duplicate.created = birthTime;
				duplicate.edited = birthTime;
			}
		return duplicate;
	}
	
	makeHome();

	$('.main').on('click tap',function(e){
		if($(e.target).is('a')){
			e.preventDefault();
		}
		var $mySidenav = $('#mySidenav');
		var $target = $(e.target);
		var $parents = $target.parents();

	
		if($target.parent().hasClass('sidenav')){
			var id = $target.attr('id');
			if(id == 'homelink'){
				$mySidenav.css({'width':'0'});
			}
			if(id=='archivelink'){
				makeArchView();
			}
			if(id=='trashlink'){
				makeTrashView();
			}
			if(id=='abtlink' || id=='fblink'){
				makeAbtView();
			}
		}

		if(tagName[openMenu] && $target.attr('class') == "dropUpContainer"){
				closeDropUp(openMenu);
		}
		if($parents.hasClass('menu')){
			$mySidenav.css({'width':'100%'});			
		}
		if($target.hasClass('closebtn')){
			$mySidenav.css({'width':'0'});
		}
		if($parents.hasClass('circleBtn')){
			makeNoteView(false);
		}
		if($target.hasClass('note') || $target.parents().hasClass('note')){
			var id = $target.parents().filter('.note').attr('id') || $target.attr('id');
			makeNoteView(id);
		}
		if($parents.hasClass('back')){
			if(currentView == 'note-view'){
				validate();
			}
			makeHome();
		}
		if($parents.hasClass('trash') || $target.attr('id') == 'more-delete'){
			if(currentNote!=-1){
				deleteNote(currentNote);
			}
			makeHome();
		}
		if($parents.hasClass('add')){
			if(openMenu == 1){
				closeDropUp(1);
			}
			else{
				openDropUp(1);
			}

		}
		if($parents.hasClass('more')){
			if(openMenu == 2){
				closeDropUp(2);
			}
			else{
				openDropUp(2);
			}
		}
		if($target.attr('id') == 'more-archive'){
			if(currentNote == -1){
				if(!currentNoteBuffer.archStat){
					currentNoteBuffer.archStat = true;
					$target.html('<i class="fi-archive inline-logo"></i>unarchive');
				}
				else{
					currentNoteBuffer.archStat = false;
					$target.html('<i class="fi-archive inline-logo"></i>archive');
				}

			}
			else{
				if(!notes[currentNote].archStat){
					notes[currentNote].archStat = true;
					$target.html('<i class="fi-archive inline-logo"></i>unarchive');
				}
				else{
					notes[currentNote].archStat = false;
					$target.html('<i class="fi-archive inline-logo"></i>archive');
				}
			}
		}
		if($target.hasClass('colorCircle')){
			var colorStr = $target.attr('data-color');
			$('span').filter('.currentColor').removeClass('currentColor');
			$target.addClass('currentColor');
			if(currentNote == -1){
				currentNoteBuffer.color = NoteColor[colorStr];
			}
			else {
				notes[currentNote].color = NoteColor[colorStr];
			}	
			$('form').css({
				'background-color': NoteColor[colorStr]
			});
		}
		if($target.attr('id') == 'more-duplicate'){
			var duplicate = duplicator(notes[currentNote],false);
			notes.push(duplicate);
			validate();
			makeHome();
		}
	});



	$(window).on('scroll',function(){
		if(currentView == 'note-view') {
			if(window.pageYOffset > 0){
				$('.top').css({'box-shadow': '0px -3px 7px 0px black'});
				$('.bottom').css({'box-shadow': '0px 3px 7px 0px black'});
			}
			else{
				$('.top').css({'box-shadow': 'none'});
				$('.bottom').css({'box-shadow': 'none'});

			}
		}
		
	});

});