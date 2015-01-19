var express = require("express");
var logfmt = require("logfmt");
var https = require("https");
var util = require("util");
var app = express();

app.use(logfmt.requestLogger());

//app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views
//app.set('views', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
//app.set('view engine', 'html');

app.set('view engine', 'jade');

app.get('/project', function(req, res) {
	var optionsget = {
			host : 'api.github.com', // here only the domain name
			// (no http/https !)
			port : 443,
			path : '/orgs/sfcoding/repos', // the rest of the url with parameters if needed
			method : 'GET', // do GET
			headers: {'user-agent': 'node.js'}
	};

	var json;
	var reqGet = https.request(optionsget, function(response) {
		var tmp="";
		response.on('data', function(data) {
			tmp += data;
		});

		response.on('end', function() {
			json = JSON.parse(tmp);

			var repos = [];
			for(var idx=0; idx<json.length; idx++){
					var repo = json[idx];
					if (repo.name != 'sfcoding-site')
						repos.push({'name': repo.name,
								  		'homepage': repo.homepage,
											'gitUrl':repo.html_url,
											'branches': repo.branches_url,
											'descript': repo.descript,
											'language': repo.language
										});
			}
			res.render("project",{repos:repos});
		});
	});
	reqGet.end();
	reqGet.on('error', function(e) {
		//console.error(e);
	});
});

app.get('/unipg_project', function(req, res) {
	var optionsget = {
    	host : 'api.github.com', // here only the domain name
    	// (no http/https !)
    	port : 443,
    	path : '/orgs/sfcoding-school/repos', // the rest of the url with parameters if needed
    	method : 'GET', // do GET
    	headers: {'user-agent': 'node.js'}
	};

	var json;
	var reqGet = https.request(optionsget, function(response) {
	    var tmp="";
	    response.on('data', function(data) {
	      tmp += data;
	    });

	    response.on('end', function() {
				json = JSON.parse(tmp);
				/*
				var name = json[0].name;
				var gitUrl = json[0].html_url;
				var branches = json[0].branches_url;
				var descript = json[0].description;
				var language = json[0].language;
				var homepage = json[0].homepage;
				*/
				var menuSet = {};
	      for(var idx=0; idx<json.length; idx++){
        	var topic = json[idx];

		      //var gitUrl = topic.html_url;
		      //var branches = topic.branches_url;
		      var descript = topic.description;
		      //var language = topic.language;
		      //var homepage = topic.homepage;
		      //var comand = "<span class='comand'>ls -l</span>";
		      //console.log(homepage);

		      if (descript !== null && descript.indexOf('[')!=-1 && descript.indexOf(']')!=-1){
		        //console.log("descri "+descript+" index "+descript.indexOf(']'));
		        var str = descript.split('[');
		        descript = str[0];
		        var menu = str[1].substr(0,str[1].indexOf(']'));
		        //menu = menu.substr(0, menu.indexOf(']'));

		        if ( !(menu in menuSet) ){
		          //console.log(menu);
		          menuSet[menu] =[];
		          //console.log(menuSet);

		        }

		        menuSet[menu].push({'name': topic.name,
		        										'homepage': topic.homepage,
		        										'gitUrl':topic.html_url,
		      											'branches': topic.branches_url,
		      											'descript': descript,
		      											'language': topic.language
		        									});
		      }
	      }
				//console.log(menuSet);
				res.render("unipg_project",{repo:menuSet});
	    });
	});

	reqGet.end();
	reqGet.on('error', function(e) {
		//console.error(e);
	});

});

app.get('/', function(req, res){
  res.render('index', { title: 'SFcoding' });
});

app.get('/about', function(req, res){
  res.render('about', { title: 'about' });
});

app.get('/:cat', function(req, res){
	var cat = req.params.cat;
	res.render(cat+'/index', { title: cat , cat: cat});
});

app.get('/:cat/:page', function(req, res){
	var cat = req.params.cat;
	var page = req.params.page;
	res.render(cat+'/'+page, { title: page, cat: cat, page: page});
});

//app.get('/header', function(req, res){
//  res.render('header', { title: 'header' });
//});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
