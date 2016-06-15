window.onload = function() {

	// THIS FUNCTION CREATES THE NEW PROJECT CONTAINER
	declare_new_project();
	declare_delete_checked();

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/data", true);
	xhr.send();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			loadObject = JSON.parse(xhr.responseText);
			if (loadObject.length > 0) 
				for (var i = 0; i < loadObject.length; i++) 
					load_existing_project(loadObject[i]);
		}
	};

	
}

declare_delete_checked = function() {

	// THIS FUNCTION REMOVES CHECKED BOXS
	document.getElementById("div-bottom").onclick = function() {
		var chkbx = document.getElementsByClassName('delete-entry-check');

		for (var i = 0; i < chkbx.length; i++) {
			if (chkbx[i].checked) {
				taskkill = {
					iden: chkbx[i].iden, //unique identifier for project
					name: chkbx[i].taskiden
				};

				var postXhr = new XMLHttpRequest();
				postXhr.open("POST","/kill",true);
				postXhr.setRequestHeader("Content-type","application/json");
				postXhr.send(JSON.stringify(taskkill));


				par = chkbx[i].parentElement.parentElement.parentElement;
				par.removeChild(chkbx[i].parentElement.parentElement);
				i--;
			}
		}
	}

}



// THIS FUCNCTION DEFINES THE ONCLICK EVENT FOR THE "ADD PROJECT" BUTTOM
declare_new_project = function() {

	document.getElementById("add-new-project").onclick = function() {
		
		var title = document.getElementById('new-project-name').value;
		document.getElementById('new-project-name').value = "";
		
		var projDiv = document.createElement('div');
		projDiv.className = "project";
		
		var tableClass = document.createElement('table');
		tableClass.className = "timelog";
		projDiv.appendChild(tableClass);
		
		var tbody = document.createElement('tbody');
		tableClass.appendChild(tbody);

		var trth = document.createElement('tr');
		tbody.appendChild(trth);

		var projectName = document.createElement('th');
		projectName.innerHTML = title;
		trth.appendChild(projectName);
		
		var tr = document.createElement('tr');
		tr.className = "prompt";
		tbody.appendChild(tr);
		
		var td1 = document.createElement('td');
		var p = document.createElement('p');
		p.className = "task-name";
		p.innerHTML = "Task Name: ";
		td1.appendChild(p);
		var input = document.createElement('input');
		input.type = 'text';
		input.id="new-task-name";
		td1.appendChild(input);
		tr.appendChild(td1);
		
		var td2 = document.createElement('td');
		var buttn = document.createElement('button');
		buttn.innerHTML = "Start";
		buttn.className ="start-button";
		td2.appendChild(buttn);
		tr.appendChild(td2);
		
		document.getElementById('container').appendChild(projDiv);

		var d = new Date();
		project = {
			iden: d.getTime(), //unique identifier for project
			name: title,
			tasks: [],
			time: []
		};

		var postXhr = new XMLHttpRequest();
		postXhr.open("POST","/data",true);
		postXhr.setRequestHeader("Content-type","application/json");
		postXhr.send(JSON.stringify(project));

		declare_button_function(buttn,input,project);

	}

}

// THIS FUCNCTION LOADS A PROJECT
load_existing_project = function(project) {
		
	var title = project.name;
		
	var projDiv = document.createElement('div');
	projDiv.className = "project";
		
	var tableClass = document.createElement('table');
	tableClass.className = "timelog";
	projDiv.appendChild(tableClass);
		
	var tbody = document.createElement('tbody');
	tableClass.appendChild(tbody);

	var trth = document.createElement('tr');
	tbody.appendChild(trth);

	var projectName = document.createElement('th');
	projectName.innerHTML = title;
	trth.appendChild(projectName);
		
	var tr = document.createElement('tr');
	tr.className = "prompt";
	tbody.appendChild(tr);
		
	var td1 = document.createElement('td');
	var p = document.createElement('p');
	p.className = "task-name";
	p.innerHTML = "Task Name: ";
	td1.appendChild(p);
	var input = document.createElement('input');
	input.type = 'text';
	input.id="new-task-name";
	td1.appendChild(input);
	tr.appendChild(td1);
		
	var td2 = document.createElement('td');
	var buttn = document.createElement('button');
	buttn.innerHTML = "Start";
	buttn.className ="start-button";
	td2.appendChild(buttn);
	tr.appendChild(td2);
		
	document.getElementById('container').appendChild(projDiv);
	if (project.tasks.length > 0) 
		for (var i = 0; i < project.tasks.length; i++) 
			load_task(project.time[i],project.tasks[i],buttn,project);
	

	declare_button_function(buttn,input,project);
}


