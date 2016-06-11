var skillsdb = []
skillsdb.push("Roller 317E")
skillsdb.push("Skidsteer 318E")
skillsdb.push("Backhoe 319D")
skillsdb.push("Excavator 320E")
skillsdb.push("Front End Loader 321E")
skillsdb.push("Bulldozer 323D")
skillsdb.push("Grader 324E")
skillsdb.push("Dump Truck 337D")

var state = {
	url : "/"
}

var socket = io();

socket.emit('handshake', 'hello');

socket.on('handshake', function(msg){
	console.log(msg)
});


function hideall() {
	$("#name").blur();
	$("#logo").hide();
	$("#sloganblock").hide();
	$("#signupbuttonblock").hide();
	$("#managerlink").hide();
	$("#mapblock").hide();
	$("#profile").hide();
	$("#profileEmail").hide();
	$("#profileSkills").hide();
}

function renderHome() {
	console.log("Render: home page")
	state.url = "/"
	window.history.pushState(state, 'Home', '/');		
	$("#logo").show();
	$("#sloganblock").show();
	$("#signupbuttonblock").show();
	$("#managerlink").show();
	$("#mapblock").show();

	$("#logo").click(function() {
		console.log("click logo :)")
		if (state.url != "/") {
			//state.url = "home"
			//window.history.pushState(state, 'Home', '/');	
		}
		//hideall();
	});

	$("#signupbutton").click(function() {
		state.url = "/profile"
		window.history.pushState(state, 'Set Name', '/profile');
		render();
	});
}


function renderProfile() {
	state.url = "/profile"
	$("#profile").fadeIn();
	$("#name").focus();

	$("#profilenext").click( function () {
		state.url = "/profile/email"
		window.history.pushState(state, 'Set Email', '/profile/email');
		render();		
	})
}

function renderProfileEmail() {
	state.url = "/profile/email"
	$("#profileEmail").fadeIn();
	$("#email").focus();

	$("#profilenextemail").click( function() {
		state.url = "/profile/skills"
		window.history.pushState(state, 'Set Skills', '/profile/skills');
		render();	
	})
}

var skillsadded = []

function skillreclist() {
	var filter = $("#skillinput").val().toLowerCase()
	var skillrec = ""
	for (var s in skillsdb) {
		if (skillsdb[s].toLowerCase().indexOf( filter ) >= 0) {
			var chosen = 0
			for (var c in skillsadded) { if (skillsadded[c] == skillsdb[s]) { chosen = 1}}
			if (chosen == 0) { skillrec += '<span class="skillreq">'+skillsdb[s] + "</span><br>"	}
		}
	}
	
	$("#skillrecommend").html(skillrec)
	skillclick();	//make them clickable
}

function skillclickremove() {
	$(".skilladdedlistitem").click( function(e) {
		console.log($(this).context.textContent)
		var removeid = -1;
		for (var s in skillsadded) { if (skillsadded[s] == $(this).context.textContent) { removeid = s } }
		console.log(removeid)
		skillsadded.splice(removeid, 1)
		//display selected skills
		renderSkillsAdded()
	})
}

function renderSkillsAdded() {
	//display selected skills
		var skillsaddedhtml = ""
		for (var s in skillsadded) { skillsaddedhtml+= '<span class="skilladdedlistitem">'+skillsadded[s] + "</span><br>" }
		$("#skillsadded").html(skillsaddedhtml)
		skillclickremove(); //make removable click work
		skillreclist();
}

function skillclick() {
	$(".skillreq").click( function(e) {
		$("#skillinput").val("").focus();
		console.log($(this).context.textContent)
		skillsadded.push($(this).context.textContent)

		//display selected skills
		renderSkillsAdded()

	})
}

function renderProfileSkills() {
	$("#profileSkills").fadeIn();
	skillreclist();
	$("#skillinput").on('propertychange input', function (e) {
		console.log($("#skillinput").val())
		skillreclist();
	});
}


function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

function getStateUrl() {
	var a = getAbsolutePath().length
	var b = ""+document.location
	//var c = b.slice(a)

	//console.log("b"+b)
	//console.log(b.indexOf("://"))
	var t = b.slice(b.indexOf("://")+3)
	if ( t.indexOf(":") >= 0 ) {
		console.log("non standard port!")
	}
	//console.log(t)
	//console.log(t.indexOf("/"))
	//var c = b.slice("http://localhost:3000".length)
	var c = t.slice(t.indexOf("/"))
	//console.log(c)

	//console.log(a)
	//console.log(b)
	
	//console.log("getStateUrl: "+b.slice(a))
	return c
}

function render() {
	hideall();
	console.log("render "+state.url)
	if (state.url == "/") { renderHome(); }
	if (state.url == "/profile") { renderProfile(); }
	if (state.url == "/profile/email") { renderProfileEmail(); }
	if (state.url == "/profile/skills") { renderProfileSkills(); }
}

$(document).ready(function() 
{
	console.log("handshake app loading..")

	var url = getStateUrl();
	if (url != "") { state.url = url } else { url = "/"}
	if (history.state != null) { state = history.state }
	
	render();

	window.onpopstate = function(event) {
  	console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
  	if (event.state.url) { state = event.state}
  	render();
	};
})
