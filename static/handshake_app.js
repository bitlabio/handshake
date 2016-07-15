var skillsdb = []
/*skillsdb.push("VOC Civil")
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
*/

skillsdb.push(["&nbsp;&nbsp;"  , "VOC" , "" , 0 ])
skillsdb.push(["&nbsp;&nbsp;"  , "RIIVEH304D", "Conduct Tip Truck Operations", 0 ])
skillsdb.push(["LR", "RIIMPO317D", "Conduct Roller Operations", 0 ])
skillsdb.push(["LS", "RIIMPO318E", "Conduct Skid Steer Operations", 0 ])
skillsdb.push(["LB", "RIIMPO319D", "Conduct Backhoe Loader Operations", 0 ])
skillsdb.push(["LE", "RIIMPO320E", "Conduct Excavator Operations", 0 ])
skillsdb.push(["LL", "RIIMPO321E", "Conduct Wheeled Loader Operations", 0 ])
skillsdb.push(["&nbsp;&nbsp;" ,"RIIMPO322D", "Conduct Tracked Loader Operations", 0 ])
skillsdb.push(["LZ", "RIIMPO323D", "Conduct Dozer Operations", 0 ])
skillsdb.push(["LG", "RIIMPO324E", "Conduct Grader Operations", 0 ])
skillsdb.push(["LP", "RIIMPO325D", "Conduct Scraper Operations", 0 ])
skillsdb.push(["&nbsp;&nbsp;"  , "RIIMPO326D", "Conduct Water Cart Operations", 0 ])



var state = {
	url : "/"
}

var userdata = {}
userdata.name = ""
userdata.email = ""
userdata.location = {}
userdata.ip = ""
userdata.skills = []

/*

	var socket = io();

	socket.emit('handshake', 'hello');

	socket.on('handshake', function(msg){
		console.log(msg)
	});

*/

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
	$("#success").hide();
	$("#postJob").hide();
	$("#postJobResults").hide()
}

function renderHome() {
	console.log("Render: home page")
	state.url = "/"
	window.history.pushState(state, 'Home', '/');		
	$("#logo").show();
	


	console.log(userdata)
if (userdata.signedup == true) {
	//HOME
		$(".namedisplay").html(userdata.name)
		$(".locationdisplay").html(userdata.city + ", "+userdata.country)
		//$("#signupbuttonblock").show();	


	$("#profileType").fadeIn();
	

	$("#profilenextTypeWorker").unbind().click( function() {
		userdata.usertype = "worker"
		page("/profile/skills")
	})

	$("#hirepeople").unbind().click( function() {
		userdata.usertype = "contractor"
		page("/postjob")
	})	


} else {
	//SIGNUP
		$("#sloganblock").show();
		$("#signupbuttonblock").show();	
}
	
	//$("#managerlink").show();
	//$("#mapblock").show();

	$("#logo").click(function() {
		console.log("click logo :)")
		if (state.url != "/") {
			//state.url = "home"
			//window.history.pushState(state, 'Home', '/');	
		}
		//hideall();
	});

	$("#signupbutton").unbind().click(function() {
		state.url = "/profile"
		window.history.pushState(state, 'Set Name', '/profile');
		render();
	});
}


