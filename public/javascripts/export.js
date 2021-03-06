/**
 * Created by svenc on 22/04/15.
 */

var exportData = function(dataPerInquiry,phases,users)
{
    var w = window.open('', 'wnd');
    var popup = document.createElement("div");
    popup.setAttribute("id","report");
    popup.setAttribute("style","display:none");
    $("body").append(popup);
    $("#report").append("<h1>"+dataPerInquiry[Object.keys(dataPerInquiry)[0]].inquiry.title+"</h1>");
    $("#report").append("<a href='"+dataPerInquiry[Object.keys(dataPerInquiry)[0]].inquiry.url+"'>"+ dataPerInquiry[Object.keys(dataPerInquiry)[0]].inquiry.url +"</a>");
    $("#report").append("<p>"+dataPerInquiry[Object.keys(dataPerInquiry)[0]].inquiry.description+"</p>");
 //   document.body.appendChild(popup);
    phases.forEach(function(p){
        $("#report").append("<div id='phase" + p + "'/>");

        $("#phase"+p).append("<h2>Phase "+ p + "</h2>");

    });


    Object.keys(dataPerInquiry).forEach(function(inq){
        var Htmls = {};
       Object.keys(dataPerInquiry[inq].data.events).forEach(function(user){
           Object.keys(dataPerInquiry[inq].data.events[user]).forEach(function(phase){
               var phaseData = dataPerInquiry[inq].data.events[user][phase];
               if(phase != "username"
                   && phaseData.length > 0) {
                   if($("#table" + phase).length == 0) {
                       $("#phase" + phase).append("<table style='width:100%;' id='table" + phase + "'/>");
                   }

                   phaseData.forEach(function(event){
                        if(Htmls[event.widget_title] == undefined)
                        {
                            Htmls[event.widget_title] = [];
                        }
                       var item = {html:"", date:"", phase:1};

                       /*$("#table"+phase).append(*/
                       item.html ="<tr'>" +
                           "<td>" +
                           event.phase +
                           "</td>" +
                           "<td>" +
                           (event.widget_title  != undefined ? event.widget_title : "Data Collection")+
                           "</td>" +
                           "<td>" +
                           event.html +
                           "</td>" +
                           "<td>" +
                           users[event.username].name  +
                           "</td>" +
                           "<td>" +
                           (new Date(event.startTime)).toDateString() +
                           "</td>" +
                           "</tr>";
                       item.date = new Date(event.startTime);
                       item.phase =  event.phase;
                       Htmls[event.widget_title].push(item);
                   });





               }
           });
       });
        //phases.forEach(function(phase) {
            Object.keys(Htmls).forEach(function (p) {
                //sort by date
                Htmls[p].sort(function(a,b){
                 if (a.date < b.date )return -1;
                 if (a.date > b.date) return 1;
                 return 0;
                 });




            })
        //also sort by whatever sorting we got back from ELGG
        var keys = [];
        Object.keys(Htmls).forEach(function(k)
        {
           keys.push(k);
        });
        keys.sort(function(a,b){

            var aPhase = Htmls[a].phase;
            var bPhase = Htmls[b].phase;

            //sanity check. can't sort if data isn't complete
            if(phasesThenWidgetsThenOrder[aPhase] == undefined || phasesThenWidgetsThenOrder[aPhase][a] == undefined)
                return 0;
            if(phasesThenWidgetsThenOrder[bPhase] == undefined || phasesThenWidgetsThenOrder[bPhase][b] == undefined)
                return 0;

            var aS = phasesThenWidgetsThenOrder[aPhase][a].order;
            var bS = phasesThenWidgetsThenOrder[bPhase][b].order;
            if(aS < bS) return -1;
            if(aS > bS) return 1;
            return 0;
        });

        keys.forEach(function(k){
            Htmls[k].forEach(function (o) {

                $("#table" + o.phase).append(o.html);

            })
        })
        //});
    });


   /* w.document.body.innerHTML = JSON.stringify(dataPerInquiry);
    w.document.body.innerHTML += JSON.stringify(phases);
    w.document.body.innerHTML += JSON.stringify(users);*/

    $.ajax({
        url:"/wespot/static/stylesheets/report.css",
        success:function(data){
            $("<style></style>").appendTo(w.document.head).html(data);
            $(w.document.body).html($("#report").html());

            $("#report").empty();
        }
    })

    //$(w.document.head).append("<link rel='stylesheet' href='/wespot/static/stylesheets/report.css' type='text/css' />")


}