// THIS FUCNCTION DEFINES THE ONCLICK EVENT FOR A "START" BUTTOM
declare_button_function = function(button,TaskName,project) {
		button.onclick = function() {
			var d = new Date();
			var title = TaskName.value;
			TaskName.value = "";

			var tr = document.createElement('tr');
			tr.className = "start-entry";
			event.currentTarget.parentElement.parentElement.parentElement.appendChild(tr);
			var td1 = document.createElement('td');
			var td2 = document.createElement('td');
			tr.appendChild(td1);
			tr.appendChild(td2);

			var p = document.createElement('p');
			p.innerHTML = title+". Currently in progress ";
			td1.appendChild(p);

			var buttn = document.createElement('button');
			buttn.innerHTML = "Add";
			buttn.className ="add-button";
			td2.appendChild(buttn);

			var now = d.getTime();

			project.tasks.push(title);
			project.time.push([now,-1]);

			var postXhr = new XMLHttpRequest();
			postXhr.open("POST","/data",true);
			postXhr.setRequestHeader("Content-type","application/json");
			postXhr.send(JSON.stringify(project));

			declare_button_finish_function(buttn,p,now,title,project);

		}
	}

// THIS FUCNCTION DEFINES A TASK
load_task = function(time,TaskName,button,project) {

	var now = time[0];
	var title = TaskName;

	var tr = document.createElement('tr');
	tr.className = "start-entry";
	button.parentElement.parentElement.parentElement.appendChild(tr);
	var td1 = document.createElement('td');
	var td2 = document.createElement('td');
	tr.appendChild(td1);
	tr.appendChild(td2);

	var p = document.createElement('p');
	p.innerHTML = title+". Currently in progress ";
	td1.appendChild(p);

	var buttn = document.createElement('button');
	buttn.innerHTML = "Add";
	buttn.className ="add-button";
	td2.appendChild(buttn);

	if (time[1] == -1) {	
		declare_button_finish_function(buttn,p,now,title,project);
	} else {
		var total_time = Math.floor((time[1]-time[0])/1000);
		
		if (total_time > 3600) {
			var seconds = total_time%60;
			var total_minutes = (total_time-seconds)/60;
			var minutes = total_minutes%60;
			var total_hours = (total_minutes-minutes)/60;
			p.innerHTML=TaskName+". Total Time: "+total_hours+"h "+minutes+"m "+seconds+"s.";
		} else if (total_time > 60) {
			var seconds = total_time%60;
			var total_minutes = (total_time-seconds)/60;
			p.innerHTML=TaskName+". Total Time: "+total_minutes+"m "+seconds+"s.";
		} else {
			p.innerHTML=TaskName+". Total Time: "+total_time+"s.";
		}
		var chkbx = document.createElement('input');
		chkbx.type = "checkbox";
		chkbx.className = "delete-entry-check";
		chkbx.iden = project.iden;
		chkbx.taskiden = time[0];
		buttn.parentElement.appendChild(chkbx);
		chkbx.parentElement.removeChild(buttn);
	}
		
}

// THIS FUCNCTION DEFINES THE ONCLICK EVENT FOR AN "ADD" BUTTOM
declare_button_finish_function = function(button,text,time,title,project) {
	button.onclick = function() {
		var d = new Date();
		var new_time = d.getTime();
		var total_time = Math.floor((new_time-time)/1000);
		
		if (total_time > 3600) {
			var seconds = total_time%60;
			var total_minutes = (total_time-seconds)/60;
			var minutes = total_minutes%60;
			var total_hours = (total_minutes-minutes)/60;
			text.innerHTML=title+". Total Time: "+total_hours+"h "+minutes+"m "+seconds+"s.";
		} else if (total_time > 60) {
			var seconds = total_time%60;
			var total_minutes = (total_time-seconds)/60;
			text.innerHTML=title+". Total Time: "+total_minutes+"m "+seconds+"s.";
		} else {
			text.innerHTML=title+". Total Time: "+total_time+"s.";
		}
		var chkbx = document.createElement('input');
		chkbx.type = "checkbox";
		chkbx.className = "delete-entry-check";
		chkbx.iden = project.iden;
		chkbx.taskiden = time;
		button.parentElement.appendChild(chkbx);
		chkbx.parentElement.removeChild(button);

		var i = 0;
		while (time != project.time[i][0]) i++;
		project.time[i][1] = new_time;

		var postXhr = new XMLHttpRequest();
		postXhr.open("POST","/data",true);
		postXhr.setRequestHeader("Content-type","application/json");
		postXhr.send(JSON.stringify(project));		
	}
}

