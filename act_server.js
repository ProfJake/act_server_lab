//In-Class Activity
//Turn the Activity Tracker into a single page web-app
//Do this WITH them 
//Explain how the web-browser is the most common client
//we will use a browser as the client so we only have to write the server
//Step 1) Create a folder for the activity server
//Step 2) touch act_server.js   (we just need a file in there)
//Step 3) run 'npm init' to make a node project and package file
//Step 4) npm install tracker Service (and Exercise) from lab 4
//Step 5) import/require statements 
//Step 6) Ask them what our server needs to do.  Answer: Provide initial page,
// accept post data, create Tracker, calculate and return calories
//Step 7)  serverResponse: no matter what, our server is gonna provide a dynamically generated page
//Start with that. 
//Step 8) Add a simpleCreateServer with a console.log(req.method) and  if Statement
//method is POST or GET.  What should we do if it is just a normal get (someone visiting for the first time)?
//Step 9) What should we do if it's a post? What kind of events will occur?
//Step 10) Add event handlers for data and end events on the req
//Step 11) Fill out event handlers for data and end
//Step 12) Add error handling for empty fields
var http = require('http');
//var url = require('url');
var qstring = require('querystring'); //post data is provided from clients as a querystring
var tracker = require('tracker');//we're gonna use the tracker to demo how to turn basic logic into a web service
//exercise, weight, distance, time

//function with params for calculated calories and server response
function servResp(calories, res){
    
    var page = '<html><head><title>Your Activity Server</title></head>'+
	'<body>'+
        '<form method="post">'+
	'<h1>Fill out your Activity</h1>'+
        'Activity Name <select name="activity"><option>Running</option><option>Walking</option><option>Swimming</option></select><br>'+
	'Weight (in pounds) <input name="weight"><br>'+
        'Distance (in miles) <input name="distance"><br>'+
        'Time (in minutes) <input name="time"><br>'+
        '<input type="submit" value="Calculate!">'+
	'<input type="reset" value= "Clear">'+
        '</form>';
    if (calories){ //if calories exists (returned from Post) add calorie calculation
	
        page+= '<h3> Calories Burned: ' + calories + '</h3>';
    }

    page+='</body></html>';
    res.end(page); //when response from the server is over, write the complete page 
}
//the callback added to this function is automatically added  as a handler to
//the 'request' event.  request events are raised every time a request comes
//into the server.  The actual request is emitted with the object
http.createServer(function(req, res) {
	console.log(req.method);  //look at method type
	
	if (req.method == "POST"){ //Respond to POST
	   
	    var postData = ''; //if its post we need to save the posted params somewhere
	    req.on('data', function(chunk){
		    postData += chunk; //in this case, chunk is the posted data
		});
	    req.on('end', function(){
		    console.log(postData); 
		var postParams = qstring.parse(postData); //parse the returned Querystring
		let proceed =  true; //last step
		var calories ='';

		//handle empty cells
		for (property in postParams){
		    if (postParams[property] == '')
		    {
			calories = "Error! Must Fill All Fields";
			proceed = false;
		    }
		}

		if (proceed){
		    try{
		    var current_Act = new tracker(postParams.activity, postParams.weight, postParams.distance, postParams.time);//create tracker
			calories = current_Act.calculate(); //calculate calories
			servResp(calories, res);
		    } catch(err){
			calories = "Error! Please enter appropriate data";
			console.log(err.message);
			servResp(calories, res);
			
		    }
		} else {
		    servResp(calories, res);
		}

		});
	}else{
	    servResp(null, res); //Responsd to Initial GET
	}
    }).listen(3000, ()=>{ //start the server
	    console.log("Server is running");
	});
