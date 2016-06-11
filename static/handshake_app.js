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

function renderProfileSkills() {
	$("#profileSkills").fadeIn();
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
	var c = b.slice("http://localhost:3000".length)
	//console.log(a)
	//console.log(b)
	console.log(c)
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
