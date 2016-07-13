var skillsdb = []
skillsdb.push("VOC Civil")
//skillsdb.push("VOC Mining")
skillsdb.push("Roller RIIMPO317")
skillsdb.push("Skidsteer RIIMPO318")
skillsdb.push("Backhoe RIIMPO319")
skillsdb.push("Excavator RIIMPO320")
skillsdb.push("Front End Loader RIIMPO321")
skillsdb.push("Bulldozer RIIMPO323")
skillsdb.push("Grader RIIMPO324")
skillsdb.push("Dump Truck RIIMPO337")
skillsdb.push("Haul Truck RIIMPO338")


var state = {
	url : "/"
}

var userdata = {}
userdata.name = ""
userdata.email = ""
userdata.location = {}
userdata.ip = ""
userdata.skills = []


var socket = io();

socket.emit('handshake', 'hello');

socket.on('handshake', function(msg){
	console.log(msg)
});

function page( path ) {
		state.url = path
		window.history.pushState(state, state.url, state.url);
		render();
}

function hideall() {
	$("#name").blur();
	$("#logo").hide();
	$("#sloganblock").hide();
	$("#signupbuttonblock").hide();
	$("#managerlink").hide();
	$("#mapblock").hide();
	$("#profile").hide();
	$("#profileEmail").hide();
	$("#profileLocation").hide();
	$("#profileType").hide();
	$("#profileSkills").hide();
	$("#messageBox").hide();
}

function renderHome() {
	console.log("Render: home page")
	state.url = "/"
	window.history.pushState(state, 'Home', '/');		
	$("#logo").show();
	$("#sloganblock").show();
	$("#signupbuttonblock").show();
	//$("#managerlink").show();
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
		userdata.name = $("#name").val();
		console.log(userdata)
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
		userdata.email = $("#email").val();
		console.log(userdata)

		state.url = "/profile/location"
		window.history.pushState(state, 'Set Location', '/profile/location');
		render();	
	})
}


function renderProfileLocation() {
	state.url = "/profile/location"
	$("#profileLocation").fadeIn();
	$("#location").focus();

	if (userdata.gpslookup) { 
		if (userdata.gpslookup.city) { 
			$("#location").val(userdata.gpslookup.city); 	
		}
	}
	

	$("#profilenextLocation").click( function() {
		userdata.locationCity = $("#location").val();
		console.log(userdata)

		page("/profile/type")
		/*state.url = "/profile/skills"
		window.history.pushState(state, 'Set Skills', '/profile/skills');
		render();	*/
	})
}


function renderProfileType() {
	state.url = "/profile/type"
	$("#profileType").fadeIn();
	

	$("#profilenextTypeWorker").click( function() {
		userdata.usertype = "worker"
		page("/profile/skills")
	})

	$("#profilenextTypeContractor").click( function() {
		userdata.usertype = "contractor"
		page("/postjob")
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

	$("#skillsdone").click( function (e) {
		console.log("done!?")
		userdata.skills = skillsadded;
		$("#profileSkills").hide();

		$("#messageBoxText").html("Uploading profile...");
		$("#messageBox").fadeIn();

		/////////

		console.log(JSON.stringify(userdata))
		$.ajax({
		    url: '/api/signup', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify(userdata) }
		).done(function( serverresponse ) {
				$("#messageBoxText").html("SUCCESS. THANK YOU.<br>Keep an eye on your email for jobs.");
				
				setTimeout(function(){ page('/'); }, 4000);
		});

		
		/////////

	})

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
	if (state.url == "/profile/location") { renderProfileLocation(); }
	if (state.url == "/profile/type") { renderProfileType(); }
	if (state.url == "/profile/skills") { renderProfileSkills(); }
}


$(document).ready(function() 
{
	console.log("handshake app loading..")

	console.log("requesting ip information")
		$.ajax({
    url: '/api/ip',
    type: "GET",
    success: function (ipdata) {
        console.log("ip:"+JSON.stringify(ipdata));
        userdata.ip = ipdata;
    }
	});

	// USE LOCATION SERVICES
	console.log("requesting location information")
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(geoloc) {
      	userdata.geolocation = {};
      	userdata.geolocation.accuracy = geoloc.coords.accuracy;
      	userdata.geolocation.lat = geoloc.coords.latitude;
      	userdata.geolocation.lon = geoloc.coords.longitude;
				$.ajax({
				    url: '/api/gpslookup',
				    type: 'POST', 
				    contentType: 'application/json', 
				    data: JSON.stringify(userdata) }
				).done(function( serverresponse ) {
						console.log(serverresponse)
						userdata.gpslookup = serverresponse
						if ($("#location").val() == "") {
							$("#location").val(userdata.gpslookup.city); 		
						}
				});
      });
  } 
    
  // USE IP ADDRESS  
	$.ajax({
    url: '/api/location',
    type: "GET",
    success: function (locdata) {
        console.log("location:"+JSON.stringify(locdata));
        userdata.location = locdata;
    }
	});
  	






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
