/**
 * Created by svenc on 06/08/14.
 */
var filter = function(){

    var _data = undefined;
    var xf = undefined;
    var byPhase = undefined;
    var byUser = undefined;
    //selection
    var selectedUsers = [];
    var listenersForUserSelect = [];

    var selectedPhases = []
    var listenersForPhaseSelect = [];

    //highlighting
    var highlightedUsers = [];
    var listenersForUserHighlight = [];

    var highlightedPhases = []
    var listenersForPhaseHighlight = [];

    //filtering
    var filteredUsers = [];
    var listenersForUserFilter = [];

    var filteredPhases = []
    var listenersForPhaseFilter = [];


    return {
        "init" : function(data)
        {
            _data = data;
            xf = crossfilter(_data);
             byPhase = xf.dimension(function(p){return p.context.phase;});
             byUser = xf.dimension(function(p){return p.username.toLowerCase();});

        },
        "addListener" : function(object, type, action)
        {
          if(type == "user")
          {
              if(action == "highlight")
                listenersForUserHighlight.push(object);
              if(action == "select")
                  listenersForUserSelect.push(object);
              if(action == "filter")
                listenersForUserFilter.push(object);
              return;
          }
          if(type == "phase")
          {
              if(action == "filter")
                listenersForPhaseFilter.push(object);
              return;
          }

        },
        "getData" : function()
        {
            return _data;
        },
        "highlight" : function(filter, type)
        {


            if(type == "user")
            {
                highlightedUsers.push(filter);
                listenersForUserHighlight.forEach(function(f){
                    f.highlightUsers(highlightedUsers);
                });
                return;
            }
            if(type == "phase")
            {
                highlightedPhases.push(filter);
                listenersForPhaseHighlight.forEach(function(f){
                    f.highlightPhases(highlightedPhases);
                });
                return;
            }
        },
        "unhighlight" : function(filter, type)
        {

            if(type == "user")
            {
                highlightedUsers.splice(highlightedUsers.indexOf(filter),1);
                listenersForUserHighlight.forEach(function(f){
                    f.highlightUsers(highlightedUsers);
                });
                return;
            }
            if(type == "phase")
            {
                highlightedPhases.splice(highlightedPhases.indexOf(filter),1);
                listenersForPhaseHighlight.forEach(function(f){
                    f.highlightPhases(highlightedPhases);
                });
                return;
            }
        },
        "select" : function(filter, type)
        {
            if(type == "user")
            {
                selectedUsers.push(filter);
                listenersForUserSelect.forEach(function(f){
                    f.selectUsers(selectedUsers);
                });
                return;
            }

        },
        "deselect" : function(filter, type)
        {
            if(type == "user")
            {
                selectedUsers.splice(selectedUsers.indexOf(filter),1);
                listenersForUserSelect.forEach(function(f){
                    f.selectUsers(selectedUsers);
                });
                return;
            }

        },
        "filter" : function(filter, type)
        {
            if(type == "phase")
            {
                filteredPhases.push(filter);

               
                
                byPhase.filterFunction(function(f)
                {
                    return (filteredPhases.indexOf(f) >= 0);
                });

                listenersForPhaseFilter.forEach(function(f){
                    f.dataUpdated(byPhase.top(Infinity));
                });
                return;
            }
            if(type == "user")
            {
                filteredUsers.push(filter);

                
               
                byUser.filterFunction(function(f)
                {
                    return (filteredUsers.indexOf(f) >= 0);
                });

                listenersForUserFilter.forEach(function(f){
                    f.dataUpdated(byUser.top(Infinity));
                });
                return;
            }
        },
        "unfilter" : function(filter, type)
        {
            if(type == "phase")
            {

                filteredPhases.splice(filteredPhases.indexOf(filter),1);

                
                

                if(filteredPhases.length > 0)
                    byPhase.filterFunction(function(f) {
                        return (filteredPhases.indexOf(f) >= 0);
                    });
                else
                    byPhase.filterAll();


                listenersForPhaseFilter.forEach(function(f){
                    f.dataUpdated(byPhase.top(Infinity));
                });
                return;
            }
            if(type == "user")
            {

                filteredUsers.splice(filteredUsers.indexOf(filter),1);

                
                

                if(filteredUsers.length > 0)
                    byUser.filterFunction(function(f) {
                        return (filteredUsers.indexOf(f) >= 0);
                    });
                else
                    byUser.filterAll();


                listenersForUserFilter.forEach(function(f){
                    f.dataUpdated(byUser.top(Infinity));
                });
                return;
            }
        }


    }
}();
