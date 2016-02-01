dataTableSet = false;

//assigning default values
function pick(arg, def) {
   return (typeof arg === 'undefined' ? def : arg);
}

function ajax(requestMethod,url,ajaxHandler,sendString)
{
	xmlHttp = false;
	try
	{
		xmlHttp = new XMLHttpRequest({mozSystem: true});
	}
	catch(err1)
	{
		try
		{
			xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
		catch(err2)
		{
			try
			{
				xmlHttp = new ActiveXObject('MsXml2.XMLHTTP')
			}
			catch(err3)
			{
				xmlHttp = false;
			}
		}
	}
	xmlHttp.onreadystatechange = ajaxHandler;
	if(requestMethod.toLowerCase() === "post")
	{
		xmlHttp.open(requestMethod,url,true);
		xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlHttp.send(sendString);
	}
	else
	{
		var rand = Math.floor(Math.random()*999999999); 
		xmlHttp.open(requestMethod,url+"?"+sendString+"&rand="+rand,true);
		xmlHttp.send();
	}

}

function getUsers (page) {
    page = pick(page,1);
    ajax("GET","apiClient.php",getUsersHandler,"action=list&page="+page);
}

function getUsersHandler () {
    if(xmlHttp.status == 200 && xmlHttp.readyState == 4) {
        var tbody = document.getElementById("tbody");
        var data  = JSON.parse(xmlHttp.responseText);
        var pager  = data.pager;
        var users = data.users;

        var prev = document.getElementById("prev");
        if(pager.page > 1) {
            prev.setAttribute("onclick","getUsers("+(pager.page-1)+")");
            prev.style.visibility="" ;
        } else {
            prev.style.visibility="hidden";
        }
        
        var next = document.getElementById("next");
        if(pager.page < pager.total ) {
            next.setAttribute("onclick","getUsers("+(pager.page+1)+")");
            prev.style.visibility="";
        } else {
            next.style.visibility="hidden";
        }
        
        $(document).ready(function() {
            var table =  $('#datatable').DataTable({
                   destroy: true,
                    data: users,
                    columns: [
                        { data: 'name' },
                        { data: 'id' },
                        { data: 'created' },
                        { data: 'lastUpdated' }
                    ]
               });
               
            $('#datatable tbody').on('click', 'tr', function () {
                userId = this.cells[1].innerHTML; 
                var url = "http://test.hiskenya.org/api/users/"+userId;
                document.getElementById('ajax_loader').style.display='';
                getUserInfo(url,userId);
            } );
            
           } );
           
        
        document.getElementById('ajax_loader').style.display='none';
    } else {
        document.getElementById('ajax_loader').style.display='';
    }
}

function getUserInfo(url,id) {
    ajax("GET","apiClient.php",getUserInfoHandler,"action=info&url="+url+"&id="+id);
}

function getUserInfoHandler () {
    if(xmlHttp.status == 200 && xmlHttp.readyState == 4) {
        document.getElementById('ajax_loader').style.display='none';
        var tbody = document.getElementById("tbody");
        var user  = JSON.parse(xmlHttp.responseText);
        var data_out = "<table class='ui inverted blue table'>";
        data_out+="<tr><td>NAME : </td><td>"+user.name+"</td><td> Email : </td><td>"+user.email+"</td></tr>";
        data_out+="<tr><td>PHONE NUMBER : </td><td>"+user.phonenumber+"</td><td> ID : </td><td>"+user.id+"</td></tr>";
        data_out+="<tr><td colspan='4' > ACCESS </td></tr>";
        data_out+="<tr><td>READ : </td><td>"+user.access.read+"</td><td> UPDATE : </td><td>"+user.access.update+"</td></tr>";
        data_out+="<tr><td>EXTERNALIZE : </td><td>"+user.access.externalize+"</td><td> WRITE : </td><td>"+user.access.write+"</td></tr>";
        data_out+="<tr><td>DELETE : </td><td>"+user.access.delete+"</td><td> MANAGE : </td><td>"+user.access.manage+"</td></tr>";
        data_out+="</table>";        
        var elm = document.getElementById('userDesc');
        elm .innerHTML=data_out;
        $('.ui.modal').modal('show');
    } else {
       
    }
}



		