function renderProfile() {
	state.url = "/profile"
	$("#profile").fadeIn();
	$("#name").focus();

	$("#profilenext").unbind().click( function () {
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

	$("#profilenextemail").unbind().click( function() {
		userdata.email = $("#email").val();
		console.log(userdata)

		//SAVE ACCOUNT
		$("#profileEmail").hide();


		$.ajax({
		    url: '/api/signup', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify(userdata) }
		).done(function( serverresponse ) {
				$("#success").fadeIn();
				userdata.signedup = true;
				setTimeout(function(){ page('/'); }, 1000);
		});

		/*
		state.url = "/profile/location"
		window.history.pushState(state, 'Set Location', '/profile/location');
		render();	*/
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
	var skillrec = ""
	for (var s in skillsdb) {
			var chosen = skillsdb[s][3]
			//for (var c in skillsadded) { if (skillsadded[c] == skillsdb[s]) { chosen = 1} }
			if (chosen == 1) { skillrec += '<span class="skillreq" data-id="'+s+'" style="color: #f6b727; opacity: 1">'+skillsdb[s][0]+ ' ' +skillsdb[s][1] +"<br>&nbsp;&nbsp;&nbsp;"+ skillsdb[s][2] + "</span><br><br>";	}
			if (chosen == 0) { skillrec += '<span class="skillreq" data-id="'+s+'" style="color: #888; opacity: 1">'+skillsdb[s][0]+ ' ' +skillsdb[s][1] +"<br>&nbsp;&nbsp;&nbsp;"+ skillsdb[s][2] + "</span><br><br>";	}
	}
	
	$("#skillrecommend").html(skillrec)

	$(".skillreq").click( function () {	
		var id = $(this).data().id;
		console.log( $(this).data() );
		if ( skillsdb[id][3] == 0 ) { 
			skillsdb[id][3] = 1;
			 $(this).css("color", "#f6b727;")
			 $(this).css("opacity", "1")

		} else { 
			skillsdb[id][3] = 0;
			$(this).css("color", "#999")
		}
		skillreclist();
	});

	$(".skillreq").hover( function () {
		$(this).css("opacity", "0.75")
	}, function () {
		$(this).css("opacity", "1")
	})

	
	//skillclick();	//make them clickable
}

function skillclickremove() {
	$(".skilladdedlistitem").click( function(e) {
		//console.log($(this).context.textContent)
		var removeid = -1;
		for (var s in skillsadded) { if (skillsadded[s] == $(this).context.textContent) { removeid = s } }
		//console.log(removeid)
		skillsadded.splice(removeid, 1)
		//display selected skills
		renderSkillsAdded()
	})
}

function renderSkillsAdded() {
	//display selected skills
		var skillsaddedhtml = ""
		for (var s in skillsadded) { skillsaddedhtml+= '<span class="skilladdedlistitem">'+skillsadded[s] + "</span><br>" }
		//$("#skillsadded").html(skillsaddedhtml)
		skillclickremove(); //make removable click work
		skillreclist();
}

function skillclick() {
	$(".skillreq").click( function(e) {
		$("#skillinput").val("").focus();
		//console.log($(this).context.textContent)
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

	$("#skillsdone").unbind().click( function (e) {
		console.log("done!?")
		userdata.skills = skillsdb;
		$("#profileSkills").hide();

		$("#messageBoxText").html("Uploading profile...");
		$("#messageBox").fadeIn();

		/////////
		console.log(JSON.stringify(userdata))
		$.ajax({
		    url: '/api/skills', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify(userdata.skills) }
		).done(function( serverresponse ) {
			$("#success").fadeIn();
				$("#messageBoxText").html("SKILLS UPDATED.");
				userdata.signedup = true;
				setTimeout(function(){ page('/'); }, 2000);
		});
		/////////

	})

}


/////////////////////////////////////// POST JOB

var jobskills = []
for (var a in skillsdb) {
	jobskills[a] = skillsdb[a]
	jobskills[a][3] = 0
}

function renderPostJob() {
	$("#postJob").fadeIn();


	var skillrec = ""
	for (var s in jobskills) {
			var chosen = jobskills[s][3]
			//for (var c in skillsadded) { if (skillsadded[c] == jobskills[s]) { chosen = 1} }
			if (chosen == 1) { skillrec += '<span class="jobskillreq" data-id="'+s+'" style="color: #f6b727; opacity: 1">'+jobskills[s][0]+ ' ' +jobskills[s][1] +"<br>&nbsp;&nbsp;&nbsp;"+ jobskills[s][2] + "</span><br><br>";	}
			if (chosen == 0) { skillrec += '<span class="jobskillreq" data-id="'+s+'" style="color: #888; opacity: 1">'+jobskills[s][0]+ ' ' +jobskills[s][1] +"<br>&nbsp;&nbsp;&nbsp;"+ jobskills[s][2] + "</span><br><br>";	}
	}
	
	$("#jobskills").html(skillrec)

	$(".jobskillreq").click( function () {	
		var id = $(this).data().id;
		console.log( $(this).data() );
		if ( jobskills[id][3] == 0 ) { 
			jobskills[id][3] = 1;
			 $(this).css("color", "#f6b727;")
			 $(this).css("opacity", "1")

		} else { 
			jobskills[id][3] = 0;
			$(this).css("color", "#999")
		}
		renderPostJob();
	});

	$(".jobskillreq").hover( function () {
		$(this).css("opacity", "0.75")
	}, function () {
		$(this).css("opacity", "1")
	})


	$("#jobsearch").unbind().click( function () {
		
				$("#postJob").hide();
				$("#postJobResults").fadeIn()
				$("#postJobResultsTitle").html("searching...")
				
				$("#homebutton").unbind().click( function () { page('/'); })

				$.ajax({
				    url: '/api/search',
				    type: 'POST', 
				    contentType: 'application/json', 
				    data: JSON.stringify(jobskills) }
				).done(function( searchresults ) {
						searchresults = JSON.parse(searchresults)
						$("#postJobResultsTitle").html(searchresults.length+" found.")
						var html = ""
						for (var a in searchresults) {
							html += "<h4>"+searchresults[a].name+' (<a href="mailto:'+searchresults[a].email+'">'+searchresults[a].email+'</a>)</h4>'

							var matchedskills = 0
							var skillcount = 0
							var searchcount = 0
							
							for (var s in searchresults[a].skills) {
								if (searchresults[a].skills[s][3] == 1) { skillcount++}
							}



							for (var m in jobskills) {
								if (jobskills[m][3] == 1) { searchcount++}

								for (var s in searchresults[a].skills) {
									if ((jobskills[m][1] == searchresults[a].skills[s][1]) && (jobskills[m][3] == 1) && (searchresults[a].skills[s][3] == 1)) {
										//html += searchresults[a].skills[s][1]+" "+ searchresults[a].skills[s][2] + "<br>"	
										matchedskills++;
									}
								}
							}
							html += '<span style="font-size:9.5px;">'
							var matchpct = Math.round((matchedskills/searchcount)*100)
							if (isNaN(matchpct) == 1) { matchpct = 100 }
							html += matchpct+"% match - " + searchresults[a].city + ", "+ searchresults[a].country +"<br>"
							html += "</span>"
							html += "<br><br>"
						}
						$("#foundpersons").html(html)
						//console.log(searchresults)

				});


	})


}



////////////////////////////////////////

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
	if (state.url == "/postjob") { renderPostJob(); }
	if (state.url == "/profile") { renderProfile(); }
	if (state.url == "/profile/email") { renderProfileEmail(); }
	if (state.url == "/profile/location") { renderProfileLocation(); }
	if (state.url == "/profile/type") { renderProfileType(); }
	if (state.url == "/profile/skills") { renderProfileSkills(); }
}


$(document).ready(function() 
{
	hideall();
	$("#wrapper").fadeIn();
	
	console.log("handshake app loading..")
	console.log("requesting session information")
		$.ajax({
    url: '/api/session',
    type: "GET",
    success: function (session) {
    		session = JSON.parse(session)
    		//console.log(session)
        console.log("ip:"+JSON.stringify(session.ip));
        userdata.ip = session.ip;
        
        console.log(session.db)
        if (session.db == null) {
        	userdata.signedup = false;
        } else {
        	userdata.name = session.db.name
        	userdata.signedup = true;
        	userdata.db = session.db
        	userdata.name = session.db.name
        	userdata.country = session.db.country
        	userdata.city = session.db.city
        	if (session.db.skills.length > 0) {
        		skillsdb = session.db.skills	
        	}
        	
        }
        render();
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
						
						userdata.gpslookup = serverresponse
						userdata.city = serverresponse.city
						userdata.country = serverresponse.country
						console.log(userdata)
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
	
	//render();

	window.onpopstate = function(event) {
  	console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
  	if (event.state.url) { state = event.state}
  	render();
	};
